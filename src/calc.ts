// ─── Типы ──────────────────────────────────────────────────────────────────
export type CalcParams = {
  S: number
  state: number       // 0=Косметика  1=White box  2=Бетон
  freeLayout: boolean
  ceiling: number     // 0=до 2,7 м  1=3 м  2=от 3,5 м
  electricity: number // 0=обновить  1=с нуля
  walls: number       // 0=только покраска  1=выровнять и покрасить
  toilet: number      // 0=без  1=санфаянс  2=трубы
  kRegion?: number    // региональный коэффициент (1.0 = Москва)
  kZone?: number      // доля клиентской зоны (0.65 по умолчанию, брендбук WB)
}

export type CalcResult = {
  cat1: number    // Стены, полы, потолок
  cat2: number    // Электрика и свет
  cat3: number    // Безопасность и IT
  cat4: number    // Санузел
  cat5: number    // Мебель WB
  reserve: number // Резерв 12%
  total: number
}

// ─── Коэффициенты по STATE ─────────────────────────────────────────────────
const K_ST = [0.4, 0.7, 1.0]   // стены
const K_FL = [0.0, 1.0, 1.0]   // пол

// ─── Высота и K_height по CEILING ─────────────────────────────────────────
const H_TABLE        = [2.5,  2.85, 3.25]
const K_HEIGHT_TABLE = [1.0,  1.15, 1.30]

// ─── Доля клиентской зоны (по умолчанию, брендбук WB) ────────────────────
const K_ZONE_DEFAULT = 0.65

// ─── Удельные стоимости кат. 1 (₽) ────────────────────────────────────────
// Стены клиентской зоны — покраска (материал ~150 + работа ~600)
const C_WALLS_CLIENT       = 750
// Доп. к стенам клиент. зоны — штукатурка + шпаклёвка (WALLS=1)
const C_WALLS_CLIENT_EXTRA = 1850
// Стены складской зоны — покраска (материал ~80 + работа ~350)
const C_WALLS_STORAGE      = 430

// Пол клиентской зоны
const C_FLOOR_TILE  = 4400   // плитка (2 100 матер. + 2 300 работа) — default
const C_FLOOR_LINO  = 1355   // линолеум (780 + 575) — тогл / склад всегда

// Потолок — грильято по брендбуку WB (1 800 + 1 500); без K_cl и K_height
const C_CEILING_GRILLATO = 3300

// Перегородка ГКЛ (1 500 матер. + 2 850 работа)
const C_PARTITION = 4350

// ─── Удельные стоимости кат. 2 (₽) ────────────────────────────────────────
const C_ELEC           = [1200, 3500]  // ₽/м² по ELEC
const C_LIGHT_CLIENT   = 3800          // светильник клиент. зоны (2 850 + 950 midpoint)
const C_LIGHT_STORAGE  = 1650          // светильник склада (1 150 + 500)
const C_EMERG_UNIT     = 2500          // аварийное освещение (1 850 + 650)

// ─── Удельные стоимости кат. 3 (₽) ────────────────────────────────────────
const C_CAMERA_UNIT = 6000   // камера: материал 3 750 + монтаж 2 250
const C_NVR         = 13000  // регистратор 9 000 + монтаж 4 000
const C_FIRE        = 23250  // сигнализация 11 500 + огнетушители 1 750 + монтаж 10 000
const C_IT          = 55000  // IT-оборудование (без K_region, фиксированные цены)

// ─── Кат. 4 (₽) ────────────────────────────────────────────────────────────
const C_TOILET_1 = 45000
const C_TOILET_2 = 120000

// ─── Мебель WB (прайс 2026) ────────────────────────────────────────────────
function calcMebel(S: number): number {
  const nFitting   = Math.min(6, Math.max(2, Math.floor(S / 25)))
  const sStorage   = S * 0.35
  const nShelves   = Math.ceil(sStorage / 15)
  const nDesk2     = S < 60 ? 1 : Math.max(1, Math.floor(S / 40))
  const nBenchHall = S <= 50 ? 1 : Math.min(3, 1 + Math.floor((S - 50) / 30))

  return (
    nFitting   * 13500 +          // примерочные
    nFitting   * 2500  +          // шторы блэк-аут
    2          * 5000  +          // скамейки белые (2 всегда)
    nBenchHall * 5000  +          // скамейка розовая
    2          * 400   +          // ложки для обуви
    nFitting   * 500   +          // коврики в примерочную
    1          * 5000  +          // зеркало в зал
    nDesk2     * 7500  +          // стол выдачи 2 ячейки
    (S > 80 ? 11500 : 0) +        // стол выдачи 3 ячейки
    1          * 6500  +          // стол для проверки малый
    (S > 70 ? 8500 : 0)  +        // стол для проверки большой
    1          * 7500  +          // стол менеджера
    1          * 3900  +          // урна
    1          * 3500  +          // стенд «Уголок потребителя»
    nShelves   * 3500  +          // стеллажи складские
    1          * 5000             // режимник WB
  )
}

// ─── Главная функция расчёта ───────────────────────────────────────────────
export function calcAll(params: CalcParams): CalcResult {
  const {
    S, state, freeLayout, ceiling, electricity, walls, toilet,
    kRegion = 1.0,
    kZone   = K_ZONE_DEFAULT,
  } = params

  const H       = H_TABLE[ceiling]
  const kHeight = K_HEIGHT_TABLE[ceiling]

  // Особый случай: Косметика + WALLS=1 → K_st = 0.9
  const kSt = (state === 0 && walls === 1) ? 0.9 : K_ST[state]
  const kFl = K_FL[state]

  // ─── Геометрия ────────────────────────────────────────────────────────
  const P = 4 * Math.sqrt(S) * 1.1

  const sWalls        = P * H
  const sWallsClient  = sWalls * kZone
  const sWallsStorage = sWalls * (1 - kZone)

  const sFloorClient  = S * kZone
  const sFloorStorage = S * (1 - kZone)

  const sPartition = freeLayout ? H * (Math.sqrt(S) * 0.5) : 0

  // ─── Категория 1 — Внутренняя отделка ────────────────────────────────
  const wallsClientUnit = walls === 0 ? C_WALLS_CLIENT : (C_WALLS_CLIENT + C_WALLS_CLIENT_EXTRA)

  const cat1 = Math.round((
    sWallsClient  * kSt * kHeight * wallsClientUnit   + // стены клиент. зоны
    sWallsStorage * kSt * kHeight * C_WALLS_STORAGE   + // стены склада
    sFloorClient  * kFl           * C_FLOOR_TILE      + // пол клиент. — плитка (default)
    sFloorStorage * kFl           * C_FLOOR_LINO      + // пол склад — линолеум
    S                             * C_CEILING_GRILLATO + // потолок грильято (без K_cl)
    sPartition                    * C_PARTITION          // перегородка (PLAN=1)
  ) * kRegion)

  // ─── Категория 2 — Электрика и свет ──────────────────────────────────
  const nLightsClient  = Math.ceil(sFloorClient  / 6)   // CEIL(S_client / 6)
  const nLightsStorage = Math.ceil(sFloorStorage / 10)  // CEIL(S_storage / 10)
  const nEmerg         = Math.ceil(S / 50)

  const cat2 = Math.round((
    S              * C_ELEC[electricity] +
    nLightsClient  * C_LIGHT_CLIENT      +
    nEmerg         * C_EMERG_UNIT        +
    nLightsStorage * C_LIGHT_STORAGE
  ) * kRegion)

  // ─── Категория 3 — Безопасность и IT ─────────────────────────────────
  const nCameras = Math.max(3, Math.ceil(S / 20))
  // IT-оборудование — без K_region (фиксированные цены поставщика)
  const cat3 = Math.round((nCameras * C_CAMERA_UNIT + C_NVR + C_FIRE) * kRegion) + C_IT

  // ─── Категория 4 — Санузел ────────────────────────────────────────────
  const toiletCosts = [0, C_TOILET_1, C_TOILET_2]
  const cat4 = Math.round(toiletCosts[toilet] * kRegion)

  // ─── Категория 5 — Мебель ────────────────────────────────────────────
  const cat5 = calcMebel(S)  // без K_region

  const totalBefore = cat1 + cat2 + cat3 + cat4 + cat5
  const reserve     = Math.round(totalBefore * 0.12)
  const total       = totalBefore + reserve

  return { cat1, cat2, cat3, cat4, cat5, reserve, total }
}

// ─── Значения по умолчанию для Экрана 1 (быстрый расчёт) ─────────────────
export const DEFAULT_CALC_PARAMS = {
  ceiling:     1 as const,    // 2,85 м → K_height = 1.15
  electricity: 1 as const,    // монтаж с нуля
  toilet:      0 as const,    // без санузла
  kRegion:     1.0,
  kZone:       K_ZONE_DEFAULT,
}

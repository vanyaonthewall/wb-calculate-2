// src/calc.ts
// Calculation engine for WB PVZ renovation calculator v8
import type { UnitSection } from './components/CalculationUnit'
import type { MaterialEntry } from './components/Material'

export interface CalcParams {
  S: number       // area m²
  state: number   // 0=Косметика, 1=White Box, 2=Бетон
  plan: boolean   // свободная планировка
  hIdx: number    // 0=до 2.7 м, 1=3 м, 2=от 3.5 м
  Kr?: number     // regional coefficient (default 1.0)
}

const H_VALS   = [2.7, 3.0, 3.5] as const
const K_HEIGHT = [1.0, 1.15, 1.30] as const
const K_ST     = [0.4, 0.7, 1.0] as const
const K_FL     = [0.0, 1.0, 1.0] as const
const K_CL     = [0.3, 0.7, 1.0] as const
const K_ZONE   = 0.65

function geo(S: number, state: number, hIdx: number) {
  const H   = H_VALS[hIdx]
  const Kh  = K_HEIGHT[hIdx]
  const Kst = K_ST[state]
  const Kfl = K_FL[state]
  const Kcl = K_CL[state]
  const P   = 4 * Math.sqrt(S) * 1.1
  const Sw  = P * H
  const Swc = Sw * K_ZONE
  const Sws = Sw * (1 - K_ZONE)
  const Sfc = S * K_ZONE
  const Sfs = S * (1 - K_ZONE)
  const Sc  = S
  const Sp  = H * Math.sqrt(S) * 0.5
  const Nfit = Math.max(2, Math.floor(S / 25))
  const Nlc  = Math.ceil(Sfc / 6)
  const Nls  = Math.ceil(Sfs / 10)
  const Ncam = Math.max(3, Math.ceil(S / 20))
  return { H, Kh, Kst, Kfl, Kcl, Swc, Sws, Sfc, Sfs, Sc, Sp, Nfit, Nlc, Nls, Ncam }
}

const r   = (n: number) => Math.round(n)
const qty = (n: number) => Math.max(1, Math.ceil(n))

// ─── Category 1: Внутренняя отделка ──────────────────────────────────────────

export function buildCat1({ S, state, plan, hIdx, Kr = 1 }: CalcParams): UnitSection[] {
  const g = geo(S, state, hIdx)

  // 1.1 Подготовка стен
  const prepWorks: { workName: string; price: number }[] = []
  const prepMats: MaterialEntry[] = []

  if (state === 2) {
    prepWorks.push({
      workName: S <= 60 ? 'Штукатурка стен по маякам, ручная' : 'Штукатурка стен машинная',
      price: r(g.Swc * 480 * g.Kh * Kr),
    })
    prepMats.push({ materialText: 'Knauf Rotband 30 кг — штукатурка стен', price: 550, quantity: qty(g.Swc * 0.28) })
  }
  if (state >= 1) {
    prepWorks.push({ workName: 'Шпаклёвка стен финишная, 2 слоя', price: r(g.Swc * 240 * Kr) })
    prepMats.push({ materialText: 'Knauf Rotband Finish 25 кг — финишная шпаклёвка', price: 720, quantity: qty(g.Swc * 0.10) })
  }
  prepWorks.push({ workName: 'Грунтовка стен', price: r((g.Swc + g.Sws) * 80 * Kr) })
  prepMats.push({ materialText: 'Knauf Tiefengrund 10 л — грунтовка', price: 950, quantity: qty((g.Swc + g.Sws) * 0.02) })

  // 1.2 Покраска стен
  const paintWorks = [
    { workName: 'Покраска основных стен, 2 слоя (клиентская зона)', price: r(g.Swc * g.Kst * 200 * Kr) },
    { workName: 'Покраска акцентной стены, 2 слоя (~25% клиентской)', price: r(g.Swc * 0.25 * 220 * Kr) },
    { workName: 'Покраска стен складской зоны, 2 слоя', price: r(g.Sws * 170 * Kr) },
    { workName: 'Покраска радиаторов отопления', price: r(2500 * Kr) },
    { workName: 'Поклейка бренд-стены (обои WB, 1 стена)', price: r(2000 * Kr) },
  ]
  const paintMats: MaterialEntry[] = [
    { materialText: 'Dulux 10BB 83/012, 9 л — светло-серый WB (клиентская зона)', price: 2800, quantity: qty(g.Swc / 45) },
    { materialText: 'Tikkurila OPC F343, 9 л — фиолетовый WB (акцентная стена)', price: 3200, quantity: qty(g.Swc * 0.25 / 40) },
    { materialText: 'Dulux белая база, 9 л — стены складской зоны', price: 2200, quantity: qty(g.Sws / 50) },
    { materialText: 'Обои виниловые WB брендбук 2026 — бренд-стена', price: 3500, quantity: 1 },
  ]

  // 1.3 Пол клиентской зоны
  const fcWorks: { workName: string; price: number }[] = []
  const fcMats: MaterialEntry[] = []
  if (state === 2) {
    fcWorks.push({ workName: 'Стяжка пола 3–5 см (клиентская зона)', price: r(g.Sfc * 600 * Kr) })
    fcMats.push({ materialText: 'Пескоцементная смесь М150, 50 кг — стяжка', price: 320, quantity: qty(g.Sfc * 1.5) })
  }
  fcWorks.push({ workName: 'Укладка керамогранита 60×60', price: r(g.Sfc * g.Kfl * 1100 * Kr) })
  fcWorks.push({ workName: 'Монтаж плинтуса из плитки', price: r(Math.sqrt(g.Sfc) * 4 * 300 * g.Kfl * Kr) })
  fcMats.push({ materialText: 'Kerama Marazzi Terrazzo 566324008, 60×60 (светло-серый)', price: 2100, quantity: qty(g.Sfc * g.Kfl * 1.07) })
  fcMats.push({ materialText: 'Knauf Flexkleber, 25 кг — клей для керамогранита', price: 880, quantity: qty(g.Sfc * g.Kfl * 0.20) })
  fcMats.push({ materialText: 'Ceresit CE 33, 25 кг, серый 07 — затирка швов', price: 640, quantity: qty(g.Sfc * g.Kfl * 0.05) })

  // 1.4 Пол складской зоны
  const fsWorks: { workName: string; price: number }[] = []
  const fsMats: MaterialEntry[] = []
  if (state === 2) {
    fsWorks.push({ workName: 'Стяжка пола 3–5 см (складская зона)', price: r(g.Sfs * 600 * Kr) })
    fsMats.push({ materialText: 'Пескоцементная смесь М150, 50 кг — стяжка', price: 320, quantity: qty(g.Sfs * 1.5) })
  }
  fsWorks.push({ workName: 'Укладка линолеума коммерческого', price: r(g.Sfs * 380 * Kr) })
  fsMats.push({ materialText: 'Tarkett Acczent Pro, оттенок 712 — линолеум коммерческий', price: 780, quantity: qty(g.Sfs * 1.10) })

  // 1.5 Потолок — грильято (default)
  const cgWorks = [
    { workName: 'Монтаж системы потолка грильято 100×100, ячейка 10×10', price: r(g.Sc * 1500 * Kr) },
  ]
  const cgMats: MaterialEntry[] = [
    { materialText: 'Система грильято 100×100 белая, ячейка 10×10', price: 1800, quantity: qty(g.Sc) },
    { materialText: 'Профиль CD 60×27, 3 м — несущий каркас', price: 85, quantity: qty(g.Sc * 0.7) },
  ]

  // 1.5 alt Потолок — покраска
  const cpWorks = [
    { workName: 'Покраска потолка, 2 слоя', price: r(g.Sc * g.Kcl * g.Kh * 240 * Kr) },
  ]
  const cpMats: MaterialEntry[] = [
    { materialText: 'Dulux белая база, 9 л (1 вед./50 м²)', price: 2200, quantity: qty(g.Sc / 50) },
  ]

  // 1.6 Перегородка
  const Sp = g.Sp
  const partWorks = [
    { workName: 'Возведение ГКЛ-перегородки с двух сторон + шпаклёвка', price: r(Sp * 2700 * Kr) },
    { workName: 'Звукоизоляция перегородки', price: r(Sp * 580 * Kr) },
    { workName: 'Установка дверного блока в перегородке', price: r(6000 * Kr) },
  ]
  const partMats: MaterialEntry[] = [
    { materialText: 'ГКЛ стандартный 12.5 мм, 2500×1200 (0.7 листа/м²)', price: 480, quantity: qty(Sp * 0.7) },
    { materialText: 'Профиль CD 60×27 + UW 75×40, 3 м — каркас', price: 87, quantity: qty(Sp * 2) },
    { materialText: 'Knauf Insulation рул. 1.2×5 м, 50 мм — звукоизоляция', price: 1100, quantity: qty(Sp * 0.17) },
    { materialText: 'Дверной блок белый/светло-серый', price: 11500, quantity: 1 },
  ]

  return [
    {
      name: 'Подготовка стен',
      description: state === 2 ? 'Штукатурка, шпаклёвка и грунтовка'
                 : state === 1 ? 'Шпаклёвка и грунтовка перед покраской'
                               : 'Грунтовка перед покраской',
      initialActive: state >= 1,
      works: prepWorks,
      materials: prepMats,
    },
    {
      name: 'Покраска стен',
      description: 'Покраска в цвета брендбука WB — клиентская и складская зоны',
      works: paintWorks,
      materials: paintMats,
    },
    {
      name: 'Пол в клиентской зоне',
      description: 'Укладка керамогранита Kerama Marazzi по стандарту WB',
      initialActive: g.Kfl > 0,
      works: fcWorks,
      materials: fcMats,
    },
    {
      name: 'Пол в складской зоне',
      description: 'Линолеум коммерческий Tarkett — складская зона',
      works: fsWorks,
      materials: fsMats,
    },
    {
      name: 'Потолок — грильято',
      description: 'Подвесной потолок грильято 100×100, ячейка 10×10 — брендбук WB',
      mutuallyExclusiveGroup: 'ceiling',
      works: cgWorks,
      materials: cgMats,
    },
    {
      name: 'Потолок — покраска',
      description: 'Покраска потолка в белый цвет — альтернатива грильято',
      initialActive: false,
      mutuallyExclusiveGroup: 'ceiling',
      skipScaling: true,
      works: cpWorks,
      materials: cpMats,
    },
    {
      name: 'Перегородка',
      description: 'Возведение ГКЛ-перегородки для зонирования помещения',
      initialActive: plan,
      works: partWorks,
      materials: partMats,
    },
  ]
}

// ─── Category 2: Электрика и свет ────────────────────────────────────────────

export function buildCat2({ S, state, hIdx, Kr = 1 }: CalcParams): UnitSection[] {
  const g = geo(S, state, hIdx)

  // 2.1a Обновление электрики (STATE=0)
  const updateWorks = [
    { workName: 'Замена светильников и розеток без новых линий', price: r(S * 1200 * Kr) },
  ]
  const updateMats: MaterialEntry[] = [
    { materialText: 'Розетки накладные белые Legrand/Werkel — над примерочными', price: 280, quantity: 4 },
    { materialText: 'Розетки накладные чёрные Legrand/Werkel — стол проверки', price: 320, quantity: 2 },
  ]

  // 2.1b Монтаж с нуля (STATE>=1)
  const newElecWorks = [
    { workName: 'Прокладка кабелей, кабель-каналы, розетки', price: r(S * 2800 * Kr) },
    { workName: 'Монтаж электрощитка и подключение автоматов', price: r(5500 * Kr) },
  ]
  const newElecMats: MaterialEntry[] = [
    { materialText: 'Кабель ВВГнг-LS 3×1.5, 100 м — осветительные цепи', price: 3800, quantity: qty(S * 0.4 / 50) },
    { materialText: 'Кабель ВВГнг-LS 3×2.5, 100 м — розеточные цепи', price: 5200, quantity: qty(S * 0.7 / 50) },
    { materialText: 'Гофра ПВД 16 мм, 100 м — защита кабеля', price: 1100, quantity: qty(S / 50) },
    { materialText: 'Кабель-канал 40×16 мм белый, 2 м', price: 180, quantity: qty(S * 4 / 10) },
    { materialText: 'Щиток навесной 8–12 мод., автоматы ABB/Schneider', price: 5500, quantity: 1 },
    { materialText: 'Розетки накладные белые Legrand/Werkel', price: 280, quantity: 4 },
    { materialText: 'Розетки накладные чёрные Legrand/Werkel', price: 320, quantity: 2 },
  ]

  // 2.2 Свет клиентская зона
  const Nlc = g.Nlc
  const lightCWorks = [
    { workName: 'Монтаж линейных светильников 900 мм', price: r(Nlc * 800 * Kr) },
    { workName: 'Монтаж блока аварийного освещения', price: r(650 * Kr) },
  ]
  const lightCMats: MaterialEntry[] = [
    { materialText: 'Светильник линейный 900 мм накладной белый, 4000–5000К IP44', price: 2850, quantity: Nlc },
    { materialText: 'Блок аварийного питания ≥1 ч Feron/Camelion', price: 1850, quantity: qty(S / 50) },
  ]

  // 2.3 Свет складская зона
  const Nls = g.Nls
  const lightSWorks = [
    { workName: 'Монтаж накладных светильников складской зоны', price: r(Nls * 500 * Kr) },
  ]
  const lightSMats: MaterialEntry[] = [
    { materialText: 'Светильник накладной LED (складская зона)', price: 1150, quantity: Nls },
  ]

  return [
    {
      name: 'Обновление электрики',
      description: 'Замена светильников и розеток без прокладки новых линий',
      initialActive: state === 0,
      mutuallyExclusiveGroup: 'electricity',
      works: updateWorks,
      materials: updateMats,
    },
    {
      name: 'Электромонтаж с нуля',
      description: 'Прокладка новых линий: кабели, кабель-каналы, розетки, щиток',
      initialActive: state >= 1,
      mutuallyExclusiveGroup: 'electricity',
      works: newElecWorks,
      materials: newElecMats,
    },
    {
      name: 'Свет в клиентской зоне',
      description: `Линейные светильники (${Nlc} шт.) и аварийное освещение`,
      works: lightCWorks,
      materials: lightCMats,
    },
    {
      name: 'Свет в складской зоне',
      description: `Накладные светильники складской зоны (${Nls} шт.)`,
      works: lightSWorks,
      materials: lightSMats,
    },
  ]
}

// ─── Category 3: Безопасность и IT ───────────────────────────────────────────

export function buildCat3({ S, state, hIdx, Kr = 1 }: CalcParams): UnitSection[] {
  const g = geo(S, state, hIdx)
  const Ncam = g.Ncam
  return [
    {
      name: 'Видеонаблюдение',
      description: `IP-камеры (${Ncam} шт.), видеорегистратор и HDD`,
      works: [
        { workName: 'Монтаж и настройка камер видеонаблюдения', price: r(Ncam * 2000 * Kr) },
        { workName: 'Монтаж видеорегистратора и HDD', price: r(4000 * Kr) },
      ],
      materials: [
        { materialText: 'Камера IP 2 Мп Hikvision/Dahua', price: 3750, quantity: Ncam },
        { materialText: 'NVR 4–8 каналов', price: 6750, quantity: 1 },
        { materialText: 'HDD 1–2 ТБ', price: 4750, quantity: 1 },
      ],
    },
    {
      name: 'Пожарная безопасность',
      description: 'Сигнализация, огнетушители и световые указатели',
      works: [
        { workName: 'Монтаж пожарной сигнализации (базовый комплект)', price: r(8000 * Kr) },
        { workName: 'Установка огнетушителей', price: r(800 * Kr) },
        { workName: 'Монтаж световых указателей «Выход»', price: r(1200 * Kr) },
      ],
      materials: [
        { materialText: 'Панель пожарной сигнализации — базовый комплект', price: 11500, quantity: 1 },
        { materialText: 'Огнетушитель ОП-2, 2 кг', price: 750, quantity: 2 },
        { materialText: 'Световой указатель «Выход» LED', price: 900, quantity: 2 },
      ],
    },
    {
      name: 'IT-оборудование',
      description: 'Ноутбук, сканер и роутер по брендбуку WB',
      works: [],
      materials: [
        { materialText: 'Ноутбук для сотрудника 14–15"', price: 50000, quantity: 1 },
        { materialText: 'Сканер штрих-кодов 1D/2D Honeywell/Datalogic', price: 3000, quantity: 1 },
        { materialText: 'Роутер / Wi-Fi точка доступа TP-Link / Keenetic', price: 3000, quantity: 1 },
      ],
    },
  ]
}

// ─── Category 4: Санузел ─────────────────────────────────────────────────────

export function buildCat4({ Kr = 1 }: CalcParams): UnitSection[] {
  return [
    {
      name: 'Только санфаянс',
      description: 'Монтаж унитаза и раковины к готовым выводам + покраска стен',
      initialActive: true,
      mutuallyExclusiveGroup: 'toilet',
      works: [
        { workName: 'Монтаж унитаза + раковины (подключение к готовым выводам)', price: r(11000 * Kr) },
        { workName: 'Покраска стен санузла (влагостойкая краска, 2 слоя)', price: r(8000 * Kr) },
      ],
      materials: [
        { materialText: 'Унитаз компакт + раковина по выбору', price: 22000, quantity: 1 },
        { materialText: 'Краска влагостойкая матовая, 9 л', price: 1800, quantity: 1 },
      ],
    },
    {
      name: 'Прокладка труб под ключ',
      description: 'Полный монтаж: трубы, стены санузла, гидроизоляция, плитка, санфаянс',
      initialActive: false,
      mutuallyExclusiveGroup: 'toilet',
      works: [
        { workName: 'Прокладка труб водоснабжения + канализации', price: r(30000 * Kr) },
        { workName: 'Возведение стен санузла', price: r(15000 * Kr) },
        { workName: 'Гидроизоляция пола санузла', price: r(5000 * Kr) },
        { workName: 'Укладка плитки (пол + стены санузла)', price: r(25000 * Kr) },
        { workName: 'Монтаж унитаза + раковины', price: r(11000 * Kr) },
      ],
      materials: [
        { materialText: 'Трубы ПП 20/25/32, фитинги, канализационная ПВХ', price: 12000, quantity: 1 },
        { materialText: 'ГКЛ влагостойкий (ГКЛВ) 12.5 мм + профили', price: 520, quantity: 6 },
        { materialText: 'Ceresit CL 50 — обмазочная гидроизоляция', price: 1800, quantity: 3 },
        { materialText: 'Плитка керамическая 600×600 + затирка + клей', price: 2200, quantity: 8 },
        { materialText: 'Унитаз компакт + раковина по выбору', price: 22000, quantity: 1 },
      ],
    },
  ]
}

// ─── Category 5: Мебель ──────────────────────────────────────────────────────

export function buildMebel(S: number): MaterialEntry[] {
  const Nfit   = Math.max(2, Math.floor(S / 25))
  const Nbench = 1 + Math.floor(Math.max(0, S - 50) / 30)
  const Ndesk2 = S <= 80 ? Math.max(1, Math.floor(S / 40)) : 0
  const Ndesk3 = S > 80 ? 1 : 0
  const Nbig   = S > 70 ? 1 : 0
  const Nshelf = Math.ceil((S * 0.35) / 15)

  const items: MaterialEntry[] = [
    { materialText: 'Примерочная 120×120×200 см',              price: 13500, quantity: Nfit   },
    { materialText: 'Штора блэк-аут в примерочную',           price:  2500, quantity: Nfit   },
    { materialText: 'Скамейка белая 900×360×490 мм',           price:  5000, quantity: 2      },
    { materialText: 'Скамейка розовая 900×360×490 мм',         price:  5000, quantity: Nbench },
    { materialText: 'Ложка для обуви фиолетовая',              price:   400, quantity: 2      },
    { materialText: 'Коврики в примерочную 63×40 см (компл.)', price:   500, quantity: Nfit   },
    { materialText: 'Зеркало в зал 700×1300 мм',               price:  5000, quantity: 1      },
    { materialText: 'Урна с наклейкой WB',                     price:  3900, quantity: 1      },
    { materialText: 'Стенд «Уголок потребителя» 50×75 см',    price:  3500, quantity: 1      },
    { materialText: 'Стол менеджера 800×800×1284 мм',          price:  7500, quantity: 1      },
    { materialText: 'Стол для проверки 800×530×1050 мм',       price:  6500, quantity: 1      },
    { materialText: 'Стеллаж металлический 4 полки',           price:  3500, quantity: Nshelf },
    { materialText: 'Режимник WB',                             price:  5000, quantity: 1      },
  ]
  if (Ndesk2 > 0) items.push({ materialText: 'Стол выдачи на 2 ячейки 960×700×1050 мм', price: 7500, quantity: Ndesk2 })
  if (Ndesk3 > 0) items.push({ materialText: 'Стол выдачи на 3 ячейки 1400×700×1050 мм', price: 11500, quantity: 1 })
  if (Nbig > 0)   items.push({ materialText: 'Стол для проверки большой 930×750×1050 мм', price: 8500, quantity: 1 })
  return items
}

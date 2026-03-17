import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Ic } from './Ic'
import { Icon } from './Icon'
import { IcControl } from './IcControl'
import { Chip } from './Chip'
import { CalculationUnit, type UnitSection } from './CalculationUnit'
import { AnimatedHeight } from './AnimatedHeight'
import { AnimatedNumber } from './AnimatedPrice'
import { Banner } from './Banner'
import type { PriceRow } from './PriceBox'
import type { MaterialEntry } from './Material'
import type { Step2Params } from './StepTwo'
import { calcAll } from '../calc'
import wallImg from '../img/picture=wall.png'
import sofaImg from '../img/picture=sofa.png'
import lumaImg from '../img/picture=luma.png'
import cameraImg from '../img/picture=camera.png'
import coinsImg from '../img/picture=coins.png'
import toiletImg from '../img/picture=toilet.png'

// ─── Секции кат. 1: Внутренняя отделка ───────────────────────────────────
function getCat1Sections(state: number, walls: number, freeLayout: boolean): UnitSection[] {
  const showFloor     = state !== 0                 // K_fl=0 для Косметики
  const showStyazhka  = state === 2                 // только Бетон
  const showDemontazh = state === 0 && walls === 1  // Косметика + выравнивание
  const showPlaster   = walls === 1 || state === 2

  // 1.1 Подготовка стен (только если есть реальные работы)
  const hasPrep = showDemontazh || showPlaster
  const prepSection: UnitSection | null = hasPrep ? {
    name: 'Подготовка стен',
    description: 'Демонтаж, штукатурка и шпаклёвка перед покраской',
    works: [
      ...(showDemontazh ? [{ workName: 'Демонтаж старого покрытия', price: 5500 }] : []),
      ...(showPlaster   ? [{ workName: 'Штукатурка стен по маякам, ручная', price: 8000 }] : []),
      ...(walls === 1   ? [{ workName: 'Финишная шпаклёвка стен, 2 слоя', price: 4500 }] : []),
      { workName: 'Грунтовка стен перед покраской', price: 1800 },
    ],
    materials: [
      ...(showPlaster ? [{ materialText: 'Knauf Rotband 30 кг — штукатурка стен', price: 550, quantity: 5 }] : []),
      ...(walls === 1 ? [{ materialText: 'Knauf Rotband Finish 25 кг — финишная шпаклёвка', price: 720, quantity: 3 }] : []),
      { materialText: 'Knauf Tiefengrund 10 л — грунтовка глубокого проникновения', price: 950, quantity: 1 },
    ],
  } : null

  // 1.2 Покраска стен (клиентская + складская зоны)
  const paintSection: UnitSection = {
    name: 'Покраска стен',
    description: 'Покраска в цвета брендбука WB — клиентская и складская зоны',
    works: [
      { workName: 'Покраска основных стен, 2 слоя', price: 6000 },
      { workName: 'Покраска акцентной стены, 2 слоя', price: 2500 },
      { workName: 'Покраска стен складской зоны, 2 слоя', price: 4000 },
      { workName: 'Поклейка бренд-стены', price: 1750 },
    ],
    materials: [
      { materialText: 'Dulux 10BB 83/012, 9 л — светло-серый WB, основные стены клиентской зоны', price: 2800, quantity: 1 },
      { materialText: 'Tikkurila OPC F343, 9 л — фиолетовый WB, акцентная стена', price: 3200, quantity: 1 },
      { materialText: 'Dulux белая база, 9 л — стены складской зоны', price: 2200, quantity: 1 },
      { materialText: 'Обои виниловые WB брендбук 2026 — бренд-стена', price: 3500, quantity: 1 },
    ],
  }

  // 1.3 Пол в клиентской зоне
  const clientFloorSection: UnitSection = {
    name: 'Пол в клиентской зоне',
    description: 'Укладка керамогранита Kerama Marazzi по стандарту WB',
    works: [
      ...(showStyazhka ? [{ workName: 'Стяжка пола 3–5 см', price: 8000 }] : []),
      { workName: 'Укладка керамогранита 60×60', price: 28000 },
      { workName: 'Монтаж плинтуса из плитки', price: 4500 },
    ],
    materials: [
      { materialText: 'Kerama Marazzi Terrazzo 566324008, 60×60 (светло-серый)', price: 2100, quantity: 35 },
      ...(showStyazhka ? [{ materialText: 'Пескоцементная смесь М150, 50 кг', price: 320, quantity: 8 }] : []),
      { materialText: 'Knauf Flexkleber, 25 кг — клей для керамогранита', price: 880, quantity: 4 },
      { materialText: 'Ceresit CE 33, 25 кг, серый 07 — затирка швов', price: 640, quantity: 2 },
    ],
  }

  // 1.4 Пол на складе
  const storageFloorSection: UnitSection = {
    name: 'Пол на складе',
    description: 'Линолеум коммерческий Tarkett — складская зона',
    works: [
      ...(showStyazhka ? [{ workName: 'Стяжка пола 3–5 см', price: 4000 }] : []),
      { workName: 'Укладка линолеума коммерческого', price: 6000 },
    ],
    materials: [
      { materialText: 'Tarkett Acczent Pro, оттенок 712 — линолеум коммерческий', price: 780, quantity: 10 },
      ...(showStyazhka ? [{ materialText: 'Пескоцементная смесь М150, 50 кг', price: 320, quantity: 4 }] : []),
    ],
  }

  // 1.5 Потолок — грильято (дефолт, брендбук WB)
  const ceilingGrillatoSection: UnitSection = {
    name: 'Потолок — грильято',
    description: 'Подвесной потолок грильято 100×100, ячейка 10×10 — брендбук WB',
    mutuallyExclusiveGroup: 'ceiling',
    works: [
      { workName: 'Монтаж системы потолка грильято 100×100, ячейка 10×10', price: 15000 },
    ],
    materials: [
      { materialText: 'Система грильято 100×100 белая (1 м²/м²; 1 800 ₽/м²)', price: 1800, quantity: 10 },
      { materialText: 'Профиль CD 60×27, 3 м — несущий каркас', price: 85, quantity: 7 },
    ],
  }

  // 1.6 Потолок — покраска (альтернатива, по умолчанию выключен)
  const ceilingPaintSection: UnitSection = {
    name: 'Потолок — покраска',
    description: 'Покраска потолка в белый цвет — альтернатива грильято',
    initialActive: false,
    mutuallyExclusiveGroup: 'ceiling',
    skipScaling: true,
    works: [
      { workName: 'Покраска потолка, 2 слоя', price: 9000 },
    ],
    materials: [
      { materialText: 'Dulux белая база, 9 л (1 вед./50 м²; 2 200 ₽/вед.)', price: 2200, quantity: 1 },
    ],
  }

  const sections: UnitSection[] = [
    ...(prepSection ? [prepSection] : []),
    paintSection,
    ...(showFloor ? [clientFloorSection, storageFloorSection] : []),
    ceilingGrillatoSection,
    ceilingPaintSection,
  ]

  // 1.7 Перегородка (только PLAN=Свободная планировка)
  if (freeLayout) {
    sections.push({
      name: 'Перегородка',
      description: 'Возведение ГКЛ-перегородки для зонирования помещения',
      works: [
        { workName: 'Возведение ГКЛ-перегородки с двух сторон + шпаклёвка', price: 12000 },
        { workName: 'Звукоизоляция перегородки', price: 3000 },
        { workName: 'Установка дверного блока в перегородке', price: 6000 },
      ],
      materials: [
        { materialText: 'ГКЛ стандартный 12.5 мм, 2500×1200 (0.7 листа/м²; 480 ₽/лист)', price: 480, quantity: 6 },
        { materialText: 'Профиль CD 60×27 + UW 75×40, 3 м — каркас', price: 85, quantity: 10 },
        { materialText: 'Knauf Insulation рул. 1.2×5 м, 50 мм — звукоизоляция', price: 1100, quantity: 2 },
        { materialText: 'Дверной блок белый/светло-серый', price: 10000, quantity: 1 },
      ],
    })
  }

  return sections
}

// ─── Секции кат. 2: Электрика и свет ─────────────────────────────────────
function getCat2Sections(electricity: number): UnitSection[] {
  // 2.1 Электромонтаж
  const elecSection: UnitSection = electricity === 1 ? {
    name: 'Электромонтаж',
    description: 'Монтаж электрики с нуля: кабели, кабель-каналы, розетки',
    works: [
      { workName: 'Монтаж электрики с нуля: прокладка кабелей, кабель-каналы, розетки', price: 25000 },
      { workName: 'Монтаж электрощитка и подключение автоматов', price: 5500 },
    ],
    materials: [
      { materialText: 'Кабель ВВГнг-LS 3×1.5, 100 м — осветительные цепи', price: 3800, quantity: 1 },
      { materialText: 'Кабель ВВГнг-LS 3×2.5, 100 м — розеточные цепи', price: 5200, quantity: 1 },
      { materialText: 'Гофра ПВД 16 мм, 100 м — защита кабеля', price: 1100, quantity: 1 },
      { materialText: 'Кабель-канал 40×16 мм белый, 2 м', price: 180, quantity: 4 },
      { materialText: 'Щиток навесной 8–12 мод.', price: 2500, quantity: 1 },
      { materialText: 'Автоматы ABB/Schneider 10–25А', price: 350, quantity: 6 },
    ],
  } : {
    name: 'Электромонтаж',
    description: 'Обновление электрики: замена светильников и розеток без новых линий',
    works: [
      { workName: 'Обновление электрики: замена светильников и розеток без новых линий', price: 12000 },
    ],
    materials: [
      { materialText: 'Розетки накладные белые Legrand/Werkel — над примерочными, стол менеджера', price: 250, quantity: 4 },
      { materialText: 'Розетки накладные чёрные Legrand/Werkel — стол проверки, по брендбуку WB', price: 280, quantity: 2 },
    ],
  }

  return [
    elecSection,
    // 2.2 Свет в клиентской зоне
    {
      name: 'Свет в клиентской зоне',
      description: 'Линейные светильники и аварийное освещение по брендбуку WB',
      works: [
        { workName: 'Монтаж линейных светильников 900 мм', price: 6000 },
        { workName: 'Монтаж блока аварийного освещения', price: 650 },
      ],
      materials: [
        { materialText: 'Светильник линейный 900 мм накладной белый, 4000–5000К IP44', price: 2850, quantity: 6 },
        { materialText: 'Блок аварийного питания ≥1 ч Feron/Camelion', price: 1850, quantity: 1 },
      ],
    },
    // 2.3 Свет на складе
    {
      name: 'Свет на складе',
      description: 'Накладные светильники по нормативу складской зоны',
      works: [
        { workName: 'Монтаж накладных светильников', price: 2000 },
      ],
      materials: [
        { materialText: 'Светильник накладной LED (простой)', price: 1150, quantity: 2 },
      ],
    },
  ]
}

// ─── Секции кат. 3: Безопасность и IT ────────────────────────────────────
function getCat3Sections(): UnitSection[] {
  return [
    {
      name: 'Видеонаблюдение',
      description: 'IP-камеры, видеорегистратор и HDD',
      works: [
        { workName: 'Монтаж + настройка камер', price: 6000 },
        { workName: 'Монтаж видеорегистратора + HDD', price: 4000 },
      ],
      materials: [
        { materialText: 'Камера IP 2 Мп Hikvision/Dahua', price: 3750, quantity: 3 },
        { materialText: 'NVR 4–8 каналов', price: 6750, quantity: 1 },
        { materialText: 'HDD 1–2 ТБ', price: 4750, quantity: 1 },
      ],
    },
    {
      name: 'Пожарная безопасность',
      description: 'Сигнализация, огнетушители и световые указатели',
      works: [
        { workName: 'Монтаж пожарной сигнализации (базовый комплект)', price: 10000 },
        { workName: 'Установка огнетушителей', price: 800 },
        { workName: 'Монтаж световых указателей «Выход»', price: 1200 },
      ],
      materials: [
        { materialText: 'Панель пожарной сигнализации — базовый комплект', price: 11500, quantity: 1 },
        { materialText: 'Огнетушитель ОП-2, 2 кг', price: 750, quantity: 2 },
        { materialText: 'Световой указатель «Выход» LED', price: 900, quantity: 2 },
      ],
    },
    {
      name: 'IT-оборудование',
      description: 'Ноутбук, сканер и роутер по брендбуку WB (без регионального коэффициента)',
      works: [],
      materials: [
        { materialText: 'Ноутбук для сотрудника 14–15"', price: 50000, quantity: 1 },
        { materialText: 'Сканер штрих-кодов 1D/2D Honeywell / Datalogic', price: 3000, quantity: 1 },
        { materialText: 'Роутер / Wi-Fi точка доступа TP-Link / Keenetic', price: 3000, quantity: 1 },
      ],
    },
  ]
}

// ─── Секции кат. 4: Санузел ───────────────────────────────────────────────
function getCat4Sections(toilet: number): UnitSection[] {
  if (toilet === 0) return []
  if (toilet === 1) {
    return [{
      name: 'Только санфаянс',
      description: 'Монтаж унитаза и раковины к готовым выводам',
      works: [
        { workName: 'Монтаж унитаза + раковины (подключение к готовым выводам)', price: 11000 },
        { workName: 'Покраска стен санузла (износостойкая краска 2 слоя)', price: 8000 },
      ],
      materials: [
        { materialText: 'Унитаз компакт + раковина по выбору', price: 11000, quantity: 1 },
        { materialText: 'Краска износостойкая для влажных помещений', price: 2800, quantity: 1 },
      ],
    }]
  }
  // toilet === 2
  return [{
    name: 'Прокладка труб — под ключ',
    description: 'Полный монтаж санузла с нуля',
    works: [
      { workName: 'Прокладка труб водоснабжения + канализации', price: 30000 },
      { workName: 'Возведение стен санузла', price: 15000 },
      { workName: 'Гидроизоляция пола санузла', price: 5000 },
      { workName: 'Укладка плитки (пол + стены санузла)', price: 25000 },
      { workName: 'Монтаж унитаза + раковины', price: 11000 },
    ],
    materials: [
      { materialText: 'Трубы ПП 20/25/32, фитинги, канализационная ПВХ', price: 12000, quantity: 1 },
      { materialText: 'ГКЛ влагостойкий (ГКЛВ) 12.5 мм', price: 480, quantity: 6 },
      { materialText: 'Гидроизоляция обмазочная Ceresit CL 50', price: 950, quantity: 3 },
      { materialText: 'Плитка керамическая 600×600 (влажные помещения)', price: 3000, quantity: 8 },
      { materialText: 'Унитаз компакт + раковина по выбору', price: 11000, quantity: 1 },
    ],
  }]
}

// ─── Мебель WB: список позиций по площади ────────────────────────────────
function getMebelItems(S: number): MaterialEntry[] {
  const nFitting   = Math.min(6, Math.max(2, Math.floor(S / 25)))
  const sStorage   = S * 0.35
  const nShelves   = Math.ceil(sStorage / 15)
  const nDesk2     = S < 60 ? 1 : Math.max(1, Math.floor(S / 40))
  const nBenchHall = S <= 50 ? 1 : Math.min(3, 1 + Math.floor((S - 50) / 30))

  const items: MaterialEntry[] = [
    { materialText: 'Примерочная 120×120×200 см', price: 13500, quantity: nFitting },
    { materialText: 'Штора блэк-аут в примерочную', price: 2500, quantity: nFitting },
    { materialText: 'Скамейка белая (в примерочную) 900×360×490 мм', price: 5000, quantity: 2 },
    { materialText: 'Скамейка розовая (в зал) 900×360×490 мм', price: 5000, quantity: nBenchHall },
    { materialText: 'Ложка для обуви фиолетовая (в примерочную)', price: 400, quantity: 2 },
    { materialText: 'Коврики в примерочную 63×40 см (компл. 2 шт.)', price: 500, quantity: nFitting },
    { materialText: 'Зеркало в зал 700×1300 мм (скруглённые углы)', price: 5000, quantity: 1 },
    { materialText: 'Стол выдачи на 2 ячейки 960×700×1050 мм', price: 7500, quantity: nDesk2 },
    { materialText: 'Стол для проверки малый 800×530×1050 мм', price: 6500, quantity: 1 },
    { materialText: 'Стол менеджера 800×800×1284 мм', price: 7500, quantity: 1 },
    { materialText: 'Урна с наклейкой 640×680×480 мм', price: 3900, quantity: 1 },
    { materialText: 'Стенд «Уголок потребителя» с наполнением 50×75 см', price: 3500, quantity: 1 },
    { materialText: 'Стеллаж металлический складской (4 полки) 1500×750×300 мм', price: 3500, quantity: nShelves },
    { materialText: 'Режимник WB', price: 5000, quantity: 1 },
  ]

  if (S > 80) items.push({ materialText: 'Стол выдачи на 3 ячейки 1400×700×1050 мм', price: 11500, quantity: 1 })
  if (S > 70) items.push({ materialText: 'Стол для проверки большой 930×750×1050 мм', price: 8500, quantity: 1 })

  return items
}

// ─── Категории в смете ────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Внутренняя отделка', imageUrl: wallImg   },
  { name: 'Электрика и свет',   imageUrl: lumaImg   },
  { name: 'Безопасность и IT',  imageUrl: cameraImg },
  { name: 'Санузел',            imageUrl: toiletImg },
  { name: 'Мебель',             imageUrl: sofaImg   },
  { name: 'Резерв 12%',         imageUrl: coinsImg  },
]

// ─── Props ────────────────────────────────────────────────────────────────
type StepThreeProps = {
  areaStr: string
  rows?: PriceRow[]       // kept for PriceBox on steps 1–2; not used in StepThree itself
  globalTotal?: number    // kept for legacy compatibility
  condition?: number
  step2Params?: Step2Params
  onClose?: () => void
  onTotalChange?: (total: number) => void
}

const EASE = 'cubic-bezier(0.4,0,0.2,1)'

export function StepThree({
  areaStr,
  rows: _rows,
  globalTotal: _globalTotal,
  condition = 0,
  step2Params,
  onClose,
  onTotalChange,
}: StepThreeProps) {
  const [unitTotals, setUnitTotals] = useState<Record<number, number>>({})
  const computedTotal = Object.values(unitTotals).reduce((sum, v) => sum + v, 0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const onTotalChangeRef = useRef(onTotalChange)
  onTotalChangeRef.current = onTotalChange
  useEffect(() => {
    onTotalChangeRef.current?.(computedTotal)
  }, [computedTotal])

  const makeOnTotalChange = useCallback(
    (i: number) => (t: number) => setUnitTotals(prev => ({ ...prev, [i]: t })),
    []
  )

  // Параметры объекта
  const initTotal = Math.round(parseFloat(areaStr.replace(',', '.')) || 35)
  const [paramsOpen, setParamsOpen] = useState(false)
  const [totalArea, setTotalArea] = useState(initTotal)
  const [clientZone, setClientZone] = useState(Math.round(initTotal * 0.65))
  const sklad = totalArea - clientZone

  const nextTotalIncrRow = useRef<'client' | 'sklad'>('sklad')

  const handleTotalInc = () => {
    setTotalArea(t => t + 1)
    if (nextTotalIncrRow.current === 'client') {
      setClientZone(c => c + 1)
      nextTotalIncrRow.current = 'sklad'
    } else {
      nextTotalIncrRow.current = 'client'
    }
  }

  const handleTotalDec = () => {
    const newTotal = Math.max(2, totalArea - 1)
    if (newTotal === totalArea) return
    setTotalArea(newTotal)
    if (newTotal - clientZone < 1) setClientZone(c => Math.max(1, c - 1))
  }

  const handleClientInc = () => { if (sklad > 1) setClientZone(c => c + 1) }
  const handleClientDec = () => { if (clientZone > 1) setClientZone(c => c - 1) }
  const handleSkladInc  = () => { if (clientZone > 1) setClientZone(c => c - 1) }
  const handleSkladDec  = () => { if (sklad > 1) setClientZone(c => c + 1) }

  const p2 = step2Params ?? { ceiling: 1, electricity: 1, walls: condition === 0 ? 0 : 1, toilet: 0, freeLayout: false }

  // Точные суммы по категориям из полных параметров (используем totalArea — локальное состояние)
  const categoryTotals = useMemo(() => {
    const S     = Math.max(1, totalArea)
    const kZone = S > 0 ? Math.max(0.01, Math.min(0.99, clientZone / S)) : 0.65
    const res   = calcAll({
      S,
      state:       condition,
      freeLayout:  p2.freeLayout,
      ceiling:     p2.ceiling,
      electricity: p2.electricity,
      walls:       p2.walls,
      toilet:      p2.toilet,
      kZone,
    })
    return [res.cat1, res.cat2, res.cat3, res.cat4, res.cat5, res.reserve]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalArea, clientZone, condition, p2.freeLayout, p2.ceiling, p2.electricity, p2.walls, p2.toilet])

  // Площадь для расчёта секций
  const S = Math.max(1, totalArea)

  const categorySections = useMemo((): (UnitSection[] | undefined)[] => [
    getCat1Sections(condition, p2.walls, p2.freeLayout),
    getCat2Sections(p2.electricity),
    getCat3Sections(),
    // toilet=0: показываем секции toilet=1 (выключены), чтобы их можно было включить
    getCat4Sections(p2.toilet > 0 ? p2.toilet : 1),
    undefined, // Мебель — flatMaterials
    undefined, // Резерв — не раскрывается
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [condition, p2.walls, p2.freeLayout, p2.electricity, p2.toilet])

  const mebelItems = useMemo(() => getMebelItems(S), [S])

  return (
    <div className="h-full flex flex-col bg-[var(--grey-50,#f5f5f5)]">

      {/*
        Шапка СНАРУЖИ scroll-контейнера — исключает feedback loop.
        marginBottom: -24px тянет scroll-контент под прозрачный хвост градиента.
        z-index: 1 — шапка поверх скролл-контента.
      */}
      <div
        className="shrink-0 relative z-[1] flex items-start gap-0 px-[var(--pad-m,24px)] pointer-events-none"
        style={{
          marginBottom: '-24px',
          paddingTop: scrolled ? 'var(--inset-m,12px)' : 'var(--pad-m,24px)',
          paddingBottom: scrolled ? 'calc(var(--pad-m,24px) + var(--inset-m,12px))' : 'var(--pad-m,24px)',
          background: 'linear-gradient(to bottom, var(--grey-50,#f5f5f5) 70%, transparent)',
          transition: `padding-top 0.3s ${EASE}, padding-bottom 0.3s ${EASE}`,
        }}
      >
        <p
          className="flex-1 font-unbounded font-semibold text-[color:var(--grey-850,#313131)]"
          style={{
            fontSize: scrolled ? 'var(--f-size-l,20px)' : 'var(--f-size-xl,30px)',
            lineHeight: scrolled ? 'var(--f-lh-m,24px)' : 'var(--f-lh-l,40px)',
            transition: `font-size 0.3s ${EASE}, line-height 0.3s ${EASE}`,
          }}
        >
          Смета
        </p>
        <div
          className="flex items-start shrink-0 pointer-events-auto"
          style={{
            paddingTop: scrolled ? '0px' : 'var(--gap-2xs,8px)',
            transition: `padding-top 0.3s ${EASE}`,
          }}
        >
          <button onClick={onClose} className="cursor-pointer">
            <Ic icon="ic-close" />
          </button>
        </div>
      </div>

      {/* Scroll-контейнер */}
      <div
        ref={scrollRef}
        onScroll={() => setScrolled((scrollRef.current?.scrollTop ?? 0) > 8)}
        className="flex-1 overflow-y-auto flex flex-col gap-[var(--gap-m,32px)] pt-[var(--pad-m,24px)] pb-[var(--pad-m,24px)]"
      >

        {/* Параметры объекта */}
        <div className="flex flex-col gap-[var(--gap-2xs,8px)]">

          {/* Заголовок */}
          <div className="flex items-center justify-between px-[var(--pad-m,24px)]">
            <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap">
              Параметры объекта
            </p>
            <div className="shrink-0 h-[32px] flex items-center">
              {paramsOpen ? (
                <button onClick={() => setParamsOpen(false)} className="cursor-pointer h-full flex items-center">
                  <span className="font-inter font-normal text-[14px] leading-[1.3] tracking-[-0.14px] text-[color:var(--purple-500,#9744eb)] w-[52px] text-right">
                    Скрыть
                  </span>
                </button>
              ) : (
                <Chip color="secondary" size="m" onClick={() => setParamsOpen(true)}>
                  <span className="whitespace-pre">{totalArea} м²{'  '}{clientZone}/{sklad}</span>
                  <Icon name="ic-pencil" size={24} />
                </Chip>
              )}
            </div>
          </div>

          {/* Раскрывающиеся контролы */}
          <AnimatedHeight open={paramsOpen}>
            <div className="flex flex-col gap-[var(--gap-3xs,4px)]">

              {/* Общая площадь */}
              <div className="bg-[var(--grey-0,white)] flex items-center justify-between p-[var(--pad-s,16px)] rounded-[var(--round-m,16px)]">
                <p className="flex-1 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] overflow-hidden text-ellipsis whitespace-nowrap">
                  Общая площадь
                </p>
                <div className="flex gap-[var(--gap-2xs,8px)] items-center shrink-0">
                  <IcControl icon="ic-minus" color="grey" size="m" onClick={handleTotalDec} />
                  <span
                    className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap"
                    style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                  >
                    <AnimatedNumber value={totalArea} format="d" /> м²
                  </span>
                  <IcControl icon="ic-plus" color="grey" size="m" onClick={handleTotalInc} />
                </div>
              </div>

              {/* Клиентская зона + ic-link + Склад */}
              <div className="flex items-center gap-[var(--gap-3xs,4px)]">

                {/* Клиентская зона */}
                <div className="flex-1 min-w-0 bg-[var(--grey-0,white)] flex flex-col gap-[8px] items-start p-[var(--pad-s,16px)] rounded-[var(--round-m,16px)]">
                  <p className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[1.4] tracking-[-0.48px] text-[color:var(--grey-850,#313131)] overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    Клиентская зона
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <IcControl icon="ic-minus" color="grey" size="m" onClick={handleClientDec} />
                    <span
                      className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[1.3] tracking-[-0.16px] text-[color:var(--grey-850,#313131)] whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                    >
                      <AnimatedNumber value={clientZone} format="d" /> м²
                    </span>
                    <IcControl icon="ic-plus" color="grey" size="m" onClick={handleClientInc} />
                  </div>
                </div>

                {/* ic-link — разделитель */}
                <Icon name="ic-link" size={24} className="text-[color:var(--grey-400,#adadad)] shrink-0" />

                {/* Склад */}
                <div className="flex-1 min-w-0 bg-[var(--grey-0,white)] flex flex-col gap-[8px] items-start p-[var(--pad-s,16px)] rounded-[var(--round-m,16px)]">
                  <p className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[1.4] tracking-[-0.48px] text-[color:var(--grey-850,#313131)] overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    Склад
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <IcControl icon="ic-minus" color="grey" size="m" onClick={handleSkladDec} />
                    <span
                      className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[1.3] tracking-[-0.16px] text-[color:var(--grey-850,#313131)] whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                    >
                      <AnimatedNumber value={sklad} format="d" /> м²
                    </span>
                    <IcControl icon="ic-plus" color="grey" size="m" onClick={handleSkladInc} />
                  </div>
                </div>

              </div>
            </div>
          </AnimatedHeight>

        </div>

        {/* Баннер */}
        <div className="px-[16px]">
          <Banner />
        </div>

        {/* Материалы и работы */}
        <div className="flex flex-col gap-[var(--gap-xs,12px)]">
          <div className="px-[var(--pad-m,24px)]">
            <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
              Материалы и работы
            </p>
          </div>
          <div className="flex flex-col gap-[var(--gap-3xs,4px)]">
            {CATEGORIES.map((cat, i) => (
              <CalculationUnit
                key={i}
                name={cat.name}
                imageUrl={cat.imageUrl}
                initialTotal={categoryTotals[i]}
                onTotalChange={makeOnTotalChange(i)}
                sections={categorySections[i]}
                flatMaterials={cat.name === 'Мебель' ? mebelItems : undefined}
                canExpand={cat.name !== 'Резерв 12%'}
                initialEnabled={cat.name === 'Санузел' ? p2.toilet > 0 : true}
              />
            ))}
          </div>
        </div>

        <div className="h-[160px] shrink-0" />

      </div>
    </div>
  )
}

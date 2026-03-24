// src/calc.ts
// Calculation engine for WB PVZ renovation calculator v9/v10
import type { UnitSection } from './components/CalculationUnit'
import type { MaterialEntry } from './components/Material'

export interface CalcParams {
  S: number       // area m²
  state: number   // 0=Косметика, 1=White Box, 2=Бетон
  plan: boolean   // свободная планировка
  hIdx: number    // 0=до 2.5 м, 1=2.85 м, 2=от 3.25 м
  Kr?: number     // regional coefficient (default 1.0)
}

const H_VALS   = [2.5, 2.85, 3.25] as const
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

  // 1. Демонтаж старого покрытия
  const demolishWorks = [
    { workName: 'Демонтаж старого покрытия', price: r(S * 350 * Kr), description: 'Снятие старой штукатурки, обоев или краски перед чистовой отделкой\n\n1. Защита пола и соседних поверхностей плёнкой\n2. Механическое снятие старой штукатурки перфоратором или зубилом\n3. Удаление обоев, старой краски скребком или шлифмашиной\n4. Обеспыливание и уборка строительного мусора\n5. Осмотр основания на наличие трещин и дефектов' },
  ]

  // 2. Подготовка стен
  const prepWorks: { workName: string; price: number; description?: string }[] = []
  const prepMats: MaterialEntry[] = []

  if (state === 2) {
    prepWorks.push({
      workName: S <= 60 ? 'Штукатурка стен по маякам, ручная' : 'Штукатурка стен машинная',
      price: r(g.Swc * 480 * g.Kh * Kr),
      description: 'Выравнивание стен штукатурной смесью до ровной плоскости\n\n1. Установка маяков (направляющих профилей) по уровню\n2. Нанесение первого слоя штукатурки Knauf Rotband правилом\n3. Выравнивание по маякам, затирка полутёрком\n4. При S > 60 м² — нанесение машинным способом штукатурной станцией\n5. Выдержка до полного высыхания (24–48 часов)',
    })
    prepMats.push({ materialText: 'Knauf Rotband 30 кг — штукатурная смесь', price: 550, quantity: qty(g.Swc * 0.28), description: 'Гипсовая штукатурка Knauf Rotband — стандарт отрасли для ручного и машинного нанесения. Толщина слоя 5–50 мм. Используется на бетонных, кирпичных и газобетонных поверхностях. Время жизни раствора ~25 мин, схватывание 2–3 часа.\n\nВес: 30 кг | Цвет: белый/серый | Слой: 5–50 мм | Расход: 0.28 меш./м² | Бренд: Knauf' })
    prepMats.push({ materialText: 'Маяки штукатурные 3 м — направляющие профили', price: 30, quantity: qty(g.Swc / 1.5), description: 'Оцинкованные профили-маяки устанавливаются вертикально по уровню на стену и задают плоскость выравнивания. После высыхания штукатурки снимаются, а борозды заделываются. Длина 3 м, шаг установки 1–1.5 м.\n\nДлина: 3 м | Материал: оцинкованная сталь | Расход: 1 шт./1.5 м.п.' })
  }
  if (state >= 1) {
    prepWorks.push({ workName: 'Финишная шпаклёвка стен, 2 слоя', price: r(g.Swc * 240 * Kr), description: 'Создание гладкой поверхности под покраску\n\n1. Нанесение первого слоя шпаклёвки Knauf Rotband Finish широким шпателем\n2. Высыхание первого слоя (4–6 часов)\n3. Нанесение второго слоя с перекрытием швов\n4. Шлифовка поверхности шкуркой P120 после полного высыхания\n5. Обеспыливание перед грунтовкой' })
    prepMats.push({ materialText: 'Knauf Rotband Finish 25 кг — финишная шпаклёвка', price: 720, quantity: qty(g.Swc * 0.10), description: 'Гипсовая финишная шпаклёвка для создания идеально ровной поверхности. Наносится слоем 0.5–3 мм. Высокая белизна, легко шлифуется. Применяется после штукатурки перед покраской.\n\nВес: 25 кг | Цвет: белый | Слой: 0.5–3 мм | Расход: 0.10 меш./м² | Бренд: Knauf' })
  }
  prepWorks.push({ workName: 'Грунтовка стен', price: r((g.Swc + g.Sws) * 80 * Kr), description: 'Обработка поверхности для улучшения адгезии краски\n\n1. Нанесение грунтовки Knauf Tiefengrund валиком в 1 слой\n2. Обработка углов и стыков кистью\n3. Высыхание 2–3 часа при температуре +18°C и выше' })
  prepMats.push({ materialText: 'Knauf Tiefengrund 10 л — грунтовка глубокого проникновения', price: 950, quantity: qty((g.Swc + g.Sws) * 0.02), description: 'Акриловая грунтовка глубокого проникновения, укрепляет пористые основания, улучшает адгезию краски и шпаклёвки. Наносится перед каждым покрасочным слоем. Расход 100–200 мл/м².\n\nОбъём: 10 л | Расход: 0.02 вед./м² | Бренд: Knauf' })

  // 3. Покраска стен
  const paintWorks = [
    { workName: 'Покраска основных стен, 2 слоя (клиентская зона)', price: r(g.Swc * g.Kst * 200 * Kr), description: 'Нанесение фирменного светло-серого цвета WB на стены клиентской зоны\n\n1. Маскировка примыканий малярным скотчем\n2. Нанесение первого слоя краской Dulux 10BB 83/012 валиком\n3. Высыхание 2–4 часа\n4. Нанесение второго слоя перпендикулярными движениями\n5. Снятие скотча до полного высыхания второго слоя' },
    { workName: 'Покраска акцентной стены, 2 слоя (~25% клиентской)', price: r(g.Swc * 0.25 * 220 * Kr), description: 'Фиолетовая акцентная стена за столом менеджера — стандарт WB\n\n1. Разметка акцентной стены (стена за столом менеджера)\n2. Маскировка смежных поверхностей скотчем\n3. Нанесение двух слоёв Tikkurila OPC$ F 343 с промежуточной сушкой' },
    { workName: 'Покраска стен складской зоны, 2 слоя', price: r(g.Sws * 170 * Kr), description: 'Белая краска для складской зоны без декоративных требований\n\n1. Нанесение двух слоёв белой базы Dulux валиком\n2. Сушка между слоями 2–4 часа' },
    { workName: 'Покраска радиаторов отопления в цвет стен', price: r(2500 * Kr), description: 'Окраска батарей в светло-серый цвет WB — требование брендбука\n\n1. Обезжиривание поверхности радиатора\n2. Нанесение термостойкой краски или остатков основного цвета кистью\n3. 2 слоя с сушкой между нанесениями' },
    { workName: 'Поклейка бренд-стены (обои WB, 1 стена)', price: r(2000 * Kr), description: 'Монтаж виниловых обоев WB на главную стену клиентской зоны\n\n1. Подготовка и выравнивание стены под поклейку\n2. Нанесение клея на поверхность\n3. Точное позиционирование обоев по уровню\n4. Прокатка валиком для удаления пузырей\n5. Подрезка краёв' },
  ]
  const paintMats: MaterialEntry[] = [
    { materialText: 'Dulux 10BB 83/012, 9 л — светло-серый WB, основные стены клиентской зоны', price: 2800, quantity: qty(g.Swc / 45), description: 'Матовая интерьерная краска на водной основе. Цвет 10BB 83/012 — фирменный светло-серый Wildberries. Заказывается по колеровке. Покрывает поверхность в 2 слоя. Моющаяся, устойчива к истиранию.\n\nОбъём: 9 л | Цвет: светло-серый 10BB 83/012 | Фактура: матовый | Расход: 1 вед./45 м² | Бренд: Dulux' },
    { materialText: 'Tikkurila OPC$ F 343, 9 л — фиолетовый WB, акцентная стена', price: 3200, quantity: qty(g.Swc * 0.25 / 40), description: 'Матовая интерьерная краска Tikkurila. Цвет OPC$ F 343 — фирменный фиолетовый Wildberries. Высокая укрывистость, 2 слоя. Наносится на акцентную стену за столом менеджера.\n\nОбъём: 9 л | Цвет: фиолетовый OPC$ F 343 | Фактура: матовый | Расход: 1 вед./40 м² | Бренд: Tikkurila' },
    { materialText: 'Dulux белая база, 9 л — стены складской зоны', price: 2200, quantity: qty(g.Sws / 50), description: 'Матовая белая краска на водной основе. Используется для окраски стен склада, потолка (при варианте с покраской вместо грильято), батарей. Хорошая укрывистость, экономичный расход.\n\nОбъём: 9 л | Цвет: белый | Фактура: матовый | Расход: 1 вед./50 м² | Бренд: Dulux' },
    { materialText: 'Обои виниловые WB брендбук 2026 — бренд-стена', price: 3500, quantity: 1, description: 'Виниловые обои с фирменным рисунком Wildberries. Используются для оформления главной акцентной стены в клиентской зоне. Поставляются или заказываются через официального поставщика WB.\n\nТип: виниловые | Цвет: фирменный паттерн WB | Расход: 1 рулон/стена | Бренд: WB Official' },
  ]

  // 4. Пол клиентской зоны — плитка
  const fcTileWorks: { workName: string; price: number; description?: string }[] = []
  const fcTileMats: MaterialEntry[] = []
  if (state === 2) {
    fcTileWorks.push({ workName: 'Устройство стяжки пола 3–5 см (клиентская зона)', price: r(g.Sfc * 600 * Kr), description: 'Выравнивание основания пола цементно-песчаной смесью\n\n1. Установка маяков по уровню\n2. Приготовление раствора пескоцемента М150\n3. Заливка и разравнивание правилом по маякам\n4. Выдержка 28 дней до набора прочности (минимум 7 дней до укладки плитки)' })
    fcTileMats.push({ materialText: 'Пескоцементная смесь М150, 50 кг — стяжка', price: 320, quantity: qty(g.Sfc * 1.5), description: 'Готовая сухая смесь цемента и песка марки М150 для устройства стяжки полов. Расход при слое 3 см — 1.5 мешка на м². Время схватывания 4–6 часов, набор прочности 28 суток.\n\nВес: 50 кг | Марка: М150 | Расход: 1.5 меш./м² (при толщине 3 см)' })
  }
  fcTileWorks.push({ workName: 'Укладка керамогранита 60×60', price: r(g.Sfc * g.Kfl * 1100 * Kr), description: 'Укладка плитки Kerama Marazzi Terrazzo — стандарт пола WB\n\n1. Грунтовка основания\n2. Нанесение клея Knauf Flexkleber зубчатым шпателем\n3. Укладка плитки 60×60 с крестиками 2–3 мм\n4. Подрезка болгаркой по периметру и у препятствий\n5. Затирка швов Ceresit CE 33 серый 07 после высыхания клея (24 часа)' })
  fcTileWorks.push({ workName: 'Монтаж плинтуса из плитки Kerama Marazzi', price: r(Math.sqrt(g.Sfc) * 4 * 300 * g.Kfl * Kr), description: 'Укладка плиточного плинтуса по периметру клиентской зоны\n\n1. Нарезка плинтусной плитки 60×20 по размеру\n2. Клейка на тот же клей что и пол\n3. Затирка швов Ceresit CE 33' })
  fcTileMats.push({ materialText: 'Kerama Marazzi Terrazzo 566324008, 60×60 светло-серый', price: 2100, quantity: qty(g.Sfc * g.Kfl * 1.07), description: 'Керамогранит серии Terrazzo от Kerama Marazzi. Имитация натурального камня, светло-серый оттенок. Размер 600×600 мм, толщина 10 мм. Высокая прочность и износостойкость — класс PEI IV. Рекомендован брендбуком WB для пола клиентской зоны.\n\nРазмер: 600×600 мм | Толщина: 10 мм | Цвет: светло-серый | Поверхность: матовый | PEI: IV | Расход: 1.07 м²/м² (запас 7%) | Бренд: Kerama Marazzi | Арт: 566324008' })
  fcTileMats.push({ materialText: 'Knauf Flexkleber, 25 кг — клей для керамогранита', price: 880, quantity: qty(g.Sfc * g.Kfl * 0.20), description: 'Эластичный плиточный клей класса C2TE для укладки керамогранита 60×60 и крупноформатных плит. Компенсирует температурные деформации. Рабочее время 30 мин.\n\nВес: 25 кг | Класс: C2TE | Расход: 0.20 меш./м² | Бренд: Knauf' })
  fcTileMats.push({ materialText: 'Ceresit CE 33, 25 кг, серый 07 — затирка швов', price: 640, quantity: qty(g.Sfc * g.Kfl * 0.05), description: 'Цементная затирка для швов 2–20 мм. Цвет 07 — стандартный серый, соответствует требованиям брендбука WB. Влагостойкая, не крошится. Используется для плитки пола и санузла.\n\nВес: 25 кг | Цвет: серый 07 | Ширина шва: 2–20 мм | Расход: 0.05 меш./м² | Бренд: Ceresit' })
  fcTileMats.push({ materialText: 'Плинтус Kerama Marazzi 60×20, та же серия', price: 2100, quantity: qty(Math.sqrt(g.Sfc) * 4 * 0.15 * g.Kfl), description: 'Плинтусная плитка из той же серии Terrazzo. Размер 60×20 см. Укладывается вдоль стен по периметру клиентской зоны, создавая единую поверхность с полом.\n\nРазмер: 600×200 мм | Цвет: светло-серый, та же серия | Расход: 0.15 м²/м.п. | Бренд: Kerama Marazzi' })

  // 5. Пол клиентской зоны — линолеум
  const fcLinoWorks: { workName: string; price: number; description?: string }[] = []
  const fcLinoMats: MaterialEntry[] = []
  if (state === 2) {
    fcLinoWorks.push({ workName: 'Устройство стяжки пола 3–5 см (клиентская зона)', price: r(g.Sfc * 600 * Kr), description: 'Выравнивание основания пола цементно-песчаной смесью\n\n1. Установка маяков по уровню\n2. Приготовление раствора пескоцемента М150\n3. Заливка и разравнивание правилом по маякам\n4. Выдержка 28 дней до набора прочности (минимум 7 дней до укладки плитки)' })
    fcLinoMats.push({ materialText: 'Пескоцементная смесь М150, 50 кг — стяжка', price: 320, quantity: qty(g.Sfc * 1.5), description: 'Готовая сухая смесь цемента и песка марки М150 для устройства стяжки полов. Расход при слое 3 см — 1.5 мешка на м². Время схватывания 4–6 часов, набор прочности 28 суток.\n\nВес: 50 кг | Марка: М150 | Расход: 1.5 меш./м² (при толщине 3 см)' })
  }
  fcLinoWorks.push({ workName: 'Укладка коммерческого линолеума (клиентская зона)', price: r(g.Sfc * 380 * Kr), description: 'Бюджетная альтернатива плитке для клиентской зоны\n\n1. Подготовка и выравнивание основания\n2. Раскройка линолеума с запасом 5–10 см\n3. Приклейка на клей или укладка свободным методом\n4. Сварка швов горячим методом (при коммерческом использовании обязательно)\n5. Установка порогов и плинтусов' })
  fcLinoMats.push({ materialText: 'Tarkett Acczent Pro, оттенок 712 — коммерческий линолеум', price: 780, quantity: qty(g.Sfc * 1.10), description: 'Коммерческий гетерогенный линолеум для высоконагруженных помещений. Класс износостойкости 43 (коммерческий). Толщина 2 мм, износостойкий слой 0.7 мм. Оттенок 712 — нейтральный серо-бежевый.\n\nТолщина: 2 мм | Износостойкий слой: 0.7 мм | Класс: 43 (коммерческий) | Цвет: оттенок 712 | Расход: 1.10 м²/м² (запас 10%) | Бренд: Tarkett, Acczent Pro' })

  // 6. Пол складской зоны
  const fsWorks: { workName: string; price: number }[] = []
  const fsMats: MaterialEntry[] = []
  if (state === 2) {
    fsWorks.push({ workName: 'Устройство стяжки пола 3–5 см (складская зона)', price: r(g.Sfs * 600 * Kr) })
    fsMats.push({ materialText: 'Пескоцементная смесь М150, 50 кг — стяжка', price: 320, quantity: qty(g.Sfs * 1.5) })
  }
  fsWorks.push({ workName: 'Укладка коммерческого линолеума (складская зона)', price: r(g.Sfs * 380 * Kr) })
  fsMats.push({ materialText: 'Tarkett Acczent Pro, оттенок 712 — коммерческий линолеум', price: 780, quantity: qty(g.Sfs * 1.10) })

  // 7. Потолок — грильято
  const cgWorks = [
    { workName: 'Монтаж подвесного потолка грильято 100×100, ячейка 10×10', price: r(g.Sc * 1500 * Kr) },
  ]
  const cgMats: MaterialEntry[] = [
    { materialText: 'Система грильято 100×100 белая, ячейка 10×10', price: 1800, quantity: qty(g.Sc) },
    { materialText: 'Профиль CD 60×27, 3 м — несущий каркас', price: 85, quantity: qty(g.Sc * 0.7) },
  ]

  // 8. Потолок — покраска
  const cpWorks = [
    { workName: 'Покраска потолка, 2 слоя', price: r(g.Sc * g.Kcl * g.Kh * 240 * Kr) },
  ]
  const cpMats: MaterialEntry[] = [
    { materialText: 'Dulux белая база, 9 л (1 вед./50 м²)', price: 2200, quantity: qty(g.Sc / 50) },
  ]

  // 9. Перегородка
  const Sp = g.Sp
  const partWorks = [
    { workName: 'Монтаж каркаса и обшивка ГКЛ с двух сторон', price: r(Sp * 2700 * Kr) },
    { workName: 'Звукоизоляция перегородки минватой', price: r(Sp * 580 * Kr) },
    { workName: 'Финишная шпаклёвка перегородки', price: r(Sp * 200 * Kr) },
  ]
  const partMats: MaterialEntry[] = [
    { materialText: 'ГКЛ стандартный 12.5 мм, 2500×1200 (0.7 листа/м²)', price: 480, quantity: qty(Sp * 0.7) },
    { materialText: 'Профиль CD 60×27 + UW 75×40, 3 м — каркас', price: 87, quantity: qty(Sp * 2) },
    { materialText: 'Knauf Insulation, рул. 1.2×5 м, 50 мм — звукоизоляция', price: 1100, quantity: qty(Sp * 0.17) },
    { materialText: 'Knauf Rotband Finish 25 кг — шпаклёвка перегородки', price: 720, quantity: qty(Sp * 0.10) },
  ]

  return [
    {
      name: 'Демонтаж старого покрытия',
      description: 'Демонтаж старого напольного и настенного покрытия',
      initialActive: false,
      works: demolishWorks,
      materials: [],
    },
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
      initialActive: true,
      works: paintWorks,
      materials: paintMats,
    },
    {
      name: 'Пол клиентской зоны — плитка',
      description: 'Укладка керамогранита 60×60 Kerama Marazzi — стандарт WB',
      initialActive: g.Kfl > 0,
      mutuallyExclusiveGroup: 'floor_client',
      works: fcTileWorks,
      materials: fcTileMats,
    },
    {
      name: 'Пол клиентской зоны — линолеум',
      description: 'Укладка коммерческого линолеума Tarkett — альтернатива плитке',
      initialActive: false,
      mutuallyExclusiveGroup: 'floor_client',
      skipScaling: true,
      works: fcLinoWorks,
      materials: fcLinoMats,
    },
    {
      name: 'Пол складской зоны',
      description: 'Коммерческий линолеум Tarkett — складская зона',
      initialActive: true,
      works: fsWorks,
      materials: fsMats,
    },
    {
      name: 'Потолок — грильято',
      description: 'Подвесной потолок грильято 100×100, ячейка 10×10 — брендбук WB',
      initialActive: true,
      mutuallyExclusiveGroup: 'ceiling',
      works: cgWorks,
      materials: cgMats,
    },
    {
      name: 'Потолок — покраска',
      description: 'Покраска потолка в белый цвет — упрощённый вариант',
      initialActive: false,
      mutuallyExclusiveGroup: 'ceiling',
      skipScaling: true,
      works: cpWorks,
      materials: cpMats,
    },
    {
      name: 'Перегородка',
      description: 'Монтаж ГКЛ-перегородки для зонирования клиентской зоны и склада',
      initialActive: plan,
      works: partWorks,
      materials: partMats,
    },
  ]
}

// ─── Category 2: Электрика и свет ────────────────────────────────────────────

export function buildCat2({ S, state, hIdx, Kr = 1 }: CalcParams): UnitSection[] {
  const g = geo(S, state, hIdx)
  const Nlc = g.Nlc
  const Nls = g.Nls

  return [
    {
      name: 'Прокладка электросети',
      description: 'Штробление стен и прокладка кабелей по новой схеме',
      initialActive: state >= 1,
      works: [
        { workName: 'Штробление стен и прокладка кабелей', price: r(S * 2800 * Kr) },
      ],
      materials: [
        { materialText: 'Кабель ВВГнг-LS 3×1.5, 100 м — осветительные линии', price: 3800, quantity: qty(S * 0.4 / 50) },
        { materialText: 'Кабель ВВГнг-LS 3×2.5, 100 м — силовые линии', price: 5200, quantity: qty(S * 0.7 / 50) },
        { materialText: 'Гофра ПВД 16 мм, 100 м — защитная труба для кабеля', price: 1100, quantity: qty(S / 50) },
        { materialText: 'Кабель-канал 40×16 мм белый, 2 м — открытая прокладка', price: 180, quantity: qty(S * 4 / 10) },
      ],
    },
    {
      name: 'Монтаж щитка и автоматов',
      description: 'Установка главного щитка при прокладке новой электросети',
      initialActive: state >= 1,
      works: [
        { workName: 'Установка щитка и подключение автоматических выключателей', price: r(5500 * Kr) },
      ],
      materials: [
        { materialText: 'Щиток навесной 8–12 модулей', price: 2500, quantity: 1 },
        { materialText: 'Автоматические выключатели ABB/Schneider 10–25А (комплект)', price: 2000, quantity: 1 },
      ],
    },
    {
      name: 'Установка розеток и выключателей',
      description: 'Цвет и расположение по схеме брендбука WB',
      initialActive: true,
      works: [
        { workName: 'Установка розеток и выключателей', price: r(S * 400 * Kr) },
      ],
      materials: [
        { materialText: 'Розетки накладные белые Legrand/Werkel — у примерочных, стола менеджера', price: 280, quantity: 4 },
        { materialText: 'Розетки накладные чёрные Legrand/Werkel — у стола проверки', price: 320, quantity: 2 },
        { materialText: 'Выключатели накладные белые Legrand/Werkel', price: 200, quantity: 2 },
      ],
    },
    {
      name: 'Освещение клиентской зоны',
      description: `Линейные светильники (${Nlc} шт.), аварийное освещение — брендбук WB`,
      initialActive: true,
      works: [
        { workName: 'Монтаж и подключение линейных светильников', price: r(Nlc * 800 * Kr) },
        { workName: 'Установка блока аварийного освещения', price: r(650 * Kr) },
      ],
      materials: [
        { materialText: 'Светильник линейный 900 мм накладной белый, 4000–5000К IP44', price: 2850, quantity: Nlc },
        { materialText: 'Блок аварийного питания ≥1 ч Feron/Camelion', price: 1850, quantity: qty(S / 50) },
      ],
    },
    {
      name: 'Освещение складской зоны',
      description: `Накладные светильники складской зоны (${Nls} шт.)`,
      initialActive: true,
      works: [
        { workName: 'Монтаж и подключение накладных светильников складской зоны', price: r(Nls * 500 * Kr) },
      ],
      materials: [
        { materialText: 'Светильник накладной LED (складская зона)', price: 1150, quantity: Nls },
      ],
    },
    {
      name: 'Тепловая завеса',
      description: 'Монтаж тепловой завесы над входной группой',
      initialActive: false,
      works: [
        { workName: 'Монтаж тепловой завесы над входной группой', price: r(4000 * Kr) },
      ],
      materials: [
        { materialText: 'Тепловая завеса электрическая 1–1.5 кВт (по ширине проёма)', price: 10000, quantity: 1 },
      ],
    },
    {
      name: 'Кондиционер',
      description: 'Монтаж сплит-системы — мощность подбирается по площади',
      initialActive: false,
      works: [
        { workName: 'Монтаж сплит-системы (кондиционер)', price: r(9000 * Kr) },
      ],
      materials: [
        { materialText: 'Сплит-система, мощность подбирается по площади', price: 35000, quantity: 1 },
      ],
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
      description: `IP-камеры (${Ncam} шт.) — минимум 3 по требованиям WB`,
      works: [
        { workName: 'Монтаж и настройка камер видеонаблюдения', price: r(Ncam * 2000 * Kr) },
        { workName: 'Монтаж видеорегистратора и жёсткого диска', price: r(4000 * Kr) },
      ],
      materials: [
        { materialText: 'Камера IP 2 Мп Hikvision/Dahua', price: 3750, quantity: Ncam },
        { materialText: 'NVR видеорегистратор 4–8 каналов', price: 6750, quantity: 1 },
        { materialText: 'HDD 1–2 ТБ для видеорегистратора', price: 4750, quantity: 1 },
      ],
    },
    {
      name: 'Пожарная безопасность',
      description: 'Обязательный комплект по нормам пожарной безопасности',
      works: [
        { workName: 'Монтаж пожарной сигнализации (базовый комплект)', price: r(8000 * Kr) },
        { workName: 'Крепёж и установка огнетушителей', price: r(800 * Kr) },
        { workName: 'Монтаж световых указателей «Выход»', price: r(1200 * Kr) },
      ],
      materials: [
        { materialText: 'Панель пожарной сигнализации — базовый комплект на 1 помещение', price: 11500, quantity: 1 },
        { materialText: 'Огнетушитель ОП-2, 2 кг', price: 750, quantity: 2 },
        { materialText: 'Световой указатель «Выход» LED', price: 900, quantity: 2 },
      ],
    },
    {
      name: 'IT-оборудование',
      description: 'Рабочие инструменты сотрудника — отключаются если куплены самостоятельно',
      works: [],
      materials: [
        { materialText: 'Ноутбук для сотрудника 14–15"', price: 55000, quantity: 1 },
        { materialText: 'Сканер штрих-кодов 1D/2D Honeywell/Datalogic', price: 3500, quantity: 1 },
        { materialText: 'Роутер / Wi-Fi точка доступа TP-Link/Keenetic', price: 3500, quantity: 1 },
      ],
    },
  ]
}

// ─── Category 4: Санузел ─────────────────────────────────────────────────────

export function buildCat4({ Kr = 1 }: CalcParams): UnitSection[] {
  return [
    {
      name: 'Установка туалета и раковины',
      description: 'Выводы есть — установка унитаза, раковины и покраска стен санузла',
      initialActive: false,
      works: [
        { workName: 'Установка унитаза и раковины (подключение к готовым выводам)', price: r(11000 * Kr) },
        { workName: 'Покраска стен санузла (износостойкая краска, 2 слоя)', price: r(8000 * Kr) },
      ],
      materials: [
        { materialText: 'Унитаз компакт (по выбору)', price: 12000, quantity: 1 },
        { materialText: 'Раковина настенная (по выбору)', price: 8000, quantity: 1 },
        { materialText: 'Краска влагостойкая матовая белая, 9 л', price: 1800, quantity: 1 },
      ],
    },
    {
      name: 'Прокладка труб под ключ',
      description: 'Коммуникаций нет — полная разводка, возведение стен, плитка, санфаянс',
      initialActive: false,
      works: [
        { workName: 'Прокладка труб холодного и горячего водоснабжения', price: r(18000 * Kr) },
        { workName: 'Прокладка канализационных труб', price: r(12000 * Kr) },
        { workName: 'Возведение стен санузла из влагостойкого ГКЛ', price: r(15000 * Kr) },
        { workName: 'Гидроизоляция пола санузла', price: r(5000 * Kr) },
        { workName: 'Укладка плитки в санузле (пол + стены)', price: r(25000 * Kr) },
        { workName: 'Установка унитаза и раковины', price: r(11000 * Kr) },
      ],
      materials: [
        { materialText: 'Трубы ПП 20/25 + фитинги (по длине разводки)', price: 6000, quantity: 1 },
        { materialText: 'Канализационные трубы ПВХ 50/110 мм', price: 4500, quantity: 1 },
        { materialText: 'ГКЛ влагостойкий ГКЛВ 12.5 мм + профили CD/UW', price: 520, quantity: 6 },
        { materialText: 'Ceresit CL 50 — обмазочная гидроизоляция', price: 1800, quantity: 3 },
        { materialText: 'Плитка керамическая 600×600 + затирка CE 33 + клей Flexkleber', price: 2200, quantity: 8 },
        { materialText: 'Унитаз компакт (по выбору)', price: 12000, quantity: 1 },
        { materialText: 'Раковина настенная (по выбору)', price: 8000, quantity: 1 },
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
    { materialText: 'Стол рабочий для сотрудника складской зоны', price: 5500, quantity: 1   },
    { materialText: 'Стул офисный',                            price:  4500, quantity: 1      },
  ]
  if (Ndesk2 > 0) items.push({ materialText: 'Стол выдачи на 2 ячейки 960×700×1050 мм', price: 7500, quantity: Ndesk2 })
  if (Ndesk3 > 0) items.push({ materialText: 'Стол выдачи на 3 ячейки 1400×700×1050 мм', price: 11500, quantity: 1 })
  if (Nbig > 0)   items.push({ materialText: 'Стол для проверки большой 930×750×1050 мм', price: 8500, quantity: 1 })
  return items
}

// ─── Category 6: Резерв и расходники ─────────────────────────────────────────

export function buildCat6(reserve: number, S: number, Kr = 1): UnitSection[] {
  const consumableWorks: { workName: string; price: number }[] = [
    { workName: 'Аренда строительных лесов / стремянки', price: r(5000 * Kr) },
    { workName: 'Аренда перфоратора и УШМ', price: r(3500 * Kr) },
  ]
  if (S > 60) {
    consumableWorks.push({ workName: 'Аренда штукатурной станции (машинная штукатурка)', price: r(7500 * Kr) })
  }
  consumableWorks.push({ workName: 'Вывоз строительного мусора', price: r(5000 * Kr) })

  const consumableMaterials: { materialText: string; price: number; quantity: number }[] = [
    { materialText: 'Мешки для строительного мусора (упак. 20 шт.)', price: r(300 * Kr), quantity: 1 },
    { materialText: 'Малярная плёнка защитная', price: r(450 * Kr), quantity: 1 },
    { materialText: 'Малярный скотч 50 мм (3 рулона)', price: r(375 * Kr), quantity: 1 },
  ]

  return [
    {
      name: 'Резерв 12%',
      description: '12% от суммы всех категорий — на непредвиденные расходы',
      initialActive: true,
      canExpand: false,
      works: [{ workName: 'Резерв 12% от общей сметы', price: reserve }],
      materials: [],
    },
    {
      name: 'Расходники и инструменты',
      description: 'Общие материалы и инструмент на весь период ремонта',
      initialActive: true,
      works: consumableWorks,
      materials: consumableMaterials,
    },
  ]
}

import { useState, useEffect } from 'react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Chip } from './components/Chip'
import { Toggle } from './components/Toggle'
import { Radio } from './components/Radio'
import { SegmentControl } from './components/SegmentControl'
import { Ic } from './components/Ic'
import { IcControl } from './components/IcControl'
import { Card } from './components/Card'
import { Icon } from './components/Icon'
import { CalculationUnit } from './components/CalculationUnit'
import { PriceBox } from './components/PriceBox'
import { StepOne } from './components/StepOne'
import { StepTwo, type Step2Params } from './components/StepTwo'
import { StepThree } from './components/StepThree'
import { ToggleSection } from './components/ToggleSection'
import { CalcPage } from './components/CalcPage'
import type { PriceRow } from './components/PriceBox'
import wallImg   from './img/picture=wall.png'
import sofaImg   from './img/picture=sofa.png'
import lumaImg   from './img/picture=luma.png'
import cameraImg from './img/picture=camera.png'
import coinsImg  from './img/picture=coins.png'
import toiletImg from './img/picture=toilet.png'

const TYPOGRAPHY = [
  { name: 'H1',           font: 'font-unbounded', weight: 'font-semibold', size: 'text-[length:var(--f-size-2xl,44px)]', lh: 'leading-[var(--f-lh-xl,48px)]',  sample: 'Заголовок' },
  { name: 'H2',           font: 'font-unbounded', weight: 'font-semibold', size: 'text-[length:var(--f-size-xl,30px)]',  lh: 'leading-[var(--f-lh-l,40px)]',   sample: 'Заголовок' },
  { name: 'H3',           font: 'font-unbounded', weight: 'font-bold',     size: 'text-[length:var(--f-size-l,20px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Заголовок' },
  { name: 'H4',           font: 'font-inter',     weight: 'font-semibold', size: 'text-[length:var(--f-size-l,20px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Заголовок' },
  { name: 'text-m',       font: 'font-inter',     weight: 'font-normal',   size: 'text-[length:var(--f-size-m,18px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-m-bold',  font: 'font-inter',     weight: 'font-medium',   size: 'text-[length:var(--f-size-m,18px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-s',       font: 'font-inter',     weight: 'font-normal',   size: 'text-[length:var(--f-size-s,16px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-s-bold',  font: 'font-inter',     weight: 'font-semibold', size: 'text-[length:var(--f-size-s,16px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-numbers', font: 'font-inter',     weight: 'font-semibold', size: 'text-[length:var(--f-size-s,16px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: '1 234 567', features: true },
  { name: 'text-xs',      font: 'font-inter',     weight: 'font-normal',   size: 'text-[length:var(--f-size-xs,14px)]',  lh: 'leading-[var(--f-lh-s,20px)]',   sample: 'Мелкий текст' },
] as const

const GREY_COLORS = [
  { token: 'grey-0',   hex: '#ffffff' },
  { token: 'grey-50',  hex: '#f5f5f5' },
  { token: 'grey-100', hex: '#ebebeb' },
  { token: 'grey-150', hex: '#e0e0e0' },
  { token: 'grey-300', hex: '#c2c2c2' },
  { token: 'grey-400', hex: '#adadad' },
  { token: 'grey-500', hex: '#999999' },
  { token: 'grey-600', hex: '#7b7b7b' },
  { token: 'grey-700', hex: '#5e5e5e' },
  { token: 'grey-800', hex: '#404040' },
  { token: 'grey-850', hex: '#313131' },
] as const

const ACCENT_COLORS = [
  { token: 'purple-500',           hex: '#9744eb', label: 'Акцент' },
  { token: 'secondary-purple-500', hex: '#eadafb', label: 'Фон акцента' },
  { token: 'secondary-purple-600', hex: '#dfc6f9', label: 'Фон акцента hover' },
  { token: 'green-500',            hex: '#00bd00', label: 'Успех' },
] as const

function TokenBadge({ label }: { label: string }) {
  return (
    <span className="font-mono text-[11px] text-[color:var(--purple-500,#9744eb)] bg-[var(--secondary-purple-500,#eadafb)] px-1.5 py-0.5 rounded">
      {label}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-unbounded font-bold text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] mb-[var(--gap-s,16px)]">
        {title}
      </h2>
      <div className="bg-white rounded-[var(--round-m,16px)] p-[var(--pad-m,24px)]">
        {children}
      </div>
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-[var(--gap-xs,12px)]">{children}</div>
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-inter text-[10px] text-[color:var(--grey-500,#999)] select-none">{children}</span>
}

// ─── Логика: данные для вкладки ───────────────────────────────────────────
type LogicCond = { label: string; color: 'grey' | 'secondary' }
type WorkItem  = { name: string; price: number; note?: string }
type MatItem   = { name: string; price: number; qty: number | string }
type LogicSection = {
  id: string
  name: string
  description: string
  conditions: LogicCond[]
  note?: string
  works?: WorkItem[]
  materials?: MatItem[]
}
type LogicCat = {
  num: number
  name: string
  image: string
  formulaNote: string
  sections: LogicSection[]
}

const LOGIC: LogicCat[] = [
  {
    num: 1,
    name: 'Внутренняя отделка',
    image: wallImg,
    formulaNote: 'cat1 = стены (kSt·kHeight) + полы (kFl) + потолок + перегородка — всё × kZone/kRegion',
    sections: [
      {
        id: '1.1',
        name: 'Подготовка стен',
        description: 'Демонтаж, штукатурка, шпаклёвка, грунтовка',
        conditions: [
          { label: 'Косметика + Выровнять', color: 'secondary' },
          { label: 'White box / Бетон',     color: 'secondary' },
        ],
        note: 'Демонтаж — только Косметика+walls=1; штукатурка — walls=1 или state=2',
        works: [
          { name: 'Демонтаж старого покрытия',         price: 5500,  note: 'Косметика + walls=1' },
          { name: 'Штукатурка стен по маякам, ручная', price: 8000,  note: 'walls=1 или Бетон' },
          { name: 'Финишная шпаклёвка стен, 2 слоя',   price: 4500,  note: 'walls=1' },
          { name: 'Грунтовка стен перед покраской',    price: 1800 },
        ],
        materials: [
          { name: 'Knauf Rotband 30 кг — штукатурка стен',         price: 550, qty: 5 },
          { name: 'Knauf Rotband Finish 25 кг — финишная шпаклёвка', price: 720, qty: 3 },
          { name: 'Knauf Tiefengrund 10 л — грунт глубокого пр.',   price: 950, qty: 1 },
        ],
      },
      {
        id: '1.2',
        name: 'Покраска стен',
        description: 'Клиентская зона: Dulux + Tikkurila WB + бренд-стена; складская зона: белая краска',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'kSt: Косметика=0.4, White box=0.7, Бетон=1.0; Косметика+walls=1 → kSt=0.9',
        works: [
          { name: 'Покраска основных стен, 2 слоя',        price: 6000 },
          { name: 'Покраска акцентной стены, 2 слоя',      price: 2500 },
          { name: 'Покраска стен складской зоны, 2 слоя',  price: 4000 },
          { name: 'Поклейка бренд-стены',                  price: 1750 },
        ],
        materials: [
          { name: 'Dulux 10BB 83/012, 9 л — светло-серый WB',        price: 2800, qty: 1 },
          { name: 'Tikkurila OPC F343, 9 л — фиолетовый WB',          price: 3200, qty: 1 },
          { name: 'Dulux белая база, 9 л — стены складской зоны',     price: 2200, qty: 1 },
          { name: 'Обои виниловые WB брендбук 2026 — бренд-стена',    price: 3500, qty: 1 },
        ],
      },
      {
        id: '1.3',
        name: 'Пол в клиентской зоне',
        description: 'Керамогранит Kerama Marazzi 60×60, плинтус из плитки',
        conditions: [{ label: 'Состояние ≠ Косметика', color: 'secondary' }],
        note: 'При Бетон — добавляется стяжка пола 3–5 см',
        works: [
          { name: 'Стяжка пола 3–5 см',          price: 8000,  note: 'Только Бетон' },
          { name: 'Укладка керамогранита 60×60',  price: 28000 },
          { name: 'Монтаж плинтуса из плитки',    price: 4500 },
        ],
        materials: [
          { name: 'Kerama Marazzi Terrazzo 566324008, 60×60 светло-серый', price: 2100, qty: 35 },
          { name: 'Пескоцементная смесь М150, 50 кг',                      price: 320,  qty: '8 (Бетон)' },
          { name: 'Knauf Flexkleber, 25 кг — клей для керамогранита',       price: 880,  qty: 4 },
          { name: 'Ceresit CE 33, 25 кг, серый 07 — затирка швов',          price: 640,  qty: 2 },
        ],
      },
      {
        id: '1.4',
        name: 'Пол на складе',
        description: 'Линолеум коммерческий Tarkett Acczent Pro, оттенок 712',
        conditions: [{ label: 'Состояние ≠ Косметика', color: 'secondary' }],
        note: 'При Бетон — добавляется стяжка пола',
        works: [
          { name: 'Стяжка пола 3–5 см',                price: 4000, note: 'Только Бетон' },
          { name: 'Укладка линолеума коммерческого',    price: 6000 },
        ],
        materials: [
          { name: 'Tarkett Acczent Pro, оттенок 712 — линолеум коммерческий', price: 780, qty: 10 },
          { name: 'Пескоцементная смесь М150, 50 кг',                         price: 320, qty: '4 (Бетон)' },
        ],
      },
      {
        id: '1.5',
        name: 'Потолок — грильято',
        description: 'Подвесной потолок 100×100, ячейка 10×10, белый — брендбук WB',
        conditions: [
          { label: 'По умолчанию ВКЛ',   color: 'grey' },
          { label: 'Взаимоисключает 1.6', color: 'secondary' },
        ],
        note: 'C = 3 300 ₽/м², без kHeight; примерный расчёт по S=35: ~16 000 мат. + 15 000 работа',
        works: [
          { name: 'Монтаж системы потолка грильято 100×100, ячейка 10×10', price: 15000 },
        ],
        materials: [
          { name: 'Система грильято 100×100 белая (1 800 ₽/м²)', price: 1800, qty: 10 },
          { name: 'Профиль CD 60×27, 3 м — несущий каркас',      price: 85,   qty: 7 },
        ],
      },
      {
        id: '1.6',
        name: 'Потолок — покраска',
        description: 'Белый потолок — альтернатива грильято',
        conditions: [
          { label: 'По умолчанию ВЫКЛ',   color: 'grey' },
          { label: 'Взаимоисключает 1.5', color: 'secondary' },
        ],
        note: 'skipScaling — не участвует в масштабировании по initialTotal',
        works: [
          { name: 'Покраска потолка, 2 слоя', price: 9000 },
        ],
        materials: [
          { name: 'Dulux белая база, 9 л (1 вед./50 м²)', price: 2200, qty: 1 },
        ],
      },
      {
        id: '1.7',
        name: 'Перегородка',
        description: 'ГКЛ-перегородка с двух сторон, звукоизоляция, дверной блок',
        conditions: [{ label: 'Свободная планировка', color: 'secondary' }],
        note: 'Площадь: H × (√S × 0.5); C_partition = 4 350 ₽/м²',
        works: [
          { name: 'ГКЛ-перегородка с двух сторон + шпаклёвка', price: 12000 },
          { name: 'Звукоизоляция перегородки',                   price: 3000 },
          { name: 'Установка дверного блока в перегородке',      price: 6000 },
        ],
        materials: [
          { name: 'ГКЛ стандартный 12.5 мм, 2500×1200 (0.7 листа/м²)',  price: 480,   qty: 6 },
          { name: 'Профиль CD 60×27 + UW 75×40, 3 м — каркас',          price: 85,    qty: 10 },
          { name: 'Knauf Insulation рул. 1.2×5 м, 50 мм — звукоизол.',   price: 1100,  qty: 2 },
          { name: 'Дверной блок белый/светло-серый',                      price: 10000, qty: 1 },
        ],
      },
    ],
  },
  {
    num: 2,
    name: 'Электрика и свет',
    image: lumaImg,
    formulaNote: 'cat2 = S×C_elec + ceil(S_client/6)×2850 + ceil(S/50)×1850 + ceil(S_storage/10)×1150 — всё × kRegion',
    sections: [
      {
        id: '2.1',
        name: 'Электромонтаж',
        description: 'Два варианта: с нуля (кабели, щиток, автоматы) или обновление (замена розеток)',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'C_elec: обновление=1 200 ₽/м², с нуля=3 500 ₽/м²',
        works: [
          { name: 'Монтаж электрики с нуля: кабели, кабель-каналы, розетки', price: 25000, note: 'electricity=1' },
          { name: 'Монтаж электрощитка и подключение автоматов',              price: 5500,  note: 'electricity=1' },
          { name: 'Обновление: замена светильников и розеток',                price: 12000, note: 'electricity=0' },
        ],
        materials: [
          { name: 'Кабель ВВГнг-LS 3×1.5, 100 м — осветительные цепи',  price: 3800, qty: '1 (с нуля)' },
          { name: 'Кабель ВВГнг-LS 3×2.5, 100 м — розеточные цепи',     price: 5200, qty: '1 (с нуля)' },
          { name: 'Гофра ПВД 16 мм, 100 м — защита кабеля',              price: 1100, qty: '1 (с нуля)' },
          { name: 'Кабель-канал 40×16 мм белый, 2 м',                    price: 180,  qty: '4 (с нуля)' },
          { name: 'Щиток навесной 8–12 мод.',                            price: 2500, qty: '1 (с нуля)' },
          { name: 'Автоматы ABB/Schneider 10–25А',                       price: 350,  qty: '6 (с нуля)' },
          { name: 'Розетки накладные белые Legrand/Werkel',               price: 250,  qty: '4 (обновл.)' },
          { name: 'Розетки накладные чёрные Legrand/Werkel',              price: 280,  qty: '2 (обновл.)' },
        ],
      },
      {
        id: '2.2',
        name: 'Свет в клиентской зоне',
        description: 'Линейные светильники 900 мм накладные 4000–5000К IP44 + аварийный блок ≥1 ч',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'Светильников: ceil(S_client/6); аварийных: ceil(S/50)',
        works: [
          { name: 'Монтаж линейных светильников 900 мм', price: 6000 },
          { name: 'Монтаж блока аварийного освещения',   price: 650 },
        ],
        materials: [
          { name: 'Светильник линейный 900 мм накладной белый 4000–5000К IP44', price: 2850, qty: 6 },
          { name: 'Блок аварийного питания ≥1 ч Feron/Camelion',               price: 1850, qty: 1 },
        ],
      },
      {
        id: '2.3',
        name: 'Свет на складе',
        description: 'Накладные LED-светильники по нормативу складской зоны',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'Светильников: ceil(S_storage/10)',
        works: [
          { name: 'Монтаж накладных светильников', price: 2000 },
        ],
        materials: [
          { name: 'Светильник накладной LED (простой)', price: 1150, qty: 2 },
        ],
      },
    ],
  },
  {
    num: 3,
    name: 'Безопасность и IT',
    image: cameraImg,
    formulaNote: 'cat3 = (камеры + NVR + пожарка) × kRegion + C_IT (без kRegion)',
    sections: [
      {
        id: '3.1',
        name: 'Видеонаблюдение',
        description: 'IP-камеры 2 Мп Hikvision/Dahua, NVR 4–8 кан., HDD 1–2 ТБ',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'Камер: max(3, ceil(S/20)); C_camera=6 000 ₽; C_NVR=13 000 ₽',
        works: [
          { name: 'Монтаж + настройка камер',         price: 6000 },
          { name: 'Монтаж видеорегистратора + HDD',   price: 4000 },
        ],
        materials: [
          { name: 'Камера IP 2 Мп Hikvision/Dahua', price: 3750, qty: 3 },
          { name: 'NVR 4–8 каналов',                price: 6750, qty: 1 },
          { name: 'HDD 1–2 ТБ',                     price: 4750, qty: 1 },
        ],
      },
      {
        id: '3.2',
        name: 'Пожарная безопасность',
        description: 'Панель пожарной сигнализации, огнетушители ОП-2, световые указатели «Выход»',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'C_fire = 11 500 + 1 750 + 10 000 = 23 250 ₽',
        works: [
          { name: 'Монтаж пожарной сигнализации (базовый комплект)', price: 10000 },
          { name: 'Установка огнетушителей',                          price: 800 },
          { name: 'Монтаж световых указателей «Выход»',               price: 1200 },
        ],
        materials: [
          { name: 'Панель пожарной сигнализации — базовый комплект', price: 11500, qty: 1 },
          { name: 'Огнетушитель ОП-2, 2 кг',                        price: 750,   qty: 2 },
          { name: 'Световой указатель «Выход» LED',                  price: 900,   qty: 2 },
        ],
      },
      {
        id: '3.3',
        name: 'IT-оборудование',
        description: 'Ноутбук 14–15", сканер штрих-кодов 1D/2D Honeywell/Datalogic, роутер TP-Link',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'C_IT = 56 000 ₽ — без kRegion (фиксированные цены поставщика)',
        works: [],
        materials: [
          { name: 'Ноутбук для сотрудника 14–15"',                      price: 50000, qty: 1 },
          { name: 'Сканер штрих-кодов 1D/2D Honeywell / Datalogic',     price: 3000,  qty: 1 },
          { name: 'Роутер / Wi-Fi точка доступа TP-Link / Keenetic',     price: 3000,  qty: 1 },
        ],
      },
    ],
  },
  {
    num: 4,
    name: 'Санузел',
    image: toiletImg,
    formulaNote: 'cat4 = toiletCosts[toilet] × kRegion; toilet=0 → категория выключена в смете',
    sections: [
      {
        id: '4.1',
        name: 'Только санфаянс',
        description: 'Унитаз + раковина к готовым выводам, покраска стен санузла',
        conditions: [{ label: 'Санузел = Санфаянс', color: 'secondary' }],
        note: 'toilet=1; C_toilet_1 = 45 000 ₽',
        works: [
          { name: 'Монтаж унитаза + раковины (подключение к готовым выводам)', price: 11000 },
          { name: 'Покраска стен санузла (износостойкая краска 2 слоя)',        price: 8000 },
        ],
        materials: [
          { name: 'Унитаз компакт + раковина по выбору',           price: 11000, qty: 1 },
          { name: 'Краска износостойкая для влажных помещений',    price: 2800,  qty: 1 },
        ],
      },
      {
        id: '4.2',
        name: 'Прокладка труб — под ключ',
        description: 'Водоснабжение + канализация + стены ГКЛВ + гидроизоляция + плитка + унитаз',
        conditions: [{ label: 'Санузел = Трубы', color: 'secondary' }],
        note: 'toilet=2; C_toilet_2 = 120 000 ₽',
        works: [
          { name: 'Прокладка труб водоснабжения + канализации', price: 30000 },
          { name: 'Возведение стен санузла',                     price: 15000 },
          { name: 'Гидроизоляция пола санузла',                  price: 5000 },
          { name: 'Укладка плитки (пол + стены санузла)',        price: 25000 },
          { name: 'Монтаж унитаза + раковины',                   price: 11000 },
        ],
        materials: [
          { name: 'Трубы ПП 20/25/32, фитинги, канализация ПВХ', price: 12000, qty: 1 },
          { name: 'ГКЛ влагостойкий (ГКЛВ) 12.5 мм',             price: 480,   qty: 6 },
          { name: 'Гидроизоляция обмазочная Ceresit CL 50',       price: 950,   qty: 3 },
          { name: 'Плитка керамическая 600×600 (влажные пом.)',   price: 3000,  qty: 8 },
          { name: 'Унитаз компакт + раковина по выбору',          price: 11000, qty: 1 },
        ],
      },
    ],
  },
  {
    num: 5,
    name: 'Мебель',
    image: sofaImg,
    formulaNote: 'cat5 = calcMebel(S) — без kRegion, фиксированный прайс WB 2026',
    sections: [
      {
        id: '5.1',
        name: 'Примерочные + шторы',
        description: 'Примерочная 120×120×200 см и штора блэк-аут',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'nFitting = min(6, max(2, floor(S/25)))',
        works: [],
        materials: [
          { name: 'Примерочная 120×120×200 см',    price: 13500, qty: 'nFitting' },
          { name: 'Штора блэк-аут в примерочную',  price: 2500,  qty: 'nFitting' },
        ],
      },
      {
        id: '5.2',
        name: 'Скамейки, коврики, зеркало',
        description: 'Скамейки белые ×2, скамейки розовые в зал, коврики в примерочную, ложки, зеркало',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'nBenchHall: S≤50→1; +1 за 30 м² свыше 50, max 3',
        works: [],
        materials: [
          { name: 'Скамейка белая (в примерочную) 900×360×490 мм', price: 5000, qty: 2 },
          { name: 'Скамейка розовая (в зал) 900×360×490 мм',       price: 5000, qty: 'nBenchHall' },
          { name: 'Ложка для обуви фиолетовая',                    price: 400,  qty: 2 },
          { name: 'Коврики в примерочную 63×40 (компл. 2 шт.)',    price: 500,  qty: 'nFitting' },
          { name: 'Зеркало в зал 700×1300 мм (скруглённые углы)', price: 5000, qty: 1 },
        ],
      },
      {
        id: '5.3',
        name: 'Столы выдачи и проверки',
        description: 'Стол выдачи 2-ячейки, 3-ячейки (S>80), проверки малый + большой (S>70)',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'nDesk2: S<60→1; иначе max(1, floor(S/40))',
        works: [],
        materials: [
          { name: 'Стол выдачи на 2 ячейки 960×700×1050 мм',    price: 7500,  qty: 'nDesk2' },
          { name: 'Стол выдачи на 3 ячейки 1400×700×1050 мм',   price: 11500, qty: 'S>80' },
          { name: 'Стол для проверки малый 800×530×1050 мм',     price: 6500,  qty: 1 },
          { name: 'Стол для проверки большой 930×750×1050 мм',   price: 8500,  qty: 'S>70' },
        ],
      },
      {
        id: '5.4',
        name: 'Стол менеджера, урна, стенд',
        description: 'Стол менеджера, урна с наклейкой, стенд «Уголок потребителя»',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        works: [],
        materials: [
          { name: 'Стол менеджера 800×800×1284 мм',                  price: 7500, qty: 1 },
          { name: 'Урна с наклейкой 640×680×480 мм',                 price: 3900, qty: 1 },
          { name: 'Стенд «Уголок потребителя» с наполнением 50×75',  price: 3500, qty: 1 },
        ],
      },
      {
        id: '5.5',
        name: 'Стеллажи складские + Режимник WB',
        description: 'Металлические стеллажи 4 полки 1500×750×300 мм + Режимник WB',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'nShelves = ceil(S×0.35/15)',
        works: [],
        materials: [
          { name: 'Стеллаж металлический складской (4 полки) 1500×750×300 мм', price: 3500, qty: 'nShelves' },
          { name: 'Режимник WB',                                                price: 5000, qty: 1 },
        ],
      },
    ],
  },
  {
    num: 6,
    name: 'Резерв 12%',
    image: coinsImg,
    formulaNote: 'reserve = round((cat1+cat2+cat3+cat4+cat5) × 0.12)',
    sections: [
      {
        id: '6.1',
        name: 'Резервный фонд',
        description: 'Покрывает непредвиденные расходы: логистику, устранение брака, согласования',
        conditions: [{ label: 'Всегда', color: 'grey' }],
        note: 'Не отключается и не раскрывается в смете',
        works: [],
        materials: [],
      },
    ],
  },
]

function LogicPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-[var(--gap-m,32px)]">
      {LOGIC.map(cat => (
        <Section key={cat.num} title={`${cat.num}. ${cat.name}`}>

          {/* Формула + иконка */}
          <div className="flex items-start gap-[var(--gap-xs,12px)] pb-[var(--gap-s,16px)] mb-[var(--gap-s,16px)] border-b border-[var(--grey-100,#ebebeb)]">
            <div className="shrink-0 w-10 h-10 rounded-[var(--round-s,12px)] overflow-hidden">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <p className="font-mono text-[11px] leading-[1.5] text-[color:var(--grey-500,#999)] flex-1 pt-0.5">
              {cat.formulaNote}
            </p>
          </div>

          {/* Секции */}
          <div className="space-y-[var(--gap-m,32px)]">
            {cat.sections.map((s, si) => (
              <div key={s.id}>
                {si > 0 && <div className="border-t border-[var(--grey-100,#ebebeb)] mb-[var(--gap-m,32px)]" />}

                {/* Шапка: id + название + условия */}
                <div className="flex items-start gap-[var(--gap-xs,12px)] mb-[var(--gap-2xs,8px)] flex-wrap">
                  <span className="shrink-0 font-mono text-[11px] text-[color:var(--grey-400,#adadad)] pt-[5px] w-7">{s.id}</span>
                  <p className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] flex-1 min-w-[100px]">
                    {s.name}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {s.conditions.map((c, j) => (
                      <Chip key={j} color={c.color} size="s" interactive={false}>{c.label}</Chip>
                    ))}
                  </div>
                </div>

                {/* Описание */}
                <p className="font-inter text-[13px] leading-[1.5] text-[color:var(--grey-500,#999)] mb-[var(--gap-s,16px)] pl-7">
                  {s.description}
                </p>

                {/* Таблица: Работы | Материалы */}
                {((s.works && s.works.length > 0) || (s.materials && s.materials.length > 0)) && (
                  <div className="pl-7 grid grid-cols-2 gap-[var(--gap-xs,12px)]">

                    {/* Работы */}
                    <div>
                      <p className="font-inter text-[10px] font-semibold uppercase tracking-wider text-[color:var(--grey-400,#adadad)] mb-[6px]">
                        Работы
                      </p>
                      <div className="space-y-[5px]">
                        {s.works && s.works.length > 0 ? s.works.map((w, wi) => (
                          <div key={wi} className="flex items-start gap-1.5">
                            <span className="shrink-0 text-[color:var(--grey-300,#c2c2c2)] text-[10px] mt-[3px] leading-none">•</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-inter text-[12px] leading-[1.4] text-[color:var(--grey-700,#5e5e5e)]">{w.name}</p>
                              {w.note && (
                                <p className="font-inter text-[10px] italic text-[color:var(--grey-400,#adadad)]">{w.note}</p>
                              )}
                            </div>
                            <span
                              className="shrink-0 font-inter font-medium text-[12px] text-[color:var(--grey-850,#313131)] whitespace-nowrap"
                              style={{ fontFeatureSettings: "'tnum' 1" }}
                            >
                              {w.price.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        )) : (
                          <p className="font-inter text-[12px] italic text-[color:var(--grey-300,#c2c2c2)]">—</p>
                        )}
                      </div>
                    </div>

                    {/* Материалы */}
                    <div>
                      <p className="font-inter text-[10px] font-semibold uppercase tracking-wider text-[color:var(--grey-400,#adadad)] mb-[6px]">
                        Материалы
                      </p>
                      <div className="space-y-[5px]">
                        {s.materials && s.materials.length > 0 ? s.materials.map((m, mi) => (
                          <div key={mi} className="flex items-start gap-1.5">
                            <span className="shrink-0 text-[color:var(--grey-300,#c2c2c2)] text-[10px] mt-[3px] leading-none">•</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-inter text-[12px] leading-[1.4] text-[color:var(--grey-700,#5e5e5e)]">{m.name}</p>
                              <p className="font-inter text-[10px] text-[color:var(--grey-400,#adadad)]">
                                {typeof m.qty === 'number'
                                  ? `${m.qty} шт. × ${m.price.toLocaleString('ru-RU')} ₽`
                                  : m.qty}
                              </p>
                            </div>
                            <span
                              className="shrink-0 font-inter font-medium text-[12px] text-[color:var(--grey-850,#313131)] whitespace-nowrap"
                              style={{ fontFeatureSettings: "'tnum' 1" }}
                            >
                              {typeof m.qty === 'number'
                                ? (m.price * m.qty).toLocaleString('ru-RU')
                                : m.price.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        )) : (
                          <p className="font-inter text-[12px] italic text-[color:var(--grey-300,#c2c2c2)]">—</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* Примечание */}
                {s.note && (
                  <p className="font-inter text-[11px] italic leading-[1.5] text-[color:var(--grey-400,#adadad)] mt-[var(--gap-xs,12px)] pl-7">
                    {s.note}
                  </p>
                )}

              </div>
            ))}
          </div>

        </Section>
      ))}
    </div>
  )
}

function SystemPage() {
  const [mode, setMode] = useState<'comfort' | 'tiny'>('comfort')
  const [viewIdx, setViewIdx] = useState(0) // 0=calculator, 1=system, 2=logic
  const [calcPage, setCalcPage] = useState<1 | 2 | 3>(1)
  const [step1Live, setStep1Live] = useState<{ areaStr: string; freeLayout: boolean; condition: number; rows: PriceRow[]; total: number }>({ areaStr: '35', freeLayout: false, condition: 0, rows: [], total: 0 })
  const [step2Total, setStep2Total] = useState(0)
  const [step2Params, setStep2Params] = useState<Step2Params>({ ceiling: 0, electricity: 1, walls: 1, toilet: 2, freeLayout: false })
  const [step3Total, setStep3Total] = useState<number | null>(null)
  const [toggle, setToggle] = useState(false)
  const [radio, setRadio] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [segment, setSegment] = useState(0)
  const [selectedCard, setSelectedCard] = useState<number>(0)
  const [toggleSection, setToggleSection] = useState(true)

  const activeTotal = calcPage >= 2 && step2Total > 0 ? step2Total : step1Live.total
  const priceBoxTotal = calcPage === 3 && step3Total !== null ? step3Total : activeTotal
  const priceBoxRows  = step1Live.rows

  const handleMode = (m: 'comfort' | 'tiny') => {
    setMode(m)
    document.documentElement.dataset.mode = m === 'tiny' ? 'tiny' : ''
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--grey-50,#f5f5f5)] px-[var(--pad-l,32px)] py-[var(--pad-l,32px)]">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-[var(--gap-m,32px)]">
        <h1 className="font-unbounded font-semibold text-[length:var(--f-size-2xl,44px)] leading-[var(--f-lh-xl,48px)] text-[color:var(--grey-850,#313131)]">
          WB&nbsp;Калькулятор
        </h1>
        <div className="flex gap-2 flex-wrap items-center">
          <SegmentControl
            options={['Калькулятор', 'Система', 'Логика']}
            value={viewIdx}
            onChange={setViewIdx}
          />
          <SegmentControl
            options={['Просторный', 'Плотный']}
            value={mode === 'comfort' ? 0 : 1}
            onChange={i => handleMode(i === 0 ? 'comfort' : 'tiny')}
            variant="dark"
          />
        </div>
      </div>

      {viewIdx === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-[var(--pad-l,32px)]">
          {/* iPhone 17 frame — 402×874 */}
          <div
            style={{ width: 402, height: 874 }}
            className="relative bg-[var(--grey-50,#f5f5f5)] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden flex-shrink-0 rounded-[var(--round-l,24px)]"
          >
            {/* Dynamic Island */}
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-10" />
            {/* Контент-область ниже Dynamic Island */}
            <div id="calc-overlay-target" className="absolute inset-0 top-[62px] overflow-hidden">

              {/* Скользящий контент — все три страницы, заполняет весь контейнер */}
              <div className="absolute inset-0 overflow-hidden">

                {/* Стр. 1 — базовый слой */}
                <div className="absolute inset-0">
                  <StepOne onLiveChange={setStep1Live} />
                </div>

                {/* Стр. 2 — въезжает справа, уходит влево при переходе на стр. 3 */}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-in-out"
                  style={{
                    transform: calcPage < 2
                      ? 'translateX(100%)'
                      : calcPage === 2
                      ? 'translateX(0)'
                      : 'translateX(-100%)',
                  }}
                >
                  <StepTwo
                    areaStr={step1Live.areaStr}
                    freeLayout={step1Live.freeLayout}
                    condition={step1Live.condition}
                    onBack={() => setCalcPage(1)}
                    onTotalChange={setStep2Total}
                    onParamsChange={setStep2Params}
                  />
                </div>

                {/* Стр. 3 — въезжает справа */}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-in-out"
                  style={{ transform: calcPage >= 3 ? 'translateX(0)' : 'translateX(100%)' }}
                >
                  <StepThree
                    areaStr={step1Live.areaStr}
                    rows={priceBoxRows}
                    globalTotal={activeTotal}
                    condition={step1Live.condition}
                    step2Params={step2Params}
                    onClose={() => setCalcPage(1)}
                    onTotalChange={setStep3Total}
                  />
                </div>

              </div>

              {/* PriceBox — прибит к низу поверх контента */}
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <PriceBox
                  rows={priceBoxRows}
                  total={priceBoxTotal}
                  page="2nd-3rd"
                  showList={calcPage <= 2}
                  showBtBack={calcPage === 3}
                  ctaText={
                    calcPage === 1 ? 'Сформировать смету' :
                    calcPage === 2 ? 'Перейти к смете' :
                    'Скачать в PDF'
                  }
                  onCtaClick={
                    calcPage === 1 ? () => setCalcPage(2) :
                    calcPage === 2 ? () => setCalcPage(3) :
                    undefined
                  }
                  onBackClick={calcPage === 3 ? () => setCalcPage(2) : undefined}
                />
              </div>

            </div>
          </div>

          {/* Кнопка "Открыть в отдельной вкладке" */}
          <button
            onClick={() => window.open('/#calc', '_blank')}
            className="font-inter font-medium text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)] text-[color:var(--grey-850,#313131)] bg-[var(--grey-0,white)] px-[var(--inset-l,20px)] py-[var(--inset-xs,8px)] rounded-[var(--round-xs,10px)] cursor-pointer hover:bg-[var(--grey-100,#ebebeb)] transition-colors"
          >
            Открыть в отдельной вкладке
          </button>

        </div>
      )}

      {viewIdx === 2 && <LogicPage />}

      {viewIdx === 1 && (
      <div className="max-w-2xl mx-auto space-y-[var(--gap-m,32px)]">

        {/* Colors */}
        <Section title="Colors">
          <div className="space-y-[var(--gap-s,16px)]">
            <div>
              <p className="font-inter text-xs text-[color:var(--grey-500,#999)] mb-[var(--gap-xs,12px)]">Grey</p>
              <div className="flex flex-wrap gap-[var(--gap-xs,12px)]">
                {GREY_COLORS.map(c => (
                  <div key={c.token} className="flex flex-col items-center gap-[var(--gap-3xs,4px)]">
                    <div
                      className="w-[48px] h-[48px] rounded-[var(--round-s,12px)] border border-[var(--grey-150,#e0e0e0)]"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-mono text-[9px] text-[color:var(--grey-600,#7b7b7b)] text-center leading-tight">{c.token}</span>
                    <span className="font-mono text-[9px] text-[color:var(--grey-400,#adadad)] text-center">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-inter text-xs text-[color:var(--grey-500,#999)] mb-[var(--gap-xs,12px)]">Accent</p>
              <div className="flex flex-wrap gap-[var(--gap-xs,12px)]">
                {ACCENT_COLORS.map(c => (
                  <div key={c.token} className="flex flex-col items-center gap-[var(--gap-3xs,4px)]">
                    <div
                      className="w-[48px] h-[48px] rounded-[var(--round-s,12px)] border border-[var(--grey-150,#e0e0e0)]"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-mono text-[9px] text-[color:var(--grey-600,#7b7b7b)] text-center leading-tight">{c.token}</span>
                    <span className="font-mono text-[9px] text-[color:var(--grey-400,#adadad)] text-center">{c.hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-[var(--gap-xs,12px)]">
            {TYPOGRAPHY.map((t) => (
              <div key={t.name} className="flex items-baseline gap-[var(--gap-s,16px)]">
                <span className="w-28 shrink-0 font-inter text-xs text-[color:var(--grey-500,#999)]">{t.name}</span>
                <span
                  className={`${t.font} ${t.weight} ${t.size} ${t.lh} text-[color:var(--grey-850,#313131)] flex-1`}
                  style={'features' in t ? { fontFeatureSettings: "'lnum' 1, 'tnum' 1" } : undefined}
                >
                  {t.sample}
                </span>
                <span className="shrink-0 flex gap-1 flex-wrap justify-end">
                  <TokenBadge label={t.size.match(/--[\w-]+/)?.[0]?.replace('--', '') ?? ''} />
                  <TokenBadge label={t.lh.match(/--[\w-]+/)?.[0]?.replace('--', '') ?? ''} />
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Icons */}
        <Section title="Icons">
          <Row>
            {(['ic-plus','ic-minus','ic-close','ic-pencil','ic-question','ic-list','ic-chevron','ic-back'] as const).map((name) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <Icon name={name} size={24} className="text-[color:var(--grey-850,#313131)]" />
                <span className="font-mono text-[9px] text-[color:var(--grey-500,#999)]">{name.replace('ic-','')}</span>
              </div>
            ))}
          </Row>
        </Section>

        {/* Ic */}
        <Section title="Ic — icon states">
          <Row>
            {(['default','hover','active'] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <Ic icon="ic-question" state={s} />
                <Label>{s}</Label>
              </div>
            ))}
          </Row>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="grey-700 / grey-800 / grey-850" />
          </div>
        </Section>

        {/* IcControl */}
        <Section title="IcControl">
          <div className="space-y-[var(--gap-s,16px)]">
            <div>
              <Label>grey</Label>
              <Row>
                {(['s','m','l'] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-minus" color="grey" size={s} />
                    <Label>{s}</Label>
                  </div>
                ))}
                {(['active','disable'] as const).map((st) => (
                  <div key={st} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-minus" color="grey" size="m" state={st} />
                    <Label>{st}</Label>
                  </div>
                ))}
              </Row>
            </div>
            <div>
              <Label>secondary</Label>
              <Row>
                {(['s','m','l'] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-plus" color="secondary" size={s} />
                    <Label>{s}</Label>
                  </div>
                ))}
                {(['active','disable'] as const).map((st) => (
                  <div key={st} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-plus" color="secondary" size="m" state={st} />
                    <Label>{st}</Label>
                  </div>
                ))}
              </Row>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="inset-s/m/xl → padding" />
            <TokenBadge label="round-xs / round-m → border-radius" />
          </div>
        </Section>

        {/* Button */}
        <Section title="Button">
          <Button>Рассчитать стоимость</Button>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="inset-xl → py" />
            <TokenBadge label="round-s → border-radius" />
            <TokenBadge label="f-size-l + f-lh-m" />
          </div>
        </Section>

        {/* Input */}
        <Section title="Input">
          <div className="space-y-[var(--gap-xs,12px)]">
            <Input value={inputVal} onChange={setInputVal} placeholder="25" unit="м²" />
            <p className="font-inter text-xs text-[color:var(--grey-500,#999)]">
              Только цифры и десятичный разделитель (. или ,)
            </p>
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="inset-l → px" />
              <TokenBadge label="inset-m → py" />
              <TokenBadge label="round-s → border-radius" />
              <TokenBadge label="f-size-m + f-lh-m" />
            </div>
          </div>
        </Section>

        {/* Segment Control */}
        <Section title="Segment Control">
          <div className="space-y-[var(--gap-xs,12px)]">
            <SegmentControl options={['Косметика', 'White box', 'Бетон']} value={segment} onChange={setSegment} />
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="inset-2xs → container padding" />
              <TokenBadge label="inset-s → segment padding" />
              <TokenBadge label="round-full → border-radius" />
              <TokenBadge label="f-size-m + f-lh-m" />
            </div>
          </div>
        </Section>

        {/* Card */}
        <Section title="Card">
          <div className="space-y-[var(--gap-xs,12px)]">
            <Card
              header="Только покраска"
              subText="Подходит, если ваше помещение уже разделено комнатами"
              selected={selectedCard === 0}
              onChange={() => setSelectedCard(0)}
            />
            <Card
              header="White box"
              subText="Черновая отделка: стяжка пола, штукатурка стен, разводка коммуникаций"
              selected={selectedCard === 1}
              onChange={() => setSelectedCard(1)}
            />
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="pad-s → padding" />
              <TokenBadge label="round-m → border-radius" />
              <TokenBadge label="gap-xs → radio + content" />
              <TokenBadge label="gap-s → header + subtext" />
              <TokenBadge label="f-size-l (H3) + f-size-xs (text-xs)" />
            </div>
          </div>
        </Section>

        {/* Chips */}
        <Section title="Chip">
          <Row>
            <Chip color="grey">Косметика</Chip>
            <Chip color="grey">White box</Chip>
            <Chip color="secondary">Косметика</Chip>
            <Chip color="secondary">White box</Chip>
          </Row>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="inset-l → px" />
            <TokenBadge label="inset-xs → py" />
            <TokenBadge label="round-xs → border-radius" />
            <TokenBadge label="f-size-s + f-lh-m" />
          </div>
        </Section>

        {/* Controls */}
        <Section title="Controls">
          <Row>
            <span className="font-inter text-[color:var(--grey-700,#5e5e5e)] text-[length:var(--f-size-s,16px)]">Toggle</span>
            <Toggle checked={toggle} onChange={setToggle} />
            <Label>{toggle ? 'on' : 'off'}</Label>
            <span className="w-4" />
            <span className="font-inter text-[color:var(--grey-700,#5e5e5e)] text-[length:var(--f-size-s,16px)]">Radio</span>
            <Radio checked={radio} onChange={setRadio} />
            <Label>{radio ? 'on' : 'off'}</Label>
          </Row>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="round-full → border-radius" />
          </div>
        </Section>

        {/* Toggle Section */}
        <Section title="Toggle Section">
          <div className="space-y-[var(--gap-xs,12px)]">
            <ToggleSection checked={toggleSection} onChange={setToggleSection} />
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="gap-s → padding" />
              <TokenBadge label="gap-xs → toggle + text" />
              <TokenBadge label="round-m → border-radius" />
              <TokenBadge label="f-size-m (title) + f-size-xs (desc)" />
            </div>
          </div>
        </Section>

        {/* Calculation Unit */}
        <Section title="Calculation Unit">
          <CalculationUnit />
        </Section>

        {/* Price Box */}
        <Section title="Price Box">
          <PriceBox />
        </Section>

      </div>
      )}

    </div>
  )
}

export default function App() {
  const [routePage, setRoutePage] = useState(() =>
    window.location.hash === '#calc' ? 'calc' : 'system'
  )
  useEffect(() => {
    const handler = () =>
      setRoutePage(window.location.hash === '#calc' ? 'calc' : 'system')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (routePage === 'calc') {
    return <CalcPage />
  }

  return <SystemPage />
}

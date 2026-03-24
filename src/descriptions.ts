// Lookup-модуль для описаний работ и материалов.
// Импортирует pvz_descriptions.json и ищет описание по имени — без изменений calc.ts.
import data from '../pvz_descriptions.json'

type WorkDesc = {
  name: string
  short: string
  steps: string[]
  notes?: string
}

type MaterialDesc = {
  name: string
  short: string
  description?: string
  specs?: Record<string, string>
}

const works  = (data as unknown as { works: WorkDesc[]; materials: MaterialDesc[] }).works
const mats   = (data as unknown as { works: WorkDesc[]; materials: MaterialDesc[] }).materials

// Нормализация: нижний регистр, убираем пунктуацию и слэши
function norm(s: string) {
  return s.toLowerCase().replace(/[.,()–—\-«»"'/]/g, ' ').replace(/\s+/g, ' ').trim()
}

function findWork(name: string): WorkDesc | undefined {
  const n = norm(name)
  return (
    works.find(w => norm(w.name) === n) ||
    works.find(w => n.startsWith(norm(w.name))) ||
    works.find(w => norm(w.name).startsWith(n)) ||
    works.find(w => n.includes(norm(w.name)) || norm(w.name).includes(n))
  )
}

function findMaterial(name: string): MaterialDesc | undefined {
  const n = norm(name)
  return (
    mats.find(m => norm(m.name) === n) ||
    mats.find(m => n.startsWith(norm(m.name))) ||
    mats.find(m => norm(m.name).startsWith(n)) ||
    mats.find(m => n.includes(norm(m.name)) || norm(m.name).includes(n))
  )
}

const SPEC_LABELS: Record<string, string> = {
  area: 'Площадь',
  article: 'Артикул',
  autonomy: 'Автономность',
  brand: 'Производитель',
  capacity: 'Ёмкость',
  cell_size: 'Размер ячейки',
  cells: 'Ячейки',
  channels: 'Каналы',
  class: 'Класс',
  collection: 'Коллекция',
  color: 'Цвет',
  color_marking: 'Цвет/маркировка',
  color_temp: 'Цветовая температура',
  conductor: 'Жила',
  consumption: 'Расход',
  consumption_ceiling: 'Расход (потолок)',
  consumption_partition: 'Расход (перегородки)',
  cooling_power: 'Мощность охлаждения',
  corners: 'Углы',
  current: 'Ток',
  diameter: 'Диаметр',
  fire_class: 'Класс пожарной опасности',
  finish: 'Покрытие',
  fov: 'Угол обзора',
  grade: 'Марка',
  hdd_slots: 'Слоты HDD',
  includes: 'Включает',
  insulation: 'Изоляция',
  interface: 'Интерфейс',
  ip_class: 'Класс защиты IP',
  joint_width: 'Ширина шва',
  layer_thickness: 'Толщина слоя',
  length: 'Длина',
  load_per_shelf: 'Нагрузка на полку',
  material: 'Материал',
  max_hdd: 'Макс. объём HDD',
  module_size: 'Размер модуля',
  modules: 'Модули',
  mount: 'Монтаж',
  os: 'ОС',
  outlet: 'Выход',
  pei_class: 'Класс PEI',
  poles: 'Полюса',
  ports: 'Порты',
  power: 'Мощность',
  price: 'Цена',
  quantity: 'Количество',
  ram: 'ОЗУ',
  resolution: 'Разрешение',
  screen: 'Экран',
  section: 'Секция',
  shelves: 'Полок',
  size: 'Размер',
  standard: 'Стандарт',
  storage: 'Накопитель',
  surface: 'Поверхность',
  thickness: 'Толщина',
  type: 'Тип',
  volume: 'Объём',
  wear_layer: 'Износостойкий слой',
  weight: 'Вес',
  width: 'Ширина',
}

/** Возвращает отформатированное описание работы для попапа (без заголовка) */
export function getWorkDescription(name: string): string | undefined {
  const w = findWork(name)
  if (!w) return undefined
  return w.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
}

/** Возвращает текстовое описание материала (без заголовка short) */
export function getMaterialDescription(name: string): string | undefined {
  const m = findMaterial(name)
  if (!m) return undefined
  return m.description || undefined
}

/** Возвращает структурированные характеристики материала для попапа */
export function getMaterialSpecs(name: string): Array<{ label: string; value: string }> | undefined {
  const m = findMaterial(name)
  if (!m || !m.specs) return undefined
  const entries = Object.entries(m.specs)
    .filter(([k]) => k !== 'download_link' && k !== 'price')
    .map(([k, v]) => ({ label: SPEC_LABELS[k] ?? k, value: v }))
  return entries.length > 0 ? entries : undefined
}

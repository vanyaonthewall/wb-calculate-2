import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './Icon'
import { Toggle } from './Toggle'
import { WorkSection } from './WorkSection'
import { WorkEntry } from './WorkContainer'
import { MaterialEntry } from './Material'
import { AnimatedHeight } from './AnimatedHeight'
import { AnimatedPrice } from './AnimatedPrice'
import wallImg from '../img/picture=wall.png'

export type UnitSection = {
  name: string
  description?: string
  works?: WorkEntry[]
  materials?: MaterialEntry[]
}

type CalculationUnitProps = {
  name?: string
  imageUrl?: string
  sections?: UnitSection[]
  initialTotal?: number
  onTotalChange?: (total: number) => void
}

function scaleSection(sections: UnitSection[], initialTotal: number): UnitSection[] {
  const rawTotal = sections.reduce((sum, s) =>
    sum + (s.works ?? []).reduce((a, w) => a + w.price, 0) +
    (s.materials ?? []).reduce((a, m) => a + m.price * m.quantity, 0), 0)
  if (!rawTotal) return sections
  const scale = initialTotal / rawTotal
  const scaled = sections.map(s => ({
    ...s,
    works: (s.works ?? []).map(w => ({ ...w, price: Math.round(w.price * scale) })),
    materials: (s.materials ?? []).map(m => ({ ...m, price: Math.round(m.price * scale) })),
  }))
  // Фикс рондинга: подгоняем последний элемент последней секции чтобы сумма = initialTotal
  const scaledTotal = scaled.reduce((sum, s) =>
    sum + (s.works ?? []).reduce((a, w) => a + w.price, 0) +
    (s.materials ?? []).reduce((a, m) => a + m.price * m.quantity, 0), 0)
  const diff = initialTotal - scaledTotal
  if (diff !== 0) {
    const last = { ...scaled[scaled.length - 1] }
    if ((last.works ?? []).length > 0) {
      const works = [...last.works!]
      works[works.length - 1] = { ...works[works.length - 1], price: works[works.length - 1].price + diff }
      last.works = works
    } else if ((last.materials ?? []).length > 0) {
      const mats = [...last.materials!]
      mats[mats.length - 1] = { ...mats[mats.length - 1], price: mats[mats.length - 1].price + diff }
      last.materials = mats
    }
    scaled[scaled.length - 1] = last
  }
  return scaled
}

const DEFAULT_SECTIONS: UnitSection[] = [
  {
    name: 'Брендовая покраска',
    description: 'Нанесение износостойкой краски в 2 слоя',
    works: [
      { workName: 'Сборка металлического каркаса', price: 12000 },
      { workName: 'Сборка металлического каркаса', price: 12000 },
    ],
    materials: [
      {
        materialText: 'Плитка керамическая 600х600 Kerama Marazzi тераццо светло серый',
        price: 500,
        quantity: 3,
      },
      {
        materialText: 'Плитка керамическая 600х600 Kerama Marazzi тераццо светло серый',
        price: 500,
        quantity: 3,
      },
    ],
  },
]

export function CalculationUnit({
  name = 'Стены и полы',
  imageUrl = wallImg,
  sections: rawSections = DEFAULT_SECTIONS,
  initialTotal,
  onTotalChange,
}: CalculationUnitProps) {
  const sections = useMemo(
    () => initialTotal && initialTotal > 0 ? scaleSection(rawSections, initialTotal) : rawSections,
    [rawSections, initialTotal]
  )
  const [isOpen, setIsOpen] = useState(false)
  const [toggle, setToggle] = useState(true)
  const [activeMap, setActiveMap] = useState<Record<number, boolean>>(
    Object.fromEntries(sections.map((_, i) => [i, true]))
  )
  const [resetVersion, setResetVersion] = useState(0)
  const [headerHovered, setHeaderHovered] = useState(false)

  const [sectionTotals, setSectionTotals] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      sections.map((s, i) => [
        i,
        (s.works ?? []).reduce((sum, w) => sum + w.price, 0) +
          (s.materials ?? []).reduce((sum, m) => sum + m.price * m.quantity, 0),
      ])
    )
  )

  const unitTotal = sections.reduce(
    (sum, _, i) => sum + (toggle && (activeMap[i] ?? true) ? (sectionTotals[i] ?? 0) : 0),
    0
  )

  const onTotalChangeRef = useRef(onTotalChange)
  onTotalChangeRef.current = onTotalChange
  useEffect(() => {
    onTotalChangeRef.current?.(unitTotal)
  }, [unitTotal])

  // Auto-disable: если все секции выключены — выключаем весь юнит
  useEffect(() => {
    if (toggle) {
      const allOff = sections.every((_, i) => !(activeMap[i] ?? true))
      if (allOff) setToggle(false)
    }
  }, [activeMap, toggle, sections])

  const handleSectionTotalChange = useCallback((i: number, total: number) => {
    setSectionTotals(prev => ({ ...prev, [i]: total }))
  }, [])

  // Стабильные коллбэки для каждой секции (избегаем перерендера WorkSection)
  const sectionTotalCallbacks = useRef(
    sections.map((_, i) => (total: number) => handleSectionTotalChange(i, total))
  )
  useEffect(() => {
    sectionTotalCallbacks.current = sections.map(
      (_, i) => (total: number) => handleSectionTotalChange(i, total)
    )
  }, [handleSectionTotalChange, sections.length])

  const iconColor = headerHovered ? 'var(--grey-600, #7b7b7b)' : 'var(--grey-500, #999999)'
  const priceColor = toggle ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const nameColor = toggle ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'

  return (
    <div className="flex flex-col rounded-[var(--round-l,24px)] p-[var(--pad-m,24px)] w-full bg-[var(--grey-0,white)]">

      {/* Header — pr-[var(--pad-s)] симметрично pl, тогл выравнивается по токену */}
      <div className="flex items-center w-full gap-[var(--gap-2xs,8px)] px-[var(--pad-s,16px)]">

        {/* Левая часть: chevron + картинка + название */}
        <button
          className="flex flex-1 items-center min-w-0 cursor-pointer gap-[var(--gap-2xs,8px)]"
          onMouseEnter={() => setHeaderHovered(true)}
          onMouseLeave={() => setHeaderHovered(false)}
          onClick={() => setIsOpen(v => !v)}
        >
          <span
            className="shrink-0 inline-flex"
            style={{
              color: iconColor,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease, color 0.15s ease',
            }}
          >
            <Icon name="ic-chevron" size={24} />
          </span>

          <div className="shrink-0 w-[40px] h-[40px] rounded-[var(--round-s,12px)] overflow-hidden">
            {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover" />}
          </div>

          <p
            className="flex-1 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] line-clamp-2 text-left"
            style={{ color: nameColor }}
          >
            {name}
          </p>
        </button>

        {/* Правая часть: цена + тогл */}
        <div className="flex items-center shrink-0 gap-[var(--gap-3xs,4px)]">
          <AnimatedPrice
            value={unitTotal}
            className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[85px] text-right"
            style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
          />
          <Toggle
            checked={toggle}
            onChange={v => {
              if (v) {
                setActiveMap(Object.fromEntries(sections.map((_, i) => [i, true])))
                setResetVersion(r => r + 1)
              }
              setToggle(v)
            }}
          />
        </div>
      </div>

      {/* Контент — всегда смонтирован, AnimatedHeight управляет высотой */}
      <AnimatedHeight open={isOpen}>
        <div
          className="flex flex-col gap-[var(--gap-xs,12px)]"
          style={{ paddingTop: 'var(--gap-s, 16px)' }}
        >
          {sections.map((s, i) => (
            <WorkSection
              key={i}
              name={s.name}
              description={s.description}
              works={s.works}
              materials={s.materials}
              active={toggle && (activeMap[i] ?? true)}
              resetVersion={resetVersion}
              onToggle={v => {
                setActiveMap(prev => ({ ...prev, [i]: v }))
                if (v && !toggle) setToggle(true)
              }}
              onTotalChange={sectionTotalCallbacks.current[i]}
            />
          ))}
        </div>
      </AnimatedHeight>
    </div>
  )
}

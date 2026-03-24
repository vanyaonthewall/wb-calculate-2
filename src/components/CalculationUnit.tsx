import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getMaterialDescription, getMaterialSpecs } from '../descriptions'
import { registerPopup, closeOtherPopups } from '../popupBus'
import { Icon } from './Icon'
import { Toggle } from './Toggle'
import { WorkSection } from './WorkSection'
import { WorkEntry } from './WorkContainer'
import { MaterialEntry, MaterialClickData } from './Material'
import { MaterialsSection } from './MaterialsSection'
import { AnimatedHeight } from './AnimatedHeight'
import { AnimatedPrice } from './AnimatedPrice'
import { ItemPopup, PopupData } from './ItemPopup'
import wallImg from '../img/picture=wall.png'

export type UnitSection = {
  name: string
  description?: string
  works?: WorkEntry[]
  materials?: MaterialEntry[]
  initialActive?: boolean           // false → секция начинает выключенной
  mutuallyExclusiveGroup?: string   // включение одной выключает остальные в группе
  skipScaling?: boolean             // не участвует в пропорциональном масштабировании
  canExpand?: boolean               // false → секция не раскрывается (только тогл)
}

type CalculationUnitProps = {
  name?: string
  nameNode?: ReactNode
  imageUrl?: string
  sections?: UnitSection[]
  flatMaterials?: MaterialEntry[]
  initialTotal?: number
  onTotalChange?: (total: number) => void
  canExpand?: boolean
  initialEnabled?: boolean
  toggleLeft?: boolean
}

function scaleSection(sections: UnitSection[], initialTotal: number): UnitSection[] {
  // skipScaling секции не участвуют в пропорциональном масштабировании
  const rawTotal = sections
    .filter(s => !s.skipScaling)
    .reduce((sum, s) =>
      sum + (s.works ?? []).reduce((a, w) => a + w.price, 0) +
      (s.materials ?? []).reduce((a, m) => a + m.price * m.quantity, 0), 0)
  if (!rawTotal) return sections
  const scale = initialTotal / rawTotal
  const scaled = sections.map(s =>
    s.skipScaling ? s : ({
      ...s,
      works: (s.works ?? []).map(w => ({ ...w, price: Math.round(w.price * scale) })),
      materials: (s.materials ?? []).map(m => ({ ...m, price: Math.round(m.price * scale) })),
    })
  )
  // Корректируем погрешность округления на последней non-skip секции
  const scaledTotal = scaled
    .filter(s => !s.skipScaling)
    .reduce((sum, s) =>
      sum + (s.works ?? []).reduce((a, w) => a + w.price, 0) +
      (s.materials ?? []).reduce((a, m) => a + m.price * m.quantity, 0), 0)
  const diff = initialTotal - scaledTotal
  if (diff !== 0) {
    let lastIdx = -1
    for (let j = scaled.length - 1; j >= 0; j--) {
      if (!sections[j].skipScaling) { lastIdx = j; break }
    }
    if (lastIdx >= 0) {
      const last = { ...scaled[lastIdx] }
      if ((last.works ?? []).length > 0) {
        const works = [...last.works!]
        works[works.length - 1] = { ...works[works.length - 1], price: works[works.length - 1].price + diff }
        last.works = works
      } else if ((last.materials ?? []).length > 0) {
        const mats = [...last.materials!]
        mats[mats.length - 1] = { ...mats[mats.length - 1], price: mats[mats.length - 1].price + diff }
        last.materials = mats
      }
      scaled[lastIdx] = last
    }
  }
  return scaled
}

function scaleMaterials(materials: MaterialEntry[], initialTotal: number): MaterialEntry[] {
  const rawTotal = materials.reduce((sum, m) => sum + m.price * m.quantity, 0)
  if (!rawTotal) return materials
  const scale = initialTotal / rawTotal
  return materials.map(m => ({ ...m, price: Math.round(m.price * scale) }))
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
  nameNode,
  imageUrl = wallImg,
  sections: rawSections = DEFAULT_SECTIONS,
  flatMaterials: rawFlatMaterials,
  initialTotal,
  onTotalChange,
  canExpand = true,
  initialEnabled = true,
  toggleLeft = false,
}: CalculationUnitProps) {
  const sections = useMemo(
    () => !rawFlatMaterials && initialTotal && initialTotal > 0
      ? scaleSection(rawSections, initialTotal)
      : rawSections,
    [rawSections, rawFlatMaterials, initialTotal]
  )

  const scaledFlatMaterials = useMemo(
    () => rawFlatMaterials
      ? (initialTotal && initialTotal > 0 ? scaleMaterials(rawFlatMaterials, initialTotal) : rawFlatMaterials)
      : undefined,
    [rawFlatMaterials, initialTotal]
  )

  const [isOpen, setIsOpen] = useState(false)
  const [toggle, setToggle] = useState(initialEnabled)
  const [activeMap, setActiveMap] = useState<Record<number, boolean>>(
    Object.fromEntries(sections.map((s, i) => [i, s.initialActive ?? true]))
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

  const [flatTotal, setFlatTotal] = useState(() =>
    scaledFlatMaterials
      ? scaledFlatMaterials.reduce((sum, m) => sum + m.price * m.quantity, 0)
      : 0
  )

  useEffect(() => {
    if (scaledFlatMaterials) {
      setFlatTotal(scaledFlatMaterials.reduce((sum, m) => sum + m.price * m.quantity, 0))
    }
  }, [scaledFlatMaterials])

  const [flatPopupData, setFlatPopupData] = useState<PopupData>(null)
  const [flatAnimKey, setFlatAnimKey] = useState(0)
  const flatPopupDataRef = useRef<PopupData>(null)
  flatPopupDataRef.current = flatPopupData

  const closeFlatPopup = useCallback(() => setFlatPopupData(null), [])
  useEffect(() => registerPopup(closeFlatPopup), [closeFlatPopup])

  const openFlatPopup = useCallback((newData: PopupData) => {
    closeOtherPopups(closeFlatPopup)
    setFlatAnimKey(k => k + 1)
    setFlatPopupData(newData)
  }, [closeFlatPopup])

  const handleFlatMaterialClick = useCallback((data: MaterialClickData) => {
    // Повторный клик на уже открытый материал — закрываем
    if (flatPopupDataRef.current?.name === data.name) {
      setFlatPopupData(null)
      return
    }
    openFlatPopup({
      name: data.name,
      price: data.price,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      included: data.active,
      gender: 'f',
      showDownload: true,
      description: getMaterialDescription(data.name),
      specs: getMaterialSpecs(data.name),
      onQuantityChange: (qty) => {
        setFlatPopupData(prev => prev ? { ...prev, quantity: qty, price: (prev.unitPrice ?? 0) * qty } : null)
        data.onQuantityChange(qty)
      },
      onIncludedChange: (v) => {
        setFlatPopupData(prev => prev ? { ...prev, included: v } : null)
        data.onActiveChange(v)
      },
    })
  }, [openFlatPopup])

  const unitTotal = scaledFlatMaterials
    ? (toggle ? flatTotal : 0)
    : sections.reduce(
        (sum, s, i) => sum + (toggle && (activeMap[i] ?? (s.initialActive ?? true)) ? (sectionTotals[i] ?? 0) : 0),
        0
      )

  const onTotalChangeRef = useRef(onTotalChange)
  onTotalChangeRef.current = onTotalChange
  useEffect(() => {
    onTotalChangeRef.current?.(unitTotal)
  }, [unitTotal])

  // При смене rawSections (новые параметры от родителя) — полный сброс activeMap.
  // Это гарантирует что initialActive: false всегда применяется при структурных изменениях.
  const prevRawRef = useRef(rawSections)
  useEffect(() => {
    if (prevRawRef.current !== rawSections) {
      prevRawRef.current = rawSections
      setActiveMap(Object.fromEntries(rawSections.map((s, i) => [i, s.initialActive ?? true])))
      setSectionTotals(Object.fromEntries(
        rawSections.map((s, i) => [
          i,
          (s.works ?? []).reduce((sum, w) => sum + w.price, 0) +
            (s.materials ?? []).reduce((sum, m) => sum + m.price * m.quantity, 0),
        ])
      ))
    }
  }, [rawSections])

  // Auto-disable: если все секции выключены — выключаем весь юнит
  useEffect(() => {
    if (!scaledFlatMaterials && toggle) {
      const allOff = sections.every((s, i) => !(activeMap[i] ?? (s.initialActive ?? true)))
      if (allOff) setToggle(false)
    }
  }, [activeMap, toggle, sections, scaledFlatMaterials])

  const handleSectionTotalChange = useCallback((i: number, total: number) => {
    setSectionTotals(prev => ({ ...prev, [i]: total }))
  }, [])

  const sectionTotalCallbacks = useRef(
    sections.map((_, i) => (total: number) => handleSectionTotalChange(i, total))
  )
  useEffect(() => {
    sectionTotalCallbacks.current = sections.map(
      (_, i) => (total: number) => handleSectionTotalChange(i, total)
    )
  }, [handleSectionTotalChange, sections.length])

  // При включении тогла: если все секции initialActive=false — активируем первую
  const handleToggleOn = () => {
    const newMap = Object.fromEntries(sections.map((s, i) => [i, s.initialActive ?? true]))
    const allOff = sections.every((_, i) => !newMap[i])
    if (allOff && sections.length > 0) newMap[0] = true
    setActiveMap(newMap)
    setResetVersion(r => r + 1)
  }

  const iconColor = headerHovered ? 'var(--grey-600, #7b7b7b)' : 'var(--grey-500, #999999)'
  const priceColor = toggle ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const nameColor  = toggle ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'

  return (
    <div
      className="flex flex-col rounded-[var(--round-l,24px)] p-[var(--pad-m,24px)] w-full"
      style={{
        backgroundColor: toggle ? 'var(--grey-0, white)' : 'var(--grey-100, #ebebeb)',
        transition: 'background-color 0.2s ease',
      }}
    >

      {/* Header */}
      <div className="flex items-center w-full gap-[var(--gap-2xs,8px)] px-[var(--pad-s,16px)]">

        {/* Тогл слева (версия 2) */}
        {toggleLeft && (
          <Toggle
            checked={toggle}
            onChange={v => {
              if (v) handleToggleOn()
              setToggle(v)
            }}
          />
        )}

        {/* Центральная часть: chevron + картинка + название */}
        <button
          className="flex flex-1 items-center min-w-0 gap-[var(--gap-2xs,8px)]"
          style={{ cursor: canExpand ? 'pointer' : 'default' }}
          onMouseEnter={() => canExpand && setHeaderHovered(true)}
          onMouseLeave={() => setHeaderHovered(false)}
          onClick={() => canExpand && setIsOpen(v => !v)}
        >
          <span
            className="shrink-0 inline-flex"
            style={{
              color: iconColor,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease, color 0.15s ease',
              opacity: canExpand ? 1 : 0,
            }}
          >
            <Icon name="ic-chevron" size={24} />
          </span>

          <div className="shrink-0 w-[40px] h-[40px] rounded-[var(--round-s,12px)] overflow-hidden">
            {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover" />}
          </div>

          <p
            className="flex-1 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] line-clamp-2 text-left"
            style={{ color: nameColor, wordBreak: 'break-word', hyphens: 'auto' }}
            lang="ru"
          >
            {nameNode ?? name}
          </p>
        </button>

        {/* Правая часть: цена + тогл (версия 1) */}
        <div className="flex items-center shrink-0 gap-[var(--gap-2xs,8px)]">
          <AnimatedPrice
            value={unitTotal}
            className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[85px] text-right"
            style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
          />
          {!toggleLeft && (
            <Toggle
              checked={toggle}
              onChange={v => {
                if (v) handleToggleOn()
                setToggle(v)
              }}
            />
          )}
        </div>
      </div>

      {/* Контент — всегда смонтирован, AnimatedHeight управляет высотой */}
      <AnimatedHeight open={isOpen}>
        {scaledFlatMaterials ? (
          /* Прямые материалы — без вложенных секций */
          <div style={{ paddingTop: 'var(--gap-s, 16px)' }}>
            <MaterialsSection
              active={toggle}
              initialMaterials={scaledFlatMaterials}
              onTotalChange={v => setFlatTotal(v)}
              onMaterialClick={handleFlatMaterialClick}
              hideHeader
              noFill
            />
            <ItemPopup
              key={flatAnimKey}
              open={flatPopupData !== null}
              data={flatPopupData}
              onClose={() => setFlatPopupData(null)}
            />
          </div>
        ) : (
          /* Секции с WorkSection */
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
                active={toggle && (activeMap[i] ?? (s.initialActive ?? true))}
                resetVersion={resetVersion}
                toggleLeft={toggleLeft}
                canExpand={s.canExpand !== false}
                onToggle={v => {
                  setActiveMap(prev => {
                    const next = { ...prev, [i]: v }
                    // взаимоисключающие группы: включение одной выключает остальные
                    if (v) {
                      const group = sections[i].mutuallyExclusiveGroup
                      if (group) {
                        sections.forEach((sec, j) => {
                          if (j !== i && sec.mutuallyExclusiveGroup === group) next[j] = false
                        })
                      }
                    }
                    return next
                  })
                  if (v && !toggle) setToggle(true)
                }}
                onTotalChange={sectionTotalCallbacks.current[i]}
              />
            ))}
          </div>
        )}
      </AnimatedHeight>
    </div>
  )
}

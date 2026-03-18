import { useCallback, useEffect, useRef, useState } from 'react'
import { Toggle } from './Toggle'
import { WorkContainer, WorkEntry, WorkClickData } from './WorkContainer'
import { MaterialsSection } from './MaterialsSection'
import { MaterialEntry, MaterialClickData } from './Material'
import { AnimatedHeight } from './AnimatedHeight'
import { AnimatedPrice } from './AnimatedPrice'
import { ItemPopup, PopupData } from './ItemPopup'

type WorkSectionProps = {
  name?: string
  description?: string
  active?: boolean
  resetVersion?: number
  onToggle?: (v: boolean) => void
  onTotalChange?: (total: number) => void
  works?: WorkEntry[]
  materials?: MaterialEntry[]
}

export function WorkSection({
  name = 'Брендовая покраска',
  description = 'Нанесение износостойкой краски в 2 слоя',
  active = true,
  resetVersion,
  onToggle,
  onTotalChange,
  works = [{ workName: 'Сборка металлического каркаса', price: 12000 }],
  materials = [
    {
      materialText: 'Плитка керамическая 600х600 Kerama Marazzi тераццо светло серый',
      price: 500,
      quantity: 3,
    },
  ],
}: WorkSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [workActive, setWorkActive] = useState(true)
  const [materialsActive, setMaterialsActive] = useState(true)

  const [workSubTotal, setWorkSubTotal] = useState(() =>
    works.reduce((sum, w) => sum + w.price, 0)
  )
  const [materialsSubTotal, setMaterialsSubTotal] = useState(() =>
    materials.reduce((sum, m) => sum + m.price * m.quantity, 0)
  )

  const [popupData, setPopupData] = useState<PopupData>(null)

  const displayTotal =
    (workActive ? workSubTotal : 0) + (materialsActive ? materialsSubTotal : 0)

  const onTotalChangeRef = useRef(onTotalChange)
  onTotalChangeRef.current = onTotalChange

  // Задержка отправки total родителю: пока попап открыт — буферизуем,
  // после закрытия — отправляем через 450 мс (после анимации скрытия попапа).
  const popupWasOpenRef = useRef(false)
  const pendingTotalRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (popupData !== null) {
      popupWasOpenRef.current = true
    } else if (popupWasOpenRef.current) {
      popupWasOpenRef.current = false
      const pending = pendingTotalRef.current
      pendingTotalRef.current = null
      if (pending !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          onTotalChangeRef.current?.(pending)
        }, 450)
      }
    }
  }, [popupData])

  useEffect(() => {
    if (popupWasOpenRef.current) {
      // Попап открыт — сохраняем последнее значение, не отправляем
      pendingTotalRef.current = displayTotal
    } else {
      clearTimeout(timerRef.current)
      onTotalChangeRef.current?.(displayTotal)
    }
  }, [displayTotal])

  const nameColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const priceColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'

  const borderColor = isOpen || hovered
    ? 'var(--grey-150, #e0e0e0)'
    : !active
    ? 'var(--grey-100, #ebebeb)'
    : 'transparent'

  const prevResetVersion = useRef(resetVersion ?? 0)
  useEffect(() => {
    if (resetVersion !== undefined && resetVersion !== prevResetVersion.current) {
      setWorkActive(true)
      setMaterialsActive(true)
    }
    prevResetVersion.current = resetVersion ?? 0
  }, [resetVersion])

  const handleWorkToggle = (v: boolean) => {
    setWorkActive(v)
    if (!v && !materialsActive) onToggle?.(false)
    else if (v && !active) onToggle?.(true)
  }
  const handleMaterialsToggle = (v: boolean) => {
    setMaterialsActive(v)
    if (!v && !workActive) onToggle?.(false)
    else if (v && !active) onToggle?.(true)
  }

  const handleWorkTotalChange = useCallback((total: number) => setWorkSubTotal(total), [])
  const handleMaterialsTotalChange = useCallback(
    (total: number) => setMaterialsSubTotal(total),
    []
  )

  const handleWorkClick = useCallback((data: WorkClickData) => {
    setPopupData({
      name: data.name,
      price: data.price,
      included: data.active,
      gender: 'f',
      description: 'Какое-то описание',
      onIncludedChange: (v) => {
        setPopupData(prev => prev ? { ...prev, included: v } : null)
        data.onActiveChange(v)
      },
    })
  }, [])

  const handleMaterialClick = useCallback((data: MaterialClickData) => {
    setPopupData({
      name: data.name,
      price: data.price,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      included: data.active,
      gender: 'm',
      description: 'Какое-то описание',
      onQuantityChange: (qty) => {
        setPopupData(prev => prev ? { ...prev, quantity: qty, price: (prev.unitPrice ?? 0) * qty } : null)
        data.onQuantityChange(qty)
      },
      onIncludedChange: (v) => {
        setPopupData(prev => prev ? { ...prev, included: v } : null)
        data.onActiveChange(v)
      },
    })
  }, [])

  const headerBg = 'var(--grey-50, #f5f5f5)'

  const header = (
    <div className="flex flex-col gap-[var(--gap-2xs,8px)] px-[var(--pad-s,16px)] py-[var(--gap-s,16px)] w-full" style={{ backgroundColor: headerBg }}>
      <div className="flex items-start justify-between w-full gap-[var(--gap-2xs,8px)]">
        <p
          className="flex-1 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] line-clamp-2"
          style={{ color: nameColor }}
        >
          {name}
        </p>
        <div
          className="flex items-center gap-[var(--gap-3xs,4px)] shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <AnimatedPrice
            value={displayTotal}
            className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[85px] text-right"
            style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" } as React.CSSProperties}
          />
          <Toggle checked={active} onChange={v => onToggle?.(v)} />
        </div>
      </div>
      <p
        className="font-inter font-normal text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)]"
        style={{ color: 'var(--grey-500, #999999)' }}
      >
        {description}
      </p>
    </div>
  )

  return (
    <div
      className="w-full rounded-[var(--round-m,16px)] overflow-hidden bg-[var(--grey-50,#f5f5f5)] relative"
      style={{
        border: `2px solid ${borderColor}`,
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-full text-left cursor-pointer"
      >
        {header}
      </button>

      <AnimatedHeight open={isOpen}>
        <WorkContainer
          active={active && workActive}
          onToggle={handleWorkToggle}
          onTotalChange={handleWorkTotalChange}
          works={works}
          onWorkClick={handleWorkClick}
        />
        <div className="h-px bg-[var(--grey-150,#e0e0e0)] w-full" />
        <MaterialsSection
          active={active && materialsActive}
          onToggle={handleMaterialsToggle}
          onTotalChange={handleMaterialsTotalChange}
          initialMaterials={materials}
          onMaterialClick={handleMaterialClick}
        />
      </AnimatedHeight>

      <ItemPopup
        open={popupData !== null}
        data={popupData}
        onClose={() => setPopupData(null)}
      />
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { Toggle } from './Toggle'
import { Material, MaterialEntry, MaterialClickData } from './Material'
import { AnimatedPrice } from './AnimatedPrice'

type InternalMaterialEntry = MaterialEntry & { itemActive: boolean }

type MaterialsSectionProps = {
  active?: boolean
  onToggle?: (v: boolean) => void
  initialMaterials?: MaterialEntry[]
  onTotalChange?: (total: number) => void
  onMaterialClick?: (data: MaterialClickData) => void
  hideHeader?: boolean
  noFill?: boolean
  toggleLeft?: boolean
}

/** Секция «Материалы» с тоглом и списком позиций. */
export function MaterialsSection({
  active = true,
  onToggle,
  initialMaterials = [
    {
      materialText: 'Плитка керамическая 600х600 Kerama Marazzi тераццо светло серый',
      price: 500,
      quantity: 3,
    },
  ],
  onTotalChange,
  onMaterialClick,
  hideHeader = false,
  noFill = false,
  toggleLeft = false,
}: MaterialsSectionProps) {
  const [items, setItems] = useState<InternalMaterialEntry[]>(() =>
    initialMaterials.map(m => ({ ...m, itemActive: true }))
  )

  const prevInitialRef = useRef(initialMaterials)
  useEffect(() => {
    if (prevInitialRef.current !== initialMaterials) {
      prevInitialRef.current = initialMaterials
      setItems(initialMaterials.map(m => ({ ...m, itemActive: true })))
    }
  }, [initialMaterials])

  const subTotal = items.reduce((sum, m) => sum + (m.itemActive ? m.price * m.quantity : 0), 0)

  const onTotalChangeRef = useRef(onTotalChange)
  onTotalChangeRef.current = onTotalChange

  useEffect(() => {
    onTotalChangeRef.current?.(subTotal)
  }, [subTotal])

  const titleColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const priceColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'

  const handleQtyChange = (idx: number, qty: number) => {
    setItems(prev => prev.map((m, i) => (i === idx ? { ...m, quantity: qty } : m)))
  }

  const handleItemActiveChange = useCallback((idx: number, v: boolean) => {
    setItems(prev => prev.map((m, i) => i === idx ? { ...m, itemActive: v } : m))
  }, [])

  return (
    <div
      className="flex flex-col gap-[24px] px-[var(--pad-s,16px)] py-[var(--gap-s,16px)] w-full"
      style={{ backgroundColor: noFill ? 'transparent' : !active ? 'var(--grey-100, #ebebeb)' : 'var(--grey-0, white)' }}
    >
      {/* Заголовок */}
      {!hideHeader && (
        <div className="sub-header-row flex items-center w-full gap-[var(--gap-2xs,8px)]">
          {toggleLeft && <Toggle checked={active} onChange={v => onToggle?.(v)} />}
          <p
            className="flex-1 font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] truncate"
            style={{ color: titleColor }}
          >
            Материалы
          </p>
          <div
            className="flex items-center gap-[var(--gap-2xs,8px)] shrink-0 cursor-pointer"
            onClick={() => onToggle?.(!active)}
          >
            <AnimatedPrice
              value={subTotal}
              className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[85px] text-right"
              style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
            />
            {!toggleLeft && <Toggle checked={active} onChange={v => onToggle?.(v)} />}
          </div>
        </div>
      )}

      {/* Список материалов */}
      <div className="flex flex-col gap-[var(--gap-xs,12px)] w-full">
        {items.map((m, i) => (
          <Material
            key={i}
            {...m}
            active={active && m.itemActive}
            onQuantityChange={qty => handleQtyChange(i, qty)}
            onPopupClick={() => onMaterialClick?.({
              name: m.materialText,
              price: m.price * m.quantity,
              unitPrice: m.price,
              quantity: m.quantity,
              active: active && m.itemActive,
              description: m.description,
              onActiveChange: (v) => handleItemActiveChange(i, v),
              onQuantityChange: (qty) => handleQtyChange(i, qty),
            })}
          />
        ))}
      </div>
    </div>
  )
}

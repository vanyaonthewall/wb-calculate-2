import { useEffect, useRef, useState } from 'react'
import { Toggle } from './Toggle'
import { Material, MaterialEntry } from './Material'
import { AnimatedPrice } from './AnimatedPrice'

type MaterialsSectionProps = {
  active?: boolean
  onToggle?: (v: boolean) => void
  initialMaterials?: MaterialEntry[]
  onTotalChange?: (total: number) => void
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
}: MaterialsSectionProps) {
  const [items, setItems] = useState<MaterialEntry[]>(initialMaterials)

  const subTotal = items.reduce((sum, m) => sum + m.price * m.quantity, 0)

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

  return (
    <div
      className="flex flex-col gap-[var(--gap-s,16px)] px-[var(--pad-s,16px)] py-[var(--gap-s,16px)] w-full"
      style={{ backgroundColor: active ? 'var(--grey-0, white)' : 'var(--grey-100, #ebebeb)' }}
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between w-full">
        <p
          className="flex-1 font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] truncate"
          style={{ color: titleColor }}
        >
          Материалы
        </p>
        <div className="flex items-center gap-[var(--gap-2xs,8px)] shrink-0">
          <AnimatedPrice
            value={subTotal}
            className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[85px] text-right"
            style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
          />
          <Toggle checked={active} onChange={v => onToggle?.(v)} />
        </div>
      </div>

      {/* Список материалов */}
      <div className="flex flex-col gap-[var(--gap-xs,12px)] w-full">
        {items.map((m, i) => (
          <Material
            key={i}
            {...m}
            active={active}
            onQuantityChange={qty => handleQtyChange(i, qty)}
          />
        ))}
      </div>
    </div>
  )
}

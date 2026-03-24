import { useEffect, useRef, useState } from 'react'
import { IcControl } from './IcControl'
import { AnimatedPrice, AnimatedNumber } from './AnimatedPrice'

export type MaterialEntry = {
  materialText: string
  imageUrl?: string
  price: number
  quantity: number
  description?: string
}

export type MaterialClickData = {
  name: string
  price: number
  unitPrice: number
  quantity: number
  active: boolean
  description?: string
  onActiveChange: (v: boolean) => void
  onQuantityChange: (qty: number) => void
}

type MaterialProps = MaterialEntry & {
  active?: boolean
  onQuantityChange?: (qty: number) => void
  onPopupClick?: () => void
}

/** Строка материала: фото, название, цена, счётчик количества. */
export function Material({
  materialText = 'Плитка керамическая 600х600 Kerama Marazzi тераццо светло серый',
  imageUrl,
  price = 500,
  quantity = 3,
  active = true,
  onQuantityChange,
  onPopupClick,
}: MaterialProps) {
  const [qtyHighlighted, setQtyHighlighted] = useState(false)
  const [leftHovered, setLeftHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const highlightQty = () => {
    if (!active) return
    setQtyHighlighted(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setQtyHighlighted(false), 1500)
  }

  const textColor  = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const priceColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const qtyColor   = active
    ? qtyHighlighted ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
    : 'var(--grey-400, #adadad)'

  return (
    <div className="flex items-start gap-[var(--gap-2xs,8px)] pb-[var(--pad-s,16px)] border-b border-[var(--grey-150,#e0e0e0)] w-full last:border-b-0 last:pb-0">

      {/* Левая часть: картинка + название — кликабельная */}
      <button
        className="flex flex-1 items-start gap-[var(--gap-2xs,8px)] min-w-0 text-left cursor-pointer"
        onMouseEnter={() => setLeftHovered(true)}
        onMouseLeave={() => setLeftHovered(false)}
        onClick={() => onPopupClick?.()}
      >
        <div
          className="shrink-0 w-[72px] h-[72px] rounded-[var(--round-s,12px)] overflow-hidden transition-colors flex items-center justify-center"
          style={{ backgroundColor: leftHovered && active ? 'var(--grey-300, #c2c2c2)' : 'var(--grey-150, #e0e0e0)' }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={materialText} className="w-full h-full object-cover" />
          ) : (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="5" width="22" height="18" rx="2" stroke="var(--grey-400,#adadad)" strokeWidth="1.5" fill="none"/>
              <circle cx="9" cy="11" r="2" fill="var(--grey-400,#adadad)"/>
              <path d="M3 19l6-5 4 4 3-3 6 6" stroke="var(--grey-400,#adadad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <p
            className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] line-clamp-3"
            style={{ color: textColor }}
          >
            {materialText}
          </p>
        </div>
      </button>

      {/* Цена + счётчик */}
      <div className="flex flex-col items-end gap-[var(--gap-2xs,8px)] shrink-0 self-stretch">
        <AnimatedPrice
          value={price}
          className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] whitespace-nowrap"
          style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
        />
        <div className="flex items-center gap-[var(--gap-3xs,4px)]">
          <IcControl
            icon="ic-minus"
            color="grey"
            size="s"
            state={active ? 'default' : 'disable'}
            onClick={() => { onQuantityChange?.(Math.max(0, quantity - 1)); highlightQty() }}
          />
          <AnimatedNumber
            value={quantity}
            className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[24px] text-center"
            style={{ color: qtyColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
          />
          <IcControl
            icon="ic-plus"
            color="grey"
            size="s"
            state={active ? 'default' : 'disable'}
            onClick={() => { onQuantityChange?.(quantity + 1); highlightQty() }}
          />
        </div>
      </div>
    </div>
  )
}

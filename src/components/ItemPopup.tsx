import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Toggle } from './Toggle'
import { Ic } from './Ic'
import { IcControl } from './IcControl'
import { AnimatedNumber } from './AnimatedPrice'
import { formatPrice } from '../utils'

export type PopupData = {
  name: string
  price: number
  included: boolean
  gender: 'f' | 'm'
  description?: string
  unitPrice?: number
  quantity?: number
  showDownload?: boolean
  onQuantityChange?: (qty: number) => void
  onIncludedChange: (v: boolean) => void
} | null

type ItemPopupProps = {
  open: boolean
  data: PopupData
  onClose: () => void
}

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

/** Попап с деталями работы или материала. Выезжает справа с вращением карточки. */
export function ItemPopup({ open, data, onClose }: ItemPopupProps) {
  const lastData = useRef(data)
  if (data) lastData.current = data
  const d = lastData.current

  // Отдельное состояние для анимации — даёт браузеру кадр на монтаж перед запуском перехода
  const [animOpen, setAnimOpen] = useState(false)
  const rafRef = useRef<number>()

  useEffect(() => {
    cancelAnimationFrame(rafRef.current!)
    if (open) {
      // Двойной rAF: первый — монтаж, второй — запуск transition
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setAnimOpen(true))
      })
    } else {
      setAnimOpen(false)
    }
    return () => cancelAnimationFrame(rafRef.current!)
  }, [open])

  if (!d) return null

  const { name, price, included, description, unitPrice, quantity, showDownload, onQuantityChange, onIncludedChange } = d

  const toggleLabel = 'Включена в стоимость'

  const hasMaterialQty = unitPrice !== undefined && quantity !== undefined

  const target = document.getElementById('calc-overlay-target') ?? document.body

  return createPortal(
    <div
      className="fixed inset-0 min-[700px]:inset-y-0 min-[700px]:left-auto min-[700px]:right-0 min-[700px]:w-[420px] z-50 bg-[var(--grey-0,white)] flex flex-col gap-[var(--gap-m,32px)] pt-[var(--pad-m,24px)] px-[var(--pad-m,24px)] overflow-y-auto"
      style={{
        transform: animOpen
          ? 'translateX(0) rotate(0deg)'
          : 'translateX(calc(100% + 100px)) rotate(10deg)',
        opacity: animOpen ? 1 : 0,
        transformOrigin: 'center center',
        transition: `transform 0.4s ${EASE}, opacity 0.4s ${EASE}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
      }}
    >
      {/* Шапка */}
      <div className="shrink-0 flex flex-col gap-[var(--gap-s,16px)]">

        {/* Заголовок + закрытие */}
        <div className="flex items-start">
          <p className="flex-1 font-inter font-bold text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] overflow-hidden">
            {name}
          </p>
          <button onClick={onClose} className="cursor-pointer shrink-0 pt-[var(--inset-xs,4px)]">
            <Ic icon="ic-close" />
          </button>
        </div>

        {/* Тогл */}
        <div
          className="flex items-center gap-[var(--gap-xs,12px)] p-[var(--gap-s,16px)] rounded-[var(--round-m,16px)] border-2 bg-[var(--grey-0,white)] cursor-pointer"
          style={{ borderColor: 'var(--grey-150, #e0e0e0)' }}
          onClick={() => onIncludedChange(!included)}
        >
          <Toggle checked={included} onChange={onIncludedChange} />
          <p className="flex-1 font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap">
            {toggleLabel}
          </p>
        </div>
      </div>

      {/* Контент — скроллится */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {description && (
          <p
            className="font-inter font-normal text-[16px] text-[color:var(--grey-850,#313131)] w-full"
            style={{ lineHeight: '1.4', letterSpacing: '-0.48px' }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Нижняя секция */}
      <div
        className="shrink-0 flex flex-col gap-[var(--gap-s,16px)]"
        style={{ paddingBottom: 'max(var(--pad-m, 24px), calc(var(--pad-m, 24px) + env(safe-area-inset-bottom, 0px)))' }}
      >
        <div className="flex items-end justify-between w-full">

        {/* Левая — количество (только материал) */}
        {hasMaterialQty ? (
          <div className="flex items-center gap-[var(--gap-2xs,8px)]">
            <IcControl
              icon="ic-minus"
              color="grey"
              size="s"
              onClick={() => onQuantityChange?.(Math.max(0, quantity! - 1))}
            />
            <AnimatedNumber
              value={quantity!}
              className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[24px] text-center text-[color:var(--grey-850,#313131)]"
              style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
            />
            <IcControl
              icon="ic-plus"
              color="grey"
              size="s"
              onClick={() => onQuantityChange?.(quantity! + 1)}
            />
          </div>
        ) : <div />}

        {/* Правая — цена */}
        <div className="flex flex-col gap-[var(--gap-3xs,4px)] items-end">
          {hasMaterialQty && (
            <p className="font-inter font-normal text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)] text-[color:var(--grey-500,#999999)] whitespace-nowrap">
              {formatPrice(unitPrice!)}/шт.
            </p>
          )}
          <p
            className="font-inter font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap"
            style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
          >
            {formatPrice(price)}
          </p>
        </div>
        </div>

        {/* Кнопка скачать чертёж */}
        {showDownload && (
          <button className="w-full bg-[var(--grey-850,#313131)] text-[color:var(--grey-0,#ffffff)] font-inter font-bold text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] py-[var(--inset-xl,24px)] rounded-[var(--round-s,12px)] cursor-pointer text-center">
            Скачать чертёж
          </button>
        )}
      </div>
    </div>,
    target
  )
}

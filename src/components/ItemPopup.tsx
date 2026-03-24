import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Toggle } from './Toggle'
import { Ic } from './Ic'
import { IcControl } from './IcControl'
import { AnimatedNumber, AnimatedPrice } from './AnimatedPrice'

export type PopupData = {
  name: string
  price: number
  included: boolean
  gender: 'f' | 'm' | 'n'
  description?: string
  specs?: Array<{ label: string; value: string }>
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

const PLACEHOLDER_SVG = (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="9" width="38" height="30" rx="3" stroke="var(--grey-300,#c2c2c2)" strokeWidth="2" fill="none"/>
    <circle cx="15" cy="19" r="4" fill="var(--grey-300,#c2c2c2)"/>
    <path d="M5 33l10-9 7 7 5-5 11 10" stroke="var(--grey-300,#c2c2c2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/** Попап с деталями работы или материала. Выезжает справа с вращением. */
export function ItemPopup({ open, data, onClose }: ItemPopupProps) {
  // Сохраняем последние данные — нужны во время анимации закрытия
  const lastData = useRef(data)
  if (data) lastData.current = data
  const d = lastData.current

  // Анимация открытия/закрытия через transition
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

  // Блокировка скролла страницы пока попап открыт (только мобиле)
  useEffect(() => {
    if (!data) return
    if (window.matchMedia('(min-width: 700px)').matches) return
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [!!data]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!d) return null

  const { name, gender, included, description, specs, unitPrice, quantity, showDownload, onQuantityChange, onIncludedChange } = d
  const includedLabel = gender === 'f' ? 'Включена в стоимость' : gender === 'n' ? 'Включено в стоимость' : 'Включён в стоимость'
  const hasMaterialQty = unitPrice !== undefined && quantity !== undefined

  const target = document.getElementById('calc-overlay-target') ?? document.body

  return createPortal(
    <div
      className="fixed inset-0 min-[700px]:inset-y-0 min-[700px]:left-auto min-[700px]:right-0 min-[700px]:w-[420px] bg-[var(--grey-0,white)] flex flex-col overflow-hidden"
      style={{
        transform: animOpen
          ? 'translateX(0) rotate(0deg)'
          : 'translateX(calc(100% + 100px)) rotate(10deg)',
        opacity: animOpen ? 1 : 0,
        transformOrigin: 'center center',
        transition: `transform 0.4s ${EASE}, opacity 0.4s ${EASE}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        zIndex: 51,
      }}
    >
      {/* Шапка — фиксирована, учитывает safe area сверху */}
      <div
        className="shrink-0 flex flex-col gap-[var(--gap-s,16px)] px-[var(--pad-m,24px)]"
        style={{ paddingTop: 'max(var(--pad-m, 24px), calc(env(safe-area-inset-top, 0px) + var(--pad-m, 24px)))' }}
      >
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
            {includedLabel}
          </p>
        </div>
      </div>

      {/* Скролл-зона: галерея + текст */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-[var(--gap-m,32px)] px-[var(--pad-m,24px)] py-[var(--gap-m,32px)]"
        style={{ overscrollBehavior: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {/* Галерея */}
        <div
          className="shrink-0 flex gap-[var(--gap-xs,12px)] overflow-x-auto no-scrollbar"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="shrink-0 rounded-[var(--round-m,16px)] overflow-hidden flex items-center justify-center"
              style={{
                width: 'calc(100% - 48px)',
                aspectRatio: '1 / 1',
                backgroundColor: 'var(--grey-100, #ebebeb)',
                scrollSnapAlign: 'start',
              }}
            >
              {PLACEHOLDER_SVG}
            </div>
          ))}
        </div>

        {/* Текст */}
        {(description || (specs && specs.length > 0)) && (
          <div className="flex flex-col gap-[var(--gap-s,16px)]">
            {description && (
              <p
                className="font-inter font-normal text-[16px] text-[color:var(--grey-850,#313131)] w-full"
                style={{ lineHeight: '1.4', letterSpacing: '-0.48px', whiteSpace: 'pre-line' }}
              >
                {description}
              </p>
            )}
            {specs && specs.length > 0 && (
              <div className="flex flex-col gap-[var(--gap-3xs,4px)]">
                {specs.map(({ label, value }) => (
                  <div key={label} className="flex items-baseline gap-[var(--gap-2xs,8px)]">
                    <span
                      className="font-inter font-normal text-[14px] leading-[20px] shrink-0"
                      style={{ color: 'var(--grey-500, #999999)' }}
                    >
                      {label}
                    </span>
                    <span className="font-inter font-normal text-[14px] leading-[20px] text-[color:var(--grey-850,#313131)]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Нижняя секция — фиксирована, учитывает safe area снизу */}
      <div
        className="shrink-0 flex flex-col gap-[var(--gap-s,16px)] px-[var(--pad-m,24px)]"
        style={{ paddingBottom: 'max(var(--pad-m, 24px), calc(env(safe-area-inset-bottom, 0px) + var(--pad-m, 24px)))' }}
      >
        <div className="flex items-end gap-[var(--gap-2xs,8px)]">
          {hasMaterialQty && (
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
          )}
          <div className="flex flex-col items-end flex-1">
            {hasMaterialQty && (
              <span
                className="font-inter font-normal text-[14px] leading-[20px]"
                style={{ color: 'var(--grey-500, #999999)' }}
              >
                <AnimatedNumber
                  value={unitPrice!}
                  className="font-inter font-normal text-[14px] leading-[20px]"
                  style={{ color: 'var(--grey-500, #999999)', fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                /> ₽/шт.
              </span>
            )}
            <AnimatedPrice
              value={d.price}
              className="font-inter font-bold text-[length:var(--f-size-xl,32px)] leading-[var(--f-lh-xl,40px)] text-[color:var(--grey-850,#313131)]"
              style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
            />
          </div>
        </div>

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

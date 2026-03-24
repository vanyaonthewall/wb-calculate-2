import { createPortal } from 'react-dom'
import { Toggle } from './Toggle'
import { Ic } from './Ic'
import { IcControl } from './IcControl'
import { AnimatedNumber, AnimatedPrice } from './AnimatedPrice'

export type PopupData = {
  name: string
  price: number
  included: boolean
  gender: 'f' | 'm'
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

/** Попап с деталями работы или материала. Выезжает справа с вращением. */
export function ItemPopup({ data, onClose }: ItemPopupProps) {
  if (!data) return null

  const { name, included, description, specs, unitPrice, quantity, showDownload, onQuantityChange, onIncludedChange } = data

  const hasMaterialQty = unitPrice !== undefined && quantity !== undefined
  const hasBottomSection = true

  const target = document.getElementById('calc-overlay-target') ?? document.body

  return createPortal(
    <div
      className="fixed inset-0 min-[700px]:inset-y-0 min-[700px]:left-auto min-[700px]:right-0 min-[700px]:w-[420px] bg-[var(--grey-0,white)] flex flex-col gap-[var(--gap-m,32px)] pt-[var(--pad-m,24px)] px-[var(--pad-m,24px)] overflow-y-auto"
      style={{
        animationName: 'popup-slide-in',
        animationDuration: '0.4s',
        animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        animationFillMode: 'both',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        zIndex: 51,
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
            Включена в стоимость
          </p>
        </div>
      </div>

      {/* Галерея фото — горизонтальный скролл */}
      <div
        className="shrink-0 flex gap-[var(--gap-xs,12px)] overflow-x-auto"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="9" width="38" height="30" rx="3" stroke="var(--grey-300,#c2c2c2)" strokeWidth="2" fill="none"/>
              <circle cx="15" cy="19" r="4" fill="var(--grey-300,#c2c2c2)"/>
              <path d="M5 33l10-9 7 7 5-5 11 10" stroke="var(--grey-300,#c2c2c2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Контент — скроллится */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-[var(--gap-s,16px)]">
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

      {/* Нижняя секция — только количество и/или кнопка скачать */}
      {hasBottomSection && (
        <div
          className="shrink-0 flex flex-col gap-[var(--gap-s,16px)]"
          style={{ paddingBottom: 'max(var(--pad-m, 24px), calc(var(--pad-m, 24px) + env(safe-area-inset-bottom, 0px)))' }}
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
                value={data.price}
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
      )}
    </div>,
    target
  )
}

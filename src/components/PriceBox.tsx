import { useEffect, useState } from 'react'
import { AnimatedHeight } from './AnimatedHeight'
import { AnimatedNumber, AnimatedPrice } from './AnimatedPrice'
import { IcControl } from './IcControl'
import { Chip } from './Chip'
import wallImg from '../img/picture=wall.png'
import sofaImg from '../img/picture=sofa.png'
import lumaImg from '../img/picture=luma.png'
import cameraImg from '../img/picture=camera.png'
import coinsImg from '../img/picture=coins.png'
import toiletImg from '../img/picture=toilet.png'

export type PriceRow = {
  name: string
  imageUrl: string
  value: number
}

type PriceBoxProps = {
  rows?: PriceRow[]
  total?: number
  chipText?: string
  ctaText?: string
  showCta?: boolean
  showBtBack?: boolean
  showList?: boolean
  page?: '1st' | '2nd-3rd'
  onCtaClick?: () => void
  onBackClick?: () => void
}

const DEFAULT_ROWS: PriceRow[] = [
  { name: 'Стены, полы, потолок', imageUrl: wallImg,   value: 70000 },
  { name: 'Электрика и свет',  imageUrl: lumaImg,   value: 30000 },
  { name: 'Безопасность и IT',   imageUrl: cameraImg, value: 20000 },
  { name: 'Санузел',           imageUrl: toiletImg, value: 36000 },
  { name: 'Мебель WB',         imageUrl: sofaImg,   value: 20000 },
  { name: 'Резерв 12%',        imageUrl: coinsImg,  value: 24000 },
]

export function PriceBox({
  rows = DEFAULT_ROWS,
  total,
  chipText = 'включены материалы и работы',
  ctaText = 'Рассчитать стоимость',
  showCta = true,
  showBtBack = false,
  showList = true,
  page = '1st',
  onCtaClick,
  onBackClick,
}: PriceBoxProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Закрываем список при скрытии кнопки (переход на шаг 3)
  useEffect(() => {
    if (!showList) setIsOpen(false)
  }, [showList])

  const computedTotal = total ?? rows.reduce((sum, r) => sum + r.value, 0)

  // При 7+ знаках (≥ 1 000 000) уменьшаем шрифт на одну ступень
  const isLarge = computedTotal >= 1_000_000
  const numClass    = isLarge
    ? 'text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)]'
    : 'text-[length:var(--f-size-2xl,44px)] leading-[var(--f-lh-xl,48px)]'
  const currClass   = isLarge
    ? 'text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)]'
    : 'text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)]'

  const inner = (
    // flex-col-reverse: нижняя секция — первая в DOM → остаётся снизу;
    // AnimatedHeight — вторая в DOM → раскрывается вверх над нижней секцией
    // overflow-hidden убран: вызывал GPU-compositing артефакты с белыми углами
    <div
      className={
        'flex flex-col-reverse rounded-[var(--round-l,24px)] w-full ' +
        (page === '2nd-3rd' ? 'bg-[var(--grey-0,white)]' : 'bg-[var(--grey-50,#f5f5f5)]')
      }
      style={page === '2nd-3rd' ? { boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' } : undefined}
    >

      {/* Нижняя секция — всегда видима, в col-reverse отображается снизу */}
      <div className="flex flex-col">

        {/* Итоговая цена + кнопка списка */}
        <div className="flex items-center justify-between p-[var(--pad-m,24px)]">
          {showList && (
            <IcControl
              icon="ic-list"
              color="secondary"
              size="m"
              state={isOpen ? 'active' : 'default'}
              onClick={() => setIsOpen(v => !v)}
            />
          )}
          <div className={'flex items-center gap-[var(--gap-3xs,4px)] font-[\'Unbounded\',sans-serif] font-semibold text-[color:var(--grey-850,#313131)] whitespace-nowrap' + (!showList ? ' flex-1 justify-end' : '')}>
            <span
              className={numClass}
              style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
            >
              ~<AnimatedNumber value={computedTotal} />
            </span>
            <span className={currClass}>₽</span>
          </div>
        </div>

        {/* CTA */}
        {showCta && (
          <div className="flex gap-[var(--gap-2xs,8px)] pb-[var(--pad-m,24px)] px-[var(--pad-m,24px)]">
            {showBtBack && (
              <IcControl icon="ic-back" color="grey" size="l" onClick={onBackClick} />
            )}
            <button
              onClick={onCtaClick}
              className="flex-1 bg-[var(--grey-850,#313131)] text-[color:var(--grey-0,#ffffff)] font-['Unbounded',sans-serif] font-bold text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] py-[var(--inset-xl,24px)] rounded-[var(--round-s,12px)] cursor-pointer whitespace-nowrap text-center"
            >
              {ctaText}
            </button>
          </div>
        )}

      </div>

      {/* Список разделов — в col-reverse отображается выше нижней секции, раскрывается вверх */}
      <AnimatedHeight open={isOpen}>
        <div className="flex flex-col">

          {/* Шапка */}
          <div className="flex items-center justify-between pb-[var(--gap-s,16px)] pt-[var(--pad-m,24px)] px-[var(--pad-m,24px)]">
            <p className="font-['Unbounded',sans-serif] font-bold text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap">
              Расчет
            </p>
            <Chip size="s" color="secondary" interactive={false}>{chipText}</Chip>
          </div>

          {/* Строки цен */}
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between pl-[var(--inset-xl,24px)] pr-[var(--pad-m,24px)] py-[var(--inset-m,12px)] price-row-dots"
            >
              <div className="flex items-center gap-[var(--gap-xs,12px)] shrink-0">
                <div className="shrink-0 w-[32px] h-[32px] rounded-[var(--round-xs,10px)] overflow-hidden">
                  <img src={row.imageUrl} alt={row.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-600,#7b7b7b)] whitespace-nowrap">
                  {row.name}
                </p>
              </div>
              <AnimatedPrice
                value={row.value}
                className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap"
                style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
              />
            </div>
          ))}

        </div>
      </AnimatedHeight>

    </div>
  )

  return inner
}

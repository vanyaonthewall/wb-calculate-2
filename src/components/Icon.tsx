import icPlus from '../icons/ic-plus.svg'
import icMinus from '../icons/ic-minus.svg'
import icClose from '../icons/ic-close.svg'
import icPencil from '../icons/ic-pencil.svg'
import icQuestion from '../icons/ic-question.svg'
import icList from '../icons/ic-list.svg'
import icChevron from '../icons/ic-chevron.svg'
import icBack from '../icons/ic-back.svg'
import icLink from '../icons/ic-link.svg'

const ICON_MAP = {
  'ic-plus': icPlus,
  'ic-minus': icMinus,
  'ic-close': icClose,
  'ic-pencil': icPencil,
  'ic-question': icQuestion,
  'ic-list': icList,
  'ic-chevron': icChevron,
  'ic-back': icBack,
  'ic-link': icLink,
} as const

export type IconName = keyof typeof ICON_MAP

type IconProps = {
  name: IconName
  size?: number
  className?: string
}

/** Renders a monochrome SVG icon using CSS mask-image.
 *  Color is controlled by the CSS `color` property (currentColor). */
export function Icon({ name, size = 24, className }: IconProps) {
  const url = ICON_MAP[name]
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  )
}

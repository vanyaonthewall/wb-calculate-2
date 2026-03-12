import { ButtonHTMLAttributes, CSSProperties, useState } from 'react'
import { Icon, IconName } from './Icon'

type IcControlProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconName
  color?: 'grey' | 'secondary'
  size?: 's' | 'm' | 'l'
  state?: 'default' | 'hover' | 'active' | 'disable'
}

const PADDING: Record<NonNullable<IcControlProps['size']>, string> = {
  s: 'p-[var(--inset-s,8px)]',
  m: 'p-[var(--inset-m,12px)]',
  l: 'p-[var(--inset-xl,24px)]',
}

const RADIUS: Record<NonNullable<IcControlProps['size']>, string> = {
  s: 'rounded-[var(--round-xs,10px)]',
  m: 'rounded-[var(--round-xs,10px)]',
  l: 'rounded-[var(--round-m,16px)]',
}

function getBgValue(color: 'grey' | 'secondary', state: string): string {
  if (state === 'active') {
    return color === 'secondary'
      ? 'var(--purple-500, #9744eb)'
      : 'var(--grey-850, #313131)'
  }
  if (state === 'hover') {
    return color === 'secondary'
      ? 'var(--secondary-purple-600, #dfc6f9)'
      : 'var(--grey-150, #e0e0e0)'
  }
  if (state === 'disable') {
    return color === 'secondary'
      ? 'var(--secondary-purple-500, #eadafb)'
      : 'var(--grey-150, #e0e0e0)'
  }
  // default
  return color === 'secondary'
    ? 'var(--secondary-purple-500, #eadafb)'
    : 'var(--grey-100, #ebebeb)'
}

function getIconColorValue(color: 'grey' | 'secondary', state: string): string {
  if (state === 'active')  return 'var(--grey-0, #ffffff)'
  if (state === 'disable') return color === 'secondary'
    ? 'rgba(151, 68, 235, 0.4)'
    : 'var(--grey-300, #c2c2c2)'
  if (color === 'secondary') return 'var(--purple-500, #9744eb)'
  if (state === 'hover') return 'var(--grey-600, #7b7b7b)'
  return 'var(--grey-500, #999999)'
}

/** Иконочная кнопка с фоном. Поддерживает 3 размера, 2 цвета, 4 состояния.
 *  Для grey/default автоматически отслеживает hover/press через mouse-события. */
export function IcControl({
  icon = 'ic-minus',
  color = 'grey',
  size = 'm',
  state = 'default',
  className,
  style,
  disabled,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...props
}: IcControlProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const isDisabled = state === 'disable' || disabled

  // active/disable управляются извне; для default — hover/press отслеживаем внутри
  const effectiveState = (state === 'active' || state === 'disable')
    ? state
    : pressed ? 'default' : hovered ? 'hover' : 'default'

  const dynamicStyle: CSSProperties = {
    backgroundColor: getBgValue(color, effectiveState),
    color: getIconColorValue(color, effectiveState),
    ...style,
  }

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={dynamicStyle}
      onMouseEnter={e => { setHovered(true); onMouseEnter?.(e) }}
      onMouseLeave={e => { setHovered(false); setPressed(false); onMouseLeave?.(e) }}
      onMouseDown={e => { setPressed(true); onMouseDown?.(e) }}
      onMouseUp={e => { setPressed(false); onMouseUp?.(e) }}
      className={
        className ??
        'inline-flex items-center justify-center ' +
        PADDING[size] + ' ' +
        RADIUS[size] + ' ' +
        (isDisabled ? 'cursor-not-allowed' : 'cursor-pointer')
      }
    >
      <Icon name={icon} size={24} />
    </button>
  )
}

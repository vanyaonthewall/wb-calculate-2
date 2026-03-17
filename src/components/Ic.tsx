import { useState } from 'react'
import { Icon, IconName } from './Icon'

type IcProps = {
  icon?: IconName
  state?: 'default' | 'hover' | 'active'
  size?: number
  className?: string
}

const STATE_COLOR: Record<NonNullable<IcProps['state']>, string> = {
  default: 'var(--grey-300, #c2c2c2)',
  hover:   'var(--grey-500, #999999)',
  active:  'var(--grey-700, #5e5e5e)',
}

/** Standalone-иконка с тремя состояниями (default / hover / active). */
export function Ic({ icon = 'ic-question', state: stateProp = 'default', size = 24, className }: IcProps) {
  const [hovered, setHovered] = useState(false)
  const state = hovered ? 'hover' : stateProp
  return (
    <span
      className={`inline-flex items-center justify-center ${className ?? ''}`}
      style={{ color: STATE_COLOR[state], transition: 'color 0.15s ease' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon name={icon} size={size} />
    </span>
  )
}

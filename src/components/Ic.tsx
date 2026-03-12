import { Icon, IconName } from './Icon'

type IcProps = {
  icon?: IconName
  state?: 'default' | 'hover' | 'active'
  size?: number
  className?: string
}

const STATE_COLOR: Record<NonNullable<IcProps['state']>, string> = {
  default: 'var(--grey-400, #adadad)',
  hover:   'var(--grey-600, #7b7b7b)',
  active:  'var(--grey-850, #313131)',
}

/** Standalone-иконка с тремя состояниями (default / hover / active). */
export function Ic({ icon = 'ic-question', state = 'default', size = 24, className }: IcProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className ?? ''}`}
      style={{ color: STATE_COLOR[state] }}
    >
      <Icon name={icon} size={size} />
    </span>
  )
}

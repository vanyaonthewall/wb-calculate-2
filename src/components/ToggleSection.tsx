import { useState } from 'react'
import { Toggle } from './Toggle'

type ToggleSectionProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  title?: string
  description?: string
  className?: string
}

export function ToggleSection({
  checked = true,
  onChange,
  title = 'Свободная планировка',
  description,
  className,
}: ToggleSectionProps) {
  const [hovered, setHovered] = useState(false)

  const borderColor = hovered
    ? 'var(--grey-150, #e0e0e0)'
    : 'transparent'

  return (
    <div
      className={
        className ??
        'flex items-center gap-[var(--gap-xs,12px)] w-full ' +
        'p-[var(--gap-s,16px)] ' +
        'rounded-[var(--round-m,16px)] ' +
        'bg-[var(--grey-0,white)] border-2 cursor-pointer ' +
        'transition-colors'
      }
      style={{ borderColor }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onChange?.(!checked)}
    >
      <Toggle checked={checked} onChange={onChange} />
      <div className="flex flex-col gap-[var(--gap-3xs,4px)] flex-1 min-w-0">
        <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap">
          {title}
        </p>
        {description && (
          <p className="font-inter font-normal text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)] text-[color:var(--grey-600,#7b7b7b)]">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

import { Segment } from './Segment'

type SegmentControlProps = {
  options: string[]
  value: number
  onChange?: (index: number) => void
  className?: string
  variant?: 'default' | 'dark'
}

export function SegmentControl({ options, value = 0, onChange, className, variant = 'default' }: SegmentControlProps) {
  return (
    <div
      className={
        className ??
        'flex items-center gap-[var(--gap-3xs,4px)] w-full ' +
        'p-[var(--inset-2xs,2px)] ' +
        'rounded-[var(--round-s,12px)] ' +
        'border-2 border-[var(--grey-150,#e0e0e0)] bg-[var(--grey-0,white)]'
      }
    >
      {options.map((option, index) => (
        <Segment
          key={index}
          active={value === index}
          variant={variant}
          onClick={() => onChange?.(index)}
        >
          {option}
        </Segment>
      ))}
    </div>
  )
}

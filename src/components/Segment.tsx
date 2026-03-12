import { ButtonHTMLAttributes } from 'react'

type SegmentProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  variant?: 'default' | 'dark'
}

/** Одиночный сегмент — используется внутри SegmentControl. */
export function Segment({ active = false, variant = 'default', children, className, ...props }: SegmentProps) {
  const activeBg = variant === 'dark'
    ? 'bg-[var(--grey-850,#313131)] text-[color:var(--grey-0,white)]'
    : 'bg-[var(--purple-500,#9744eb)] text-[color:var(--grey-0,white)]'

  return (
    <button
      {...props}
      className={
        className ??
        'flex-1 flex items-center justify-center cursor-pointer transition-colors ' +
        'px-[var(--inset-s,8px)] py-[var(--inset-s,8px)] ' +
        'rounded-[var(--round-xs,10px)] ' +
        'font-inter font-normal text-center whitespace-nowrap ' +
        'text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] ' +
        (active
          ? activeBg
          : 'bg-[var(--grey-0,white)] text-[color:var(--grey-850,#313131)] ' +
            'hover:bg-[var(--grey-100,#ebebeb)]')
      }
    >
      {children}
    </button>
  )
}

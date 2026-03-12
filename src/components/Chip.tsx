import { ButtonHTMLAttributes } from 'react'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'grey' | 'secondary'
  size?: 'm' | 's'
  interactive?: boolean
}

export function Chip({ children = '25 м²', color = 'grey', size = 'm', interactive = true, className, ...props }: ChipProps) {
  const colorClass = interactive
    ? color === 'secondary'
      ? 'bg-[var(--secondary-purple-500,#eadafb)] hover:bg-[var(--secondary-purple-600,#dfc6f9)] text-[color:var(--purple-500,#9744eb)]'
      : 'bg-[var(--grey-100,#ebebeb)] hover:bg-[var(--grey-150,#e0e0e0)] text-[color:var(--grey-700,#5e5e5e)] hover:text-[color:var(--grey-850,#313131)]'
    : color === 'secondary'
      ? 'bg-[var(--secondary-purple-500,#eadafb)] text-[color:var(--purple-500,#9744eb)]'
      : 'bg-[var(--grey-100,#ebebeb)] text-[color:var(--grey-700,#5e5e5e)]'

  const sizeClass = size === 's'
    ? 'gap-[var(--gap-3xs,4px)] px-[var(--inset-s,8px)] py-[var(--inset-2xs,2px)] rounded-[var(--round-full,99px)] text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)]'
    : 'gap-[var(--gap-2xs,8px)] px-[var(--inset-m,12px)] py-[var(--inset-xs,4px)] rounded-[var(--round-xs,10px)] text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)]'

  const baseClass =
    className ??
    'inline-flex items-center justify-center whitespace-nowrap font-inter font-normal ' +
    (interactive ? 'cursor-pointer transition-colors ' : 'cursor-default select-none ') +
    sizeClass + ' ' +
    colorClass

  if (!interactive) {
    return <span className={baseClass}>{children}</span>
  }

  return (
    <button {...props} className={baseClass}>
      {children}
    </button>
  )
}

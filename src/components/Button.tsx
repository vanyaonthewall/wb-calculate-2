import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children = 'Text', className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={
        className ??
        'flex items-center justify-center w-full cursor-pointer transition-colors ' +
        'py-[var(--inset-xl,24px)] ' +
        'rounded-[var(--round-s,12px)] ' +
        'font-unbounded font-bold ' +
        'text-[length:var(--f-size-l,20px)] ' +
        'leading-[var(--f-lh-m,24px)] ' +
        'text-[color:var(--grey-0,#fff)] ' +
        'bg-[var(--grey-850,#313131)] ' +
        'hover:bg-[var(--grey-800,#404040)]'
      }
    >
      {children}
    </button>
  )
}

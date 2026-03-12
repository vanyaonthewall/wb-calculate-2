import { useState } from 'react'

type InputProps = {
  value?: string
  unit?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
}

export function Input({
  value = '',
  unit = 'м²',
  placeholder = '25',
  onChange,
  className,
}: InputProps) {
  const [focused, setFocused] = useState(false)

  const isFilled = value !== ''

  const stateClass = focused
    ? 'bg-[var(--grey-0,white)] shadow-[inset_0_0_0_2px_var(--purple-500,#9744eb)]'
    : isFilled
      ? 'bg-[var(--grey-0,white)] shadow-[inset_0_0_0_2px_var(--grey-150,#e0e0e0)]'
      : 'bg-[var(--grey-0,white)] shadow-[inset_0_0_0_2px_var(--grey-150,#e0e0e0)] hover:bg-[var(--grey-100,#ebebeb)]'

  return (
    <div
      className={
        className ??
        'flex items-center justify-between w-full cursor-text transition-colors ' +
        'px-[var(--inset-l,16px)] py-[var(--inset-m,12px)] ' +
        'rounded-[var(--round-s,12px)] ' +
        stateClass
      }
    >
      <input
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '' || /^\d*[.,]?\d*$/.test(raw)) onChange?.(raw)
        }}
        className={
          'bg-transparent outline-none appearance-none flex-1 min-w-0 font-inter ' +
          'text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] ' +
          'text-[color:var(--grey-850,#313131)] ' +
          'placeholder:text-[color:var(--grey-500,#999)]'
        }
      />
      <span className="text-[color:var(--grey-500,#999)] shrink-0 ml-2 font-inter text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)]">
        {unit}
      </span>
    </div>
  )
}

type ToggleProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export function Toggle({ checked = false, onChange, className }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={
        className ??
        'relative h-[28px] w-[48px] shrink-0 cursor-pointer transition-colors ' +
        'rounded-[var(--round-full,99px)] ' +
        (checked ? 'bg-[var(--green-500,#00bd00)]' : 'bg-[var(--grey-300,#c2c2c2)]')
      }
    >
      <span
        className={
          'absolute top-[4px] size-[20px] rounded-full bg-white shadow-sm ' +
          'transition-[left] duration-200 ' +
          (checked ? 'left-[24px]' : 'left-[4px]')
        }
      />
    </button>
  )
}

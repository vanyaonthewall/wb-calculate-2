type RadioProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export function Radio({ checked = false, onChange, className }: RadioProps) {
  return (
    <button
      role="radio"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={
        className ??
        'relative size-[24px] shrink-0 rounded-full ' +
        'flex items-center justify-center cursor-pointer ' +
        'border-2 transition-colors bg-[var(--grey-0,white)] ' +
        (checked
          ? 'border-[var(--purple-500,#9744eb)]'
          : 'border-[var(--grey-300,#c2c2c2)]')
      }
    >
      {checked && (
        <span className="size-[14px] rounded-full bg-[var(--purple-500,#9744eb)]" />
      )}
    </button>
  )
}

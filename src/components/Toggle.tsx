type ToggleProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function Toggle({ checked = false, onChange }: ToggleProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={e => { e.stopPropagation(); onChange?.(!checked) }}
      className={
        'shrink-0 w-6 h-6 rounded-[5px] border-2 flex items-center justify-center transition-colors cursor-pointer ' +
        (checked
          ? 'bg-[var(--green-500,#00bd00)] border-[var(--green-500,#00bd00)]'
          : 'bg-transparent border-[var(--grey-300,#c2c2c2)]')
      }
    >
      {checked && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
          <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

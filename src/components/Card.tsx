import { Radio } from './Radio'

type CardProps = {
  header?: string
  subText?: string
  selected?: boolean
  onChange?: (selected: boolean) => void
  className?: string
}

/** Карточка выбора с радио-кнопкой. Состояния: on / off. */
export function Card({
  header = 'Только покраска',
  subText = 'Подходит, если ваше помещение уже разделено комнатами',
  selected = false,
  onChange,
  className,
}: CardProps) {
  return (
    <button
      onClick={() => onChange?.(!selected)}
      className={
        className ??
        'w-full text-left cursor-pointer transition-colors ' +
        'flex flex-col items-start ' +
        'bg-[var(--grey-0,white)] ' +
        'p-[var(--pad-s,16px)] ' +
        'rounded-[var(--round-m,16px)] ' +
        'border-2 ' +
        (selected
          ? 'border-[var(--purple-500,#9744eb)]'
          : 'border-[var(--grey-150,#e0e0e0)] hover:border-[var(--grey-300,#c2c2c2)]')
      }
    >
      <div className="flex gap-[var(--gap-xs,12px)] items-start w-full">
        <div className="mt-0.5 shrink-0">
          <Radio checked={selected} />
        </div>
        <div className="flex flex-col gap-[var(--gap-s,16px)] flex-1 min-w-0">
          <p
            className={
              'font-unbounded font-bold ' +
              'text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] ' +
              (selected
                ? 'text-[color:var(--grey-850,#313131)]'
                : 'text-[color:var(--grey-500,#999)]')
            }
          >
            {header}
          </p>
          <p
            className={
              'font-inter font-normal ' +
              'text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)] ' +
              (selected
                ? 'text-[color:var(--grey-850,#313131)]'
                : 'text-[color:var(--grey-600,#7b7b7b)]')
            }
          >
            {subText}
          </p>
        </div>
      </div>
    </button>
  )
}

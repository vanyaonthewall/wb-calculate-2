import { useEffect, useRef } from 'react'
import { Toggle } from './Toggle'
import { WorkItem } from './WorkItem'
import { AnimatedPrice } from './AnimatedPrice'

export type WorkEntry = {
  workName: string
  price: number
}

type WorkContainerProps = {
  active?: boolean
  onToggle?: (v: boolean) => void
  works?: WorkEntry[]
  onTotalChange?: (total: number) => void
}

/** Секция «Работа бригады» с тоглом и списком работ. */
export function WorkContainer({
  active = true,
  onToggle,
  works = [{ workName: 'Сборка металлического каркаса', price: 12000 }],
  onTotalChange,
}: WorkContainerProps) {
  const subTotal = works.reduce((sum, w) => sum + w.price, 0)

  const onTotalChangeRef = useRef(onTotalChange)
  onTotalChangeRef.current = onTotalChange

  useEffect(() => {
    onTotalChangeRef.current?.(subTotal)
  }, [subTotal])

  const titleColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const priceColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'

  return (
    <div
      className="flex flex-col gap-[var(--gap-s,16px)] px-[var(--pad-s,16px)] py-[var(--gap-s,16px)] w-full"
      style={{ backgroundColor: active ? 'var(--grey-0, white)' : 'var(--grey-100, #ebebeb)' }}
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between w-full">
        <p
          className="flex-1 font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] truncate"
          style={{ color: titleColor }}
        >
          Работа бригады
        </p>
        <div className="flex items-center gap-[var(--gap-2xs,8px)] shrink-0">
          <AnimatedPrice
            value={subTotal}
            className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] w-[85px] text-right"
            style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
          />
          <Toggle checked={active} onChange={v => onToggle?.(v)} />
        </div>
      </div>

      {/* Список работ */}
      <div className="flex flex-col w-full">
        {works.map((w, i) => (
          <WorkItem key={i} workName={w.workName} price={w.price} active={active} />
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { formatPrice } from '../utils'
import { Ic } from './Ic'

export type WorkClickData = {
  name: string
  price: number
  active: boolean
  onActiveChange: (v: boolean) => void
}

type WorkItemProps = {
  workName?: string
  price?: number
  active?: boolean
  onClick?: () => void
}

/** Строка с названием работы, ценой и иконкой-шевроном. */
export function WorkItem({
  workName = 'Сборка металлического каркаса',
  price = 0,
  active = true,
  onClick,
}: WorkItemProps) {
  const [hovered, setHovered] = useState(false)
  const textColor  = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'
  const priceColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-400, #adadad)'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-start gap-[var(--gap-2xs,8px)] border-b border-[var(--grey-150,#e0e0e0)] last:border-b-0 pb-[var(--gap-xs,12px)] last:pb-0 w-full text-left cursor-pointer overflow-hidden"
    >
      <p
        className="flex-1 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] min-w-0 line-clamp-3"
        style={{ color: textColor }}
      >
        {workName}
        <span className="inline-flex align-middle ml-[var(--gap-2xs,8px)]">
          <Ic icon="ic-question" size={24} state={hovered ? 'hover' : 'default'} />
        </span>
      </p>
      <p
        className="shrink-0 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] whitespace-nowrap"
        style={{ color: priceColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
      >
        {formatPrice(price)}
      </p>
    </button>
  )
}

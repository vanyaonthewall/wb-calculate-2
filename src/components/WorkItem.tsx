import { formatPrice } from '../utils'

type WorkItemProps = {
  workName?: string
  price?: number
  active?: boolean
}

/** Строка с названием работы и ценой. */
export function WorkItem({
  workName = 'Сборка металлического каркаса',
  price = 0,
  active = true,
}: WorkItemProps) {
  const textColor = active ? 'var(--grey-850, #313131)' : 'var(--grey-500, #999999)'

  return (
    <div className="flex items-start gap-[var(--gap-2xs,8px)] pb-[var(--gap-xs,12px)] w-full last:pb-0">
      <p
        className="flex-1 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] min-w-0"
        style={{ color: textColor }}
      >
        {workName}
      </p>
      <p
        className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] shrink-0 whitespace-nowrap"
        style={{ color: textColor, fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
      >
        {formatPrice(price)}
      </p>
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { Ic } from './Ic'
import { Icon } from './Icon'
import { IcControl } from './IcControl'
import { Chip } from './Chip'
import { CalculationUnit } from './CalculationUnit'
import { AnimatedHeight } from './AnimatedHeight'
import { AnimatedNumber } from './AnimatedPrice'
import type { PriceRow } from './PriceBox'

type StepThreeProps = {
  areaStr: string
  rows: PriceRow[]
  globalTotal?: number
  onClose?: () => void
  onTotalChange?: (total: number) => void
}

export function StepThree({ areaStr, rows, globalTotal, onClose, onTotalChange }: StepThreeProps) {
  const [unitTotals, setUnitTotals] = useState<Record<number, number>>({})
  const computedTotal = Object.values(unitTotals).reduce((sum, v) => sum + v, 0)

  const onTotalChangeRef = useRef(onTotalChange)
  onTotalChangeRef.current = onTotalChange
  useEffect(() => {
    onTotalChangeRef.current?.(computedTotal)
  }, [computedTotal])

  const makeOnTotalChange = useCallback(
    (i: number) => (t: number) => setUnitTotals(prev => ({ ...prev, [i]: t })),
    []
  )

  // Параметры объекта
  const initTotal = Math.round(parseFloat(areaStr.replace(',', '.')) || 35)
  const [paramsOpen, setParamsOpen] = useState(false)
  const [totalArea, setTotalArea] = useState(initTotal)
  const [clientZone, setClientZone] = useState(Math.min(15, initTotal - 1))
  const sklad = totalArea - clientZone

  // В какую зону добавлять при следующем увеличении totalArea
  const nextTotalIncrRow = useRef<'client' | 'sklad'>('sklad')

  const handleTotalInc = () => {
    setTotalArea(t => t + 1)
    if (nextTotalIncrRow.current === 'client') {
      setClientZone(c => c + 1)
      nextTotalIncrRow.current = 'sklad'
    } else {
      nextTotalIncrRow.current = 'client'
    }
  }

  const handleTotalDec = () => {
    const newTotal = Math.max(2, totalArea - 1)
    if (newTotal === totalArea) return
    setTotalArea(newTotal)
    if (newTotal - clientZone < 1) setClientZone(c => Math.max(1, c - 1))
  }

  const handleClientInc = () => { if (sklad > 1) setClientZone(c => c + 1) }
  const handleClientDec = () => { if (clientZone > 1) setClientZone(c => c - 1) }
  const handleSkladInc  = () => { if (clientZone > 1) setClientZone(c => c - 1) }
  const handleSkladDec  = () => { if (sklad > 1) setClientZone(c => c + 1) }

  return (
    <div className="h-full flex flex-col bg-[var(--grey-50,#f5f5f5)]">

      {/* Header */}
      <div className="shrink-0 flex items-start gap-[var(--gap-0,0px)] px-[var(--pad-m,24px)] pt-[var(--pad-m,24px)] pb-[var(--pad-s,16px)]">
        <p className="flex-1 font-unbounded font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] text-[color:var(--grey-850,#313131)]">
          Смета
        </p>
        <div className="flex items-start pt-[var(--gap-2xs,8px)] shrink-0">
          <button onClick={onClose} className="cursor-pointer">
            <Ic icon="ic-close" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-[var(--gap-m,32px)] pt-[var(--pad-m,24px)]">

        {/* Параметры объекта */}
        <div className="flex flex-col gap-[var(--gap-2xs,8px)]">

          {/* Заголовок */}
          <div className="flex items-center justify-between px-[var(--pad-m,24px)]">
            <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap">
              Параметры объекта
            </p>
            {/* Контейнер фиксированной высоты — чтобы строка не прыгала при переключении */}
            <div className="shrink-0 h-[32px] flex items-center">
              {paramsOpen ? (
                <button onClick={() => setParamsOpen(false)} className="cursor-pointer h-full flex items-center">
                  <span className="font-inter font-normal text-[14px] leading-[1.3] tracking-[-0.14px] text-[color:var(--purple-500,#9744eb)] w-[52px] text-right">
                    Скрыть
                  </span>
                </button>
              ) : (
                <Chip color="secondary" size="m" onClick={() => setParamsOpen(true)}>
                  <span className="whitespace-pre">{totalArea} м²{'  '}{clientZone}/{sklad}</span>
                  <Icon name="ic-pencil" size={24} />
                </Chip>
              )}
            </div>
          </div>

          {/* Раскрывающиеся контролы */}
          <AnimatedHeight open={paramsOpen}>
            <div className="flex flex-col gap-[var(--gap-3xs,4px)]">

              {/* Общая площадь */}
              <div className="bg-[var(--grey-0,white)] flex items-center justify-between p-[var(--pad-s,16px)] rounded-[var(--round-m,16px)]">
                <p className="flex-1 font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] overflow-hidden text-ellipsis whitespace-nowrap">
                  Общая площадь
                </p>
                <div className="flex gap-[var(--gap-2xs,8px)] items-center shrink-0">
                  <IcControl icon="ic-minus" color="grey" size="m" onClick={handleTotalDec} />
                  <span
                    className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] whitespace-nowrap"
                    style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                  >
                    <AnimatedNumber value={totalArea} format="d" /> м²
                  </span>
                  <IcControl icon="ic-plus" color="grey" size="m" onClick={handleTotalInc} />
                </div>
              </div>

              {/* Клиентская зона + ic-link + Склад */}
              <div className="flex items-center gap-[var(--gap-3xs,4px)]">

                {/* Клиентская зона */}
                <div className="flex-1 min-w-0 bg-[var(--grey-0,white)] flex flex-col gap-[8px] items-start p-[var(--pad-s,16px)] rounded-[var(--round-m,16px)]">
                  <p className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[1.4] tracking-[-0.48px] text-[color:var(--grey-850,#313131)] overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    Клиентская зона
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <IcControl icon="ic-minus" color="grey" size="m" onClick={handleClientDec} />
                    <span
                      className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[1.3] tracking-[-0.16px] text-[color:var(--grey-850,#313131)] whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                    >
                      <AnimatedNumber value={clientZone} format="d" /> м²
                    </span>
                    <IcControl icon="ic-plus" color="grey" size="m" onClick={handleClientInc} />
                  </div>
                </div>

                {/* ic-link — разделитель */}
                <Icon name="ic-link" size={24} className="text-[color:var(--grey-400,#adadad)] shrink-0" />

                {/* Склад */}
                <div className="flex-1 min-w-0 bg-[var(--grey-0,white)] flex flex-col gap-[8px] items-start p-[var(--pad-s,16px)] rounded-[var(--round-m,16px)]">
                  <p className="font-inter font-normal text-[length:var(--f-size-s,16px)] leading-[1.4] tracking-[-0.48px] text-[color:var(--grey-850,#313131)] overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    Склад
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <IcControl icon="ic-minus" color="grey" size="m" onClick={handleSkladDec} />
                    <span
                      className="font-inter font-semibold text-[length:var(--f-size-s,16px)] leading-[1.3] tracking-[-0.16px] text-[color:var(--grey-850,#313131)] whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ fontFeatureSettings: "'lnum' 1, 'tnum' 1" }}
                    >
                      <AnimatedNumber value={sklad} format="d" /> м²
                    </span>
                    <IcControl icon="ic-plus" color="grey" size="m" onClick={handleSkladInc} />
                  </div>
                </div>

              </div>
            </div>
          </AnimatedHeight>

        </div>

        {/* Материалы и работы */}
        <div className="flex flex-col gap-[var(--gap-xs,12px)]">
          <div className="px-[var(--pad-m,24px)]">
            <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
              Материалы и работы
            </p>
          </div>
          <div className="flex flex-col gap-[var(--gap-3xs,4px)]">
            {(() => {
              const step1Sum = rows.reduce((sum, r) => sum + r.value, 0)
              const target = step1Sum > 0 && globalTotal && globalTotal > 0 ? globalTotal : step1Sum
              const scale = step1Sum > 0 ? target / step1Sum : 1
              const rawScaled = rows.map(r => Math.round(r.value * scale))
              // Фикс рондинга: подгоняем последний элемент чтобы сумма = target
              if (rawScaled.length > 0)
                rawScaled[rawScaled.length - 1] += target - rawScaled.reduce((a, b) => a + b, 0)
              return rows.map((row, i) => {
                const scaledTotal = rawScaled[i]
                return (
                  <CalculationUnit
                    key={`${i}-${scaledTotal}`}
                    name={row.name}
                    imageUrl={row.imageUrl}
                    initialTotal={scaledTotal}
                    onTotalChange={makeOnTotalChange(i)}
                  />
                )
              })
            })()}
          </div>
        </div>

        <div className="h-[24px] shrink-0" />

      </div>

    </div>
  )
}

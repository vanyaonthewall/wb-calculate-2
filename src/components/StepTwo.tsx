import { useEffect, useState } from 'react'
import { Input } from './Input'
import { IcControl } from './IcControl'
import { SegmentControl } from './SegmentControl'
import { ToggleSection } from './ToggleSection'
import { Card } from './Card'
import { Ic } from './Ic'

const CEILING_OPTIONS = ['до 2,7 м', '3 м', 'от 3,5']

const ELECTRICITY_CARDS = [
  { header: 'Обновить свет',   subText: 'Проводка готова. Заменим старые светильники и розетки на брендовые по стандарту.' },
  { header: 'Монтаж с нуля',   subText: 'Прокладка новых линий в кабель-каналах или штробах по всему залу' },
]

const WALLS_CARDS = [
  { header: 'Только покраска',       subText: 'Стены ровные, нужно только покрасить в цвета брендбука' },
  { header: 'Выровнять и покрасить', subText: 'Стены кривые или «голые», нужна полная подготовка под покраску' },
]

const TOILET_CARDS = [
  { header: 'Без санузла',      subText: 'В помещении нет мокрой точки и её наличие не планируется' },
  { header: 'Только санфаянс',  subText: 'Выводы воды и канализации есть, просто ставим унитаз и раковину' },
  { header: 'Прокладка труб',   subText: 'Нужно тянуть коммуникации к месту санузла и строить стены' },
]

type StepTwoProps = {
  areaStr: string
  freeLayout: boolean
  onBack?: () => void
  onTotalChange?: (total: number) => void
}

export function StepTwo({ areaStr: initialArea, freeLayout: initialFreeLayout, onBack, onTotalChange }: StepTwoProps) {
  const [areaStr, setAreaStr]         = useState(initialArea)
  const [freeLayout, setFreeLayout]   = useState(initialFreeLayout)
  const [ceiling, setCeiling]         = useState(0)
  const [electricity, setElectricity] = useState(1)
  const [walls, setWalls]             = useState(1)
  const [toilet, setToilet]           = useState(2)

  const area = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)
  const handleDecrement = () => setAreaStr(String(Math.max(1, area - 1)))
  const handleIncrement = () => setAreaStr(String(area + 1))

  useEffect(() => {
    const a = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)
    const base = a * (freeLayout ? 3000 : 4200)
    const ceilingExtra = [0, 8000, 22000][ceiling] ?? 0
    const elecExtra = electricity === 0 ? 0 : Math.round(a * 700)
    const wallsExtra = walls === 0 ? Math.round(a * 300) : Math.round(a * 900)
    const toiletExtra = [0, 38000, 115000][toilet] ?? 0
    onTotalChange?.(Math.round((base + ceilingExtra + elecExtra + wallsExtra + toiletExtra) / 1000) * 1000)
  }, [areaStr, freeLayout, ceiling, electricity, walls, toilet, onTotalChange])

  return (
    <div className="h-full flex flex-col bg-[var(--grey-50,#f5f5f5)]">

      {/* Header */}
      <div className="shrink-0 flex items-start gap-[var(--gap-0,0px)] px-[var(--pad-m,24px)] pt-[var(--pad-m,24px)] pb-[var(--pad-s,16px)]">
        <p className="flex-1 font-unbounded font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] whitespace-pre-wrap">
          <span className="text-[color:var(--purple-500,#9744eb)]">Уточним</span>
          <span className="text-[color:var(--grey-850,#313131)]">{` детали для расчета`}</span>
        </p>
        <div className="flex items-start pt-[var(--gap-xs,12px)] shrink-0">
          <button onClick={onBack} className="cursor-pointer">
            <Ic icon="ic-close" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-[var(--gap-m,32px)] px-[var(--pad-m,24px)] py-[var(--pad-m,24px)]">

        {/* Площадь */}
        <div className="flex flex-col gap-[var(--gap-xs,12px)]">
          <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
            Общая площадь помещения
          </p>
          <div className="flex items-start gap-[var(--gap-2xs,8px)]">
            <div className="flex-1 min-w-0">
              <Input value={areaStr} onChange={setAreaStr} placeholder="35" unit="м²" />
            </div>
            <IcControl icon="ic-minus" color="grey" size="m" onClick={handleDecrement} />
            <IcControl icon="ic-plus" color="grey" size="m" onClick={handleIncrement} />
          </div>
        </div>

        {/* Свободная планировка */}
        <ToggleSection checked={freeLayout} onChange={setFreeLayout} />

        {/* Высота потолков */}
        <div className="flex flex-col gap-[var(--gap-xs,12px)]">
          <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
            Высота потолков
          </p>
          <SegmentControl options={CEILING_OPTIONS} value={ceiling} onChange={setCeiling} />
        </div>

        {/* Электрика */}
        <div className="flex flex-col gap-[var(--gap-xs,12px)]">
          <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
            Электрика
          </p>
          <div className="flex flex-col gap-[var(--gap-2xs,8px)]">
            {ELECTRICITY_CARDS.map((c, i) => (
              <Card key={i} header={c.header} subText={c.subText} selected={electricity === i} onChange={() => setElectricity(i)} />
            ))}
          </div>
        </div>

        {/* Стены */}
        <div className="flex flex-col gap-[var(--gap-xs,12px)]">
          <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
            Стены
          </p>
          <div className="flex flex-col gap-[var(--gap-2xs,8px)]">
            {WALLS_CARDS.map((c, i) => (
              <Card key={i} header={c.header} subText={c.subText} selected={walls === i} onChange={() => setWalls(i)} />
            ))}
          </div>
        </div>

        {/* Санузел */}
        <div className="flex flex-col gap-[var(--gap-xs,12px)]">
          <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
            Санузел (Водоснабжение)
          </p>
          <div className="flex flex-col gap-[var(--gap-2xs,8px)]">
            {TOILET_CARDS.map((c, i) => (
              <Card key={i} header={c.header} subText={c.subText} selected={toilet === i} onChange={() => setToilet(i)} />
            ))}
          </div>
        </div>

        <div className="h-[24px] shrink-0" />

      </div>

    </div>
  )
}

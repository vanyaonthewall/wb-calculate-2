import { useEffect, useRef, useState } from 'react'
import { Input } from './Input'
import { IcControl } from './IcControl'
import { SegmentControl } from './SegmentControl'
import { ToggleSection } from './ToggleSection'
import { Card } from './Card'
import { Ic } from './Ic'
import { calcAll } from '../calc'

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

export type Step2Params = {
  ceiling: number
  electricity: number
  walls: number
  toilet: number
  freeLayout: boolean
}

type StepTwoProps = {
  areaStr: string
  freeLayout: boolean
  condition?: number
  onBack?: () => void
  onTotalChange?: (total: number) => void
  onParamsChange?: (params: Step2Params) => void
}

const EASE = 'cubic-bezier(0.4,0,0.2,1)'

export function StepTwo({
  areaStr: initialArea,
  freeLayout: initialFreeLayout,
  condition = 0,
  onBack,
  onTotalChange,
  onParamsChange,
}: StepTwoProps) {
  const [areaStr, setAreaStr]         = useState(initialArea)
  const [freeLayout, setFreeLayout]   = useState(initialFreeLayout)
  const [ceiling, setCeiling]         = useState(1)   // 3 м — как на экране 1
  const [electricity, setElectricity] = useState(1)
  // WALLS по умолчанию соответствует STATE: Косметика → покраска, иначе → выровнять
  const [walls, setWalls]             = useState(() => condition === 0 ? 0 : 1)
  const [toilet, setToilet]           = useState(0)   // без санузла — как на экране 1

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  const area = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)
  const handleDecrement = () => setAreaStr(String(Math.max(1, area - 1)))
  const handleIncrement = () => setAreaStr(String(area + 1))

  useEffect(() => {
    const a = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)
    const result = calcAll({
      S: a,
      state: condition,
      freeLayout,
      ceiling,
      electricity,
      walls,
      toilet,
    })
    onTotalChange?.(result.total)
    onParamsChange?.({ ceiling, electricity, walls, toilet, freeLayout })
  }, [areaStr, freeLayout, ceiling, electricity, walls, toilet, condition, onTotalChange, onParamsChange])

  return (
    <div className="h-full flex flex-col bg-[var(--grey-50,#f5f5f5)]">

      {/*
        Шапка СНАРУЖИ scroll-контейнера — исключает feedback loop.
        marginBottom: -24px тянет scroll-контент под прозрачный хвост градиента.
        z-index: 1 — шапка поверх скролл-контента.
      */}
      <div
        className="shrink-0 relative z-[1] flex items-start gap-0 px-[var(--pad-m,24px)] pointer-events-none"
        style={{
          marginBottom: '-24px',
          paddingTop: scrolled ? 'var(--inset-m,12px)' : 'var(--pad-m,24px)',
          paddingBottom: scrolled ? 'calc(var(--pad-m,24px) + var(--inset-m,12px))' : 'var(--pad-m,24px)',
          background: 'linear-gradient(to bottom, var(--grey-50,#f5f5f5) 70%, transparent)',
          transition: `padding-top 0.3s ${EASE}, padding-bottom 0.3s ${EASE}`,
        }}
      >
        <p
          className="flex-1 font-unbounded font-semibold whitespace-pre-wrap"
          style={{
            fontSize: scrolled ? 'var(--f-size-l,20px)' : 'var(--f-size-xl,30px)',
            lineHeight: scrolled ? 'var(--f-lh-m,24px)' : 'var(--f-lh-l,40px)',
            transition: `font-size 0.3s ${EASE}, line-height 0.3s ${EASE}`,
          }}
        >
          <span className="text-[color:var(--purple-500,#9744eb)]">Уточним</span>
          <span className="text-[color:var(--grey-850,#313131)]">{` детали для расчета`}</span>
        </p>
        <div
          className="flex items-start shrink-0 pointer-events-auto"
          style={{
            paddingTop: scrolled ? '0px' : 'var(--gap-xs,12px)',
            transition: `padding-top 0.3s ${EASE}`,
          }}
        >
          <button onClick={onBack} className="cursor-pointer">
            <Ic icon="ic-close" />
          </button>
        </div>
      </div>

      {/* Scroll-контейнер */}
      <div
        ref={scrollRef}
        onScroll={() => setScrolled((scrollRef.current?.scrollTop ?? 0) > 8)}
        className="flex-1 overflow-y-auto flex flex-col gap-[var(--gap-m,32px)] px-[var(--pad-m,24px)] pt-[var(--pad-m,24px)] pb-[var(--pad-m,24px)]"
      >

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
        <ToggleSection
          checked={freeLayout}
          onChange={setFreeLayout}
          description="Включите, если помещение без комнат и нужна перегородка"
        />

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

        <div className="h-[160px] shrink-0" />

      </div>
    </div>
  )
}

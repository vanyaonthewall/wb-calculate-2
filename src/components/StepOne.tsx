import { useState, useMemo, useEffect, useRef } from 'react'
import { Input } from './Input'
import { Chip } from './Chip'
import { SegmentControl } from './SegmentControl'
import { IcControl } from './IcControl'
import { Ic } from './Ic'
import { ToggleSection } from './ToggleSection'
import type { PriceRow } from './PriceBox'
import { calcAll, DEFAULT_CALC_PARAMS } from '../calc'
import wallImg from '../img/picture=wall.png'
import sofaImg from '../img/picture=sofa.png'
import lumaImg from '../img/picture=luma.png'
import cameraImg from '../img/picture=camera.png'
import coinsImg from '../img/picture=coins.png'
import toiletImg from '../img/picture=toilet.png'

const AREA_PRESETS = [25, 35, 50, 75]
const CONDITIONS = ['Косметика', 'White box', 'Бетон']

type StepOneProps = {
  onLiveChange?: (data: {
    areaStr: string
    freeLayout: boolean
    condition: number
    rows: PriceRow[]
    total: number
  }) => void
}

export function StepOne({ onLiveChange }: StepOneProps) {
  const [areaStr, setAreaStr] = useState('35')
  const [condition, setCondition] = useState(0)
  const [freeLayout, setFreeLayout] = useState(false)

  const area = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)

  // WALLS по умолчанию: STATE=0 → 0 (только покраска), STATE≥1 → 1 (выровнять)
  const defaultWalls = condition === 0 ? 0 : 1

  const result = useMemo(
    () => calcAll({
      S: area,
      state: condition,
      freeLayout,
      walls: defaultWalls,
      ...DEFAULT_CALC_PARAMS,
    }),
    [area, condition, freeLayout, defaultWalls]
  )

  const rows: PriceRow[] = useMemo(
    () => [
      { name: 'Стены, полы, потолок', imageUrl: wallImg,   value: result.cat1    },
      { name: 'Электрика и свет',     imageUrl: lumaImg,   value: result.cat2    },
      { name: 'Безопасность и IT',    imageUrl: cameraImg, value: result.cat3    },
      { name: 'Санузел',              imageUrl: toiletImg, value: result.cat4    },
      { name: 'Мебель WB',            imageUrl: sofaImg,   value: result.cat5    },
      { name: 'Резерв 12%',           imageUrl: coinsImg,  value: result.reserve },
    ],
    [result]
  )

  const onLiveChangeRef = useRef(onLiveChange)
  onLiveChangeRef.current = onLiveChange
  useEffect(() => {
    onLiveChangeRef.current?.({ areaStr, freeLayout, condition, rows, total: result.total })
  }, [areaStr, freeLayout, condition, result.total]) // rows пересчитывается при result

  const handleDecrement = () => setAreaStr(String(Math.max(1, area - 1)))
  const handleIncrement = () => setAreaStr(String(area + 1))

  return (
    <div className="h-full overflow-y-auto bg-[var(--grey-50,#f5f5f5)]">
      <div className="flex flex-col gap-[40px] bg-[var(--grey-50,#f5f5f5)] rounded-[var(--round-l,24px)] p-[var(--pad-m,24px)] m-[var(--gap-3xs,4px)]">

        {/* Заголовок */}
        <p className="font-unbounded font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] whitespace-pre-wrap">
          <span className="text-[color:var(--purple-500,#9744eb)]">Калькулятор</span>
          <span className="text-[color:var(--grey-850,#313131)]">{`  ремонта ПВЗ`}</span>
        </p>

        {/* Блок параметров */}
        <div className="flex flex-col gap-[var(--gap-m,32px)]">

          {/* Площадь */}
          <div className="flex flex-col gap-[var(--gap-xs,12px)]">
            <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
              Общая площадь помещения
            </p>
            <div className="flex flex-col gap-[var(--gap-xs,12px)]">
              <div className="flex items-start gap-[var(--gap-2xs,8px)]">
                <div className="flex-1 min-w-0">
                  <Input value={areaStr} onChange={setAreaStr} placeholder="35" unit="м²" />
                </div>
                <IcControl icon="ic-minus" color="grey" size="m" onClick={handleDecrement} />
                <IcControl icon="ic-plus" color="grey" size="m" onClick={handleIncrement} />
              </div>
              <div className="flex gap-[var(--gap-2xs,8px)] flex-wrap">
                {AREA_PRESETS.map(p => (
                  <Chip key={p} color="grey" onClick={() => setAreaStr(String(p))}>
                    {p}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {/* Текущее состояние */}
          <div className="flex flex-col gap-[var(--gap-xs,12px)]">
            <div className="flex items-center gap-[var(--gap-3xs,4px)]">
              <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
                Текущее состояние
              </p>
              <Ic icon="ic-question" />
            </div>
            <SegmentControl options={CONDITIONS} value={condition} onChange={setCondition} />
          </div>

          {/* Свободная планировка */}
          <ToggleSection
            checked={freeLayout}
            onChange={setFreeLayout}
            description="Включите, если помещение без комнат и нужна перегородка"
          />

        </div>
      </div>
      <div className="h-[160px]" />
    </div>
  )
}

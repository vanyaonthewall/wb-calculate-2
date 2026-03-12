import { useState, useMemo, useEffect, useRef } from 'react'
import { Input } from './Input'
import { Chip } from './Chip'
import { SegmentControl } from './SegmentControl'
import { IcControl } from './IcControl'
import { Ic } from './Ic'
import { ToggleSection } from './ToggleSection'
import type { PriceRow } from './PriceBox'
import wallImg from '../img/picture=wall.png'
import brandImg from '../img/picture=brand.png'
import lumaImg from '../img/picture=luma.png'
import cameraImg from '../img/picture=camera.png'
import coinsImg from '../img/picture=coins.png'

const AREA_PRESETS = [25, 35, 50, 75]
const CONDITIONS = ['Косметика', 'White box', 'Бетон']
const BASE_PRICE_PER_M2 = 5000
const STATE_COEFF = [1.0, 1.8, 2.5]
const LAYOUT_COEFF_FREE = 1.3

const ROW_DEFS = [
  { name: 'Стены и полы',        imageUrl: wallImg,   ratio: 0.40 },
  { name: 'Мебель и брендинг',   imageUrl: brandImg,  ratio: 0.25 },
  { name: 'Электрика и свет',    imageUrl: lumaImg,   ratio: 0.15 },
  { name: 'Безопасность и IT',   imageUrl: cameraImg, ratio: 0.10 },
  { name: 'Расходники и резерв', imageUrl: coinsImg,  ratio: 0.10 },
]

type StepOneProps = {
  onLiveChange?: (data: { areaStr: string; freeLayout: boolean; rows: PriceRow[]; total: number }) => void
}

export function StepOne({ onLiveChange }: StepOneProps) {
  const [areaStr, setAreaStr] = useState('35')
  const [condition, setCondition] = useState(0)
  const [freeLayout, setFreeLayout] = useState(false)

  const area = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)

  const total = useMemo(
    () => Math.round(area * BASE_PRICE_PER_M2 * STATE_COEFF[condition] * (freeLayout ? LAYOUT_COEFF_FREE : 1)),
    [area, condition, freeLayout]
  )

  const rows: PriceRow[] = useMemo(
    () => ROW_DEFS.map(r => ({ name: r.name, imageUrl: r.imageUrl, value: Math.round(total * r.ratio) })),
    [total]
  )

  const onLiveChangeRef = useRef(onLiveChange)
  onLiveChangeRef.current = onLiveChange
  useEffect(() => {
    onLiveChangeRef.current?.({ areaStr, freeLayout, rows, total })
  }, [areaStr, freeLayout, total]) // rows пересчитывается при total

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
          <ToggleSection checked={freeLayout} onChange={setFreeLayout} />

        </div>
      </div>
      <div className="h-[24px]" />
    </div>
  )
}

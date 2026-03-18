import { useCallback, useMemo, useRef, useState } from 'react'
import { Input } from './Input'
import { Chip } from './Chip'
import { SegmentControl } from './SegmentControl'
import { IcControl } from './IcControl'
import { Ic } from './Ic'
import { ToggleSection } from './ToggleSection'
import { CalculationUnit, type UnitSection } from './CalculationUnit'
import { Banner } from './Banner'
import { PriceBox } from './PriceBox'
import type { PriceRow } from './PriceBox'
import wallImg from '../img/picture=wall.png'
import sofaImg from '../img/picture=sofa.png'
import lumaImg from '../img/picture=luma.png'
import cameraImg from '../img/picture=camera.png'
import coinsImg from '../img/picture=coins.png'
import toiletImg from '../img/picture=toilet.png'
import { buildCat1, buildCat2, buildCat3, buildCat4, buildMebel } from '../calc'

const AREA_PRESETS = [25, 35, 50, 75]
const CONDITIONS = ['Косметика', 'White box', 'Бетон']
const CEILING_OPTIONS = ['до 2,7 м', '3 м', 'от 3,5']

const CATEGORIES = [
  { name: 'Внутренняя отделка', imageUrl: wallImg   },
  { name: 'Электрика и свет',   imageUrl: lumaImg   },
  { name: 'Безопасность и IT',  imageUrl: cameraImg },
  { name: 'Санузел',            imageUrl: toiletImg },
  { name: 'Мебель',             imageUrl: sofaImg   },
  { name: 'Резерв 12%',         imageUrl: coinsImg  },
]

// ─── Переключатель дизайн-системы (Comfort / Tiny) ───────────────────────
function ModeSwitcher() {
  const [mode, setMode] = useState<'comfort' | 'tiny'>('comfort')
  const toggle = (m: 'comfort' | 'tiny') => {
    setMode(m)
    if (m === 'tiny') {
      document.documentElement.setAttribute('data-mode', 'tiny')
    } else {
      document.documentElement.removeAttribute('data-mode')
    }
  }
  return (
    <div className="flex items-center gap-[2px] p-[2px] rounded-[8px] bg-[var(--grey-0,white)] border border-[var(--grey-150,#e0e0e0)] shrink-0">
      {(['comfort', 'tiny'] as const).map(m => (
        <button
          key={m}
          onClick={() => toggle(m)}
          className={
            'px-2 py-[3px] rounded-[6px] font-inter font-normal text-[14px] leading-5 cursor-pointer transition-colors whitespace-nowrap ' +
            (mode === m
              ? 'bg-[var(--grey-850,#313131)] text-white'
              : 'text-[var(--grey-850,#313131)] hover:bg-[var(--grey-100,#ebebeb)]')
          }
        >
          {m === 'comfort' ? 'Комфорт' : 'Компакт'}
        </button>
      ))}
    </div>
  )
}

export function SimplePage() {
  const [areaStr, setAreaStr] = useState('35')
  const [condition, setCondition] = useState(0)
  const [freeLayout, setFreeLayout] = useState(false)
  const [ceiling, setCeiling] = useState(1)

  const area = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)

  const handleDecrement = () => setAreaStr(String(Math.max(1, area - 1)))
  const handleIncrement = () => setAreaStr(String(area + 1))

  const calcParams = useMemo(() => ({
    S: area,
    state: condition,
    plan: freeLayout,
    hIdx: ceiling,
  }), [area, condition, freeLayout, ceiling])

  const cat1Sections = useMemo(() => buildCat1(calcParams), [calcParams])
  const cat2Sections = useMemo(() => buildCat2(calcParams), [calcParams])
  const cat3Sections = useMemo(() => buildCat3(calcParams), [calcParams])
  const cat4Sections = useMemo(() => buildCat4(calcParams), [calcParams])
  const mebelItems   = useMemo(() => buildMebel(area), [area])

  const categorySections: (UnitSection[] | undefined)[] = [
    cat1Sections,
    cat2Sections,
    cat3Sections,
    cat4Sections,
    undefined, // Мебель — flatMaterials
    undefined, // Резерв — не раскрывается
  ]

  // Тоталы из каждого CalculationUnit
  const [unitTotals, setUnitTotals] = useState<Record<number, number>>({})

  const makeOnTotalChange = useCallback(
    (i: number) => (t: number) => setUnitTotals(prev => ({ ...prev, [i]: t })),
    []
  )

  const callbacksRef = useRef<((t: number) => void)[]>([])
  if (callbacksRef.current.length === 0) {
    callbacksRef.current = CATEGORIES.map((_, i) => makeOnTotalChange(i))
  }

  const reserve = useMemo(() => {
    const base = [0, 1, 2, 3, 4].reduce((sum, i) => sum + (unitTotals[i] ?? 0), 0)
    return Math.round(base * 0.12)
  }, [unitTotals])

  const computedTotal = [0, 1, 2, 3, 4].reduce((sum, i) => sum + (unitTotals[i] ?? 0), 0) + reserve

  const priceBoxRows: PriceRow[] = CATEGORIES.map((cat, i) => ({
    name: cat.name,
    imageUrl: cat.imageUrl,
    value: i === 5 ? reserve : (unitTotals[i] ?? 0),
  }))

  return (
    <div className="bg-[var(--grey-50,#f5f5f5)]">
      <div className="mx-auto w-full max-w-[640px]">

        {/* Хедер: заголовок + переключатель режимов */}
        <div className="flex items-center justify-between gap-[var(--gap-2xs,8px)] px-[var(--pad-m,24px)] pt-[var(--pad-m,24px)] mx-[var(--gap-3xs,4px)]">
          <p className="font-inter font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] text-[color:var(--grey-850,#313131)]">
            Калькулятор ремонта ПВЗ
          </p>
          <ModeSwitcher />
        </div>

        {/* Форма */}
        <div className="flex flex-col gap-[var(--gap-m,32px)] px-[var(--pad-m,24px)] pb-[var(--pad-m,24px)] mx-[var(--gap-3xs,4px)] mt-[var(--gap-m,32px)]">

          {/* 1. Площадь */}
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

          {/* 2. Свободная планировка */}
          <ToggleSection
            checked={freeLayout}
            onChange={setFreeLayout}
            description="Включите, если помещение без комнат и нужна перегородка"
          />

          {/* 3. Текущее состояние */}
          <div className="flex flex-col gap-[var(--gap-xs,12px)]">
            <div className="flex items-center gap-[var(--gap-2xs,8px)]">
              <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
                Текущее состояние
              </p>
              <Ic icon="ic-question" />
            </div>
            <SegmentControl options={CONDITIONS} value={condition} onChange={setCondition} />
          </div>

          {/* 4. Высота потолков */}
          <div className="flex flex-col gap-[var(--gap-xs,12px)]">
            <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
              Высота потолков
            </p>
            <SegmentControl options={CEILING_OPTIONS} value={ceiling} onChange={setCeiling} />
          </div>

        </div>

        {/* Заголовок раздела сметы */}
        <div className="flex items-center justify-between gap-[var(--gap-2xs,8px)] px-[var(--pad-m,24px)] pt-[40px] pb-[var(--gap-3xs,4px)] mx-[var(--gap-3xs,4px)]">
          <p className="font-inter font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] text-[color:var(--grey-850,#313131)]">
            Расчет
          </p>
          <Chip size="s" color="secondary" interactive={false}>включены материалы и работы</Chip>
        </div>

        {/* Категории + Баннер */}
        <div className="flex flex-col gap-[var(--gap-3xs,4px)] mx-[var(--gap-3xs,4px)] px-[var(--pad-m,24px)]">
          {CATEGORIES.map((cat, i) => (
            <CalculationUnit
              key={i}
              name={cat.name}
              nameNode={cat.name === 'Резерв 12%' ? (
                <><span>Резерв </span><span style={{ color: 'var(--grey-500, #999999)' }}>12%</span></>
              ) : undefined}
              imageUrl={cat.imageUrl}
              onTotalChange={callbacksRef.current[i]}
              sections={categorySections[i]}
              flatMaterials={
                cat.name === 'Мебель'
                  ? mebelItems
                  : cat.name === 'Резерв 12%'
                  ? [{ materialText: 'Резерв 12% от общей сметы', price: reserve, quantity: 1 }]
                  : undefined
              }
              canExpand={cat.name !== 'Резерв 12%'}
              initialEnabled={true}
            />
          ))}
          <Banner />
        </div>

        {/* Отступ под прибитый PriceBox */}
        <div className="h-[320px]" />

      </div>

      {/* PriceBox — прибит к низу экрана, во всю ширину */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <PriceBox
          rows={priceBoxRows}
          total={computedTotal}
          page="2nd-3rd"
          showList={false}
          showBtBack={false}
          ctaText="Скачать смету в PDF"
          showCta={true}
        />
      </div>

    </div>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Input } from './Input'
import { Chip } from './Chip'
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
import { buildCat1, buildCat2, buildCat3, buildCat4, buildMebel, buildCat6 } from '../calc'

const AREA_PRESETS = [25, 35, 50, 75]
const CONDITIONS = ['Косметика', 'White box', 'Бетон']
const CEILING_PRESETS = ['2700', '3000', '3500']

function ceilingIndex(mm: number): number {
  if (mm < 2850) return 0
  if (mm < 3250) return 1
  return 2
}

const CATEGORIES = [
  { name: 'Внутренняя отделка',  imageUrl: wallImg   },
  { name: 'Электрика и свет',    imageUrl: lumaImg   },
  { name: 'Безопасность и IT',   imageUrl: cameraImg },
  { name: 'Санузел',             imageUrl: toiletImg },
  { name: 'Мебель',              imageUrl: sofaImg   },
  { name: 'Резерв и расходники', imageUrl: coinsImg  },
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
  const [ceilingMm, setCeilingMm] = useState('3000')
  const [layoutVersion, setLayoutVersion] = useState<1 | 2>(1)
  const [clientStr, setClientStr] = useState(String(Math.round(35 * 0.65)))
  const [storageStr, setStorageStr] = useState(String(Math.round(35 * 0.35)))

  const area = Math.max(1, parseFloat(areaStr.replace(',', '.')) || 0)

  useEffect(() => {
    setClientStr(String(Math.round(area * 0.65)))
    setStorageStr(String(Math.round(area * 0.35)))
  }, [area])

  const handleDecrement = () => setAreaStr(String(Math.max(1, area - 1)))
  const handleIncrement = () => setAreaStr(String(area + 1))

  const clientVal = Math.max(0, parseFloat(clientStr.replace(',', '.')) || 0)
  const storageVal = Math.max(0, parseFloat(storageStr.replace(',', '.')) || 0)

  const handleClientChange = (val: string) => {
    setClientStr(val)
    const c = Math.max(0, parseFloat(val.replace(',', '.')) || 0)
    setStorageStr(String(Math.max(0, Math.round(area - c))))
  }
  const handleStorageChange = (val: string) => {
    setStorageStr(val)
    const s = Math.max(0, parseFloat(val.replace(',', '.')) || 0)
    setClientStr(String(Math.max(0, Math.round(area - s))))
  }

  const ceilingVal = parseInt(ceilingMm) || 3000
  const handleCeilingDecrement = () => setCeilingMm(String(Math.max(2000, ceilingVal - 100)))
  const handleCeilingIncrement = () => setCeilingMm(String(ceilingVal + 100))

  const ceiling = ceilingIndex(parseInt(ceilingMm) || 3000)

  const calcParams = useMemo(() => ({
    S: area,
    state: condition,
    plan: freeLayout,
    hIdx: ceiling,
    kZone: Math.min(1, Math.max(0, clientVal / area)),
  }), [area, condition, freeLayout, ceiling, clientVal])

  const cat1Sections = useMemo(() => buildCat1(calcParams), [calcParams])
  const cat2Sections = useMemo(() => buildCat2(calcParams), [calcParams])
  const cat3Sections = useMemo(() => buildCat3(calcParams), [calcParams])
  const cat4Sections = useMemo(() => buildCat4(calcParams), [calcParams])
  const mebelItems   = useMemo(() => buildMebel(area), [area])

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

  const cat6Sections = useMemo(() => buildCat6(reserve, area), [reserve, area])

  const categorySections: (UnitSection[] | undefined)[] = [
    cat1Sections,
    cat2Sections,
    cat3Sections,
    cat4Sections,
    undefined,    // Мебель — flatMaterials
    cat6Sections, // Резерв и расходники
  ]

  const computedTotal = [0, 1, 2, 3, 4, 5].reduce((sum, i) => sum + (unitTotals[i] ?? 0), 0)

  const priceBoxRows: PriceRow[] = CATEGORIES.map((cat, i) => ({
    name: cat.name,
    imageUrl: cat.imageUrl,
    value: unitTotals[i] ?? 0,
  }))

  return (
    <div className="bg-[var(--grey-50,#f5f5f5)] min-h-screen">

      <div className="mx-auto w-full max-w-[800px]">

        {/* ─── Контент ─── */}
        <div className="w-full">

          {/* Хедер: заголовок + переключатели */}
          <div className="flex flex-wrap items-center gap-[var(--gap-2xs,8px)] px-[var(--pad-m,24px)] pt-[var(--pad-m,24px)] mx-[var(--gap-3xs,4px)]">
            <p className="flex-1 min-w-[200px] font-inter font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] text-[color:var(--grey-850,#313131)]">
              Калькулятор ремонта ПВЗ
            </p>
            <div className="flex items-center gap-[var(--gap-2xs,8px)] shrink-0">
              {/* Версия 1/2 */}
              <div className="flex items-center gap-[2px] p-[2px] rounded-[8px] bg-[var(--grey-0,white)] border border-[var(--grey-150,#e0e0e0)]">
                {([1, 2] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setLayoutVersion(v)}
                    className={
                      'px-2 py-[3px] rounded-[6px] font-inter font-normal text-[14px] leading-5 cursor-pointer transition-colors ' +
                      (layoutVersion === v
                        ? 'bg-[var(--grey-850,#313131)] text-white'
                        : 'text-[var(--grey-850,#313131)] hover:bg-[var(--grey-100,#ebebeb)]')
                    }
                  >
                    {v}
                  </button>
                ))}
              </div>
              <ModeSwitcher />
            </div>
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

              {/* Клиентская зона + Склад */}
              <div className="flex flex-col min-[480px]:flex-row gap-[var(--gap-m,32px)]">
                <div className="flex-1 min-w-0 flex flex-col gap-[var(--gap-3xs,4px)]">
                  <p className="font-inter font-normal text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)] text-[color:var(--grey-600,#7b7b7b)]">
                    Клиентская зона
                  </p>
                  <div className="flex items-start gap-[var(--gap-2xs,8px)]">
                    <div className="flex-1 min-w-0">
                      <Input value={clientStr} onChange={handleClientChange} placeholder="23" unit="м²" />
                    </div>
                    <IcControl icon="ic-minus" color="grey" size="m" onClick={() => handleClientChange(String(Math.max(0, clientVal - 1)))} />
                    <IcControl icon="ic-plus" color="grey" size="m" onClick={() => handleClientChange(String(clientVal + 1))} />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-[var(--gap-3xs,4px)]">
                  <p className="font-inter font-normal text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)] text-[color:var(--grey-600,#7b7b7b)]">
                    Склад
                  </p>
                  <div className="flex items-start gap-[var(--gap-2xs,8px)]">
                    <div className="flex-1 min-w-0">
                      <Input value={storageStr} onChange={handleStorageChange} placeholder="12" unit="м²" />
                    </div>
                    <IcControl icon="ic-minus" color="grey" size="m" onClick={() => handleStorageChange(String(Math.max(0, storageVal - 1)))} />
                    <IcControl icon="ic-plus" color="grey" size="m" onClick={() => handleStorageChange(String(storageVal + 1))} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Свободная планировка */}
            <ToggleSection
              checked={freeLayout}
              onChange={setFreeLayout}
              description="Включите, если помещение без комнат и нужна перегородка"
            />

            {/* 3. Высота потолков */}
            <div className="flex flex-col gap-[var(--gap-xs,12px)]">
              <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
                Высота потолков
              </p>
              <div className="flex flex-col gap-[var(--gap-xs,12px)]">
                <div className="flex items-start gap-[var(--gap-2xs,8px)]">
                  <div className="flex-1 min-w-0">
                    <Input value={ceilingMm} onChange={setCeilingMm} placeholder="3000" unit="мм" />
                  </div>
                  <IcControl icon="ic-minus" color="grey" size="m" onClick={handleCeilingDecrement} />
                  <IcControl icon="ic-plus" color="grey" size="m" onClick={handleCeilingIncrement} />
                </div>
                <div className="flex gap-[var(--gap-2xs,8px)] flex-wrap">
                  {CEILING_PRESETS.map(p => (
                    <Chip key={p} color="grey" onClick={() => setCeilingMm(p)}>
                      {p}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Текущее состояние */}
            <div className="flex flex-col gap-[var(--gap-xs,12px)]">
              <div className="flex items-center gap-[var(--gap-2xs,8px)]">
                <p className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
                  Текущее состояние
                </p>
                <Ic icon="ic-question" />
              </div>
              <div className="flex flex-col gap-[var(--gap-2xs,8px)]">
                {CONDITIONS.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setCondition(i)}
                    className="flex items-center gap-[var(--gap-s,16px)] w-full p-[var(--gap-s,16px)] rounded-[var(--round-m,16px)] bg-[var(--grey-0,white)] cursor-pointer text-left transition-colors hover:bg-[var(--grey-50,#f5f5f5)]"
                  >
                    <div className={
                      'shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ' +
                      (condition === i
                        ? 'border-[var(--purple-500,#9744eb)]'
                        : 'border-[var(--grey-300,#c2c2c2)]')
                    }>
                      {condition === i && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--purple-500,#9744eb)]" />
                      )}
                    </div>
                    <span className="font-inter font-medium text-[length:var(--f-size-m,18px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)]">
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Заголовок раздела сметы */}
          <div className="flex items-center justify-between gap-[var(--gap-2xs,8px)] px-[var(--pad-l,32px)] pt-[40px] pb-[var(--gap-3xs,4px)] mx-[var(--gap-3xs,4px)]">
            <p className="font-inter font-semibold text-[length:var(--f-size-xl,30px)] leading-[var(--f-lh-l,40px)] text-[color:var(--grey-850,#313131)]">
              Расчет
            </p>
            <Chip size="s" color="secondary" interactive={false}>включены материалы и работы</Chip>
          </div>

          {/* Категории + Баннер — на мобиле до краёв, на 800px+ с паддингом */}
          <div className="flex flex-col gap-[var(--gap-3xs,4px)] mx-[var(--gap-3xs,4px)] px-0 min-[640px]:px-[var(--pad-m,24px)]">
            {CATEGORIES.map((cat, i) => (
              <CalculationUnit
                key={i}
                name={cat.name}
                nameNode={undefined}
                imageUrl={cat.imageUrl}
                onTotalChange={callbacksRef.current[i]}
                sections={categorySections[i]}
                flatMaterials={cat.name === 'Мебель' ? mebelItems : undefined}
                canExpand={true}
                initialEnabled={true}
                toggleLeft={layoutVersion === 2}
              />
            ))}
            <Banner />
          </div>

          {/* Отступ под прибитый PriceBox */}
          <div className="h-[320px]" />

        </div>

      </div>

      {/* PriceBox — всегда fixed снизу, max-w-[800px] по центру */}
      {/* bg-[var(--grey-50)] закрывает safe-area-inset-bottom под скруглёнными углами в Telegram/iOS */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex justify-center overflow-x-clip bg-[var(--grey-50,#f5f5f5)]">
        <div className="w-full max-w-[800px]">
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

    </div>
  )
}

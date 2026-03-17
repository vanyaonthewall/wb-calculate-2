import { useCallback, useRef, useState } from 'react'
import { StepOne } from './StepOne'
import { StepTwo, type Step2Params } from './StepTwo'
import { StepThree } from './StepThree'
import { PriceBox } from './PriceBox'
import type { PriceRow } from './PriceBox'

export function CalcPage() {
  const [calcPage, setCalcPage] = useState<1 | 2 | 3>(1)
  const [step1Live, setStep1Live] = useState<{
    areaStr: string
    freeLayout: boolean
    condition: number
    rows: PriceRow[]
    total: number
  }>({ areaStr: '35', freeLayout: false, condition: 0, rows: [], total: 0 })
  const [step2Total, setStep2Total] = useState(0)
  const [step2Params, setStep2Params] = useState<Step2Params>({ ceiling: 1, electricity: 1, walls: 0, toilet: 0, freeLayout: false })
  const [step3Total, setStep3Total] = useState<number | null>(null)
  // После возврата с экрана 3 — «замораживаем» его итог, чтобы цена не прыгала
  const [frozenFromStep3, setFrozenFromStep3] = useState<number | null>(null)

  const handleGoToStep3 = () => {
    setFrozenFromStep3(null)
    setCalcPage(3)
  }
  const handleBackFromStep3 = () => {
    setFrozenFromStep3(step3Total)
    setCalcPage(2)
  }

  // Стабильная ссылка: без useCallback StepTwo видел бы новую функцию на каждом рендере
  // и перезапускал свой useEffect, сбрасывая frozenFromStep3 при каждом ре-рендере.
  const step2ParamsRef = useRef(step2Params)
  const handleStep2ParamsChange = useCallback((params: Step2Params) => {
    const prev = step2ParamsRef.current
    step2ParamsRef.current = params
    // Сброс заморозки только если параметры реально изменились
    if (
      prev.ceiling     !== params.ceiling     ||
      prev.electricity !== params.electricity ||
      prev.walls       !== params.walls       ||
      prev.toilet      !== params.toilet      ||
      prev.freeLayout  !== params.freeLayout
    ) {
      setFrozenFromStep3(null)
    }
    setStep2Params(params)
  }, [])

  const activeTotal = calcPage >= 2
    ? (frozenFromStep3 !== null ? frozenFromStep3 : (step2Total > 0 ? step2Total : step1Live.total))
    : step1Live.total
  const priceBoxTotal = calcPage === 3 && step3Total !== null ? step3Total : activeTotal
  const priceBoxRows = step1Live.rows

  return (
    <div className="h-dvh flex flex-col bg-[var(--grey-50,#f5f5f5)] sm:items-center">

      <div id="calc-overlay-target" className="flex-1 relative min-h-0 w-full sm:max-w-[640px]">

        {/* Скользящий контент — заполняет весь контейнер */}
        <div className="absolute inset-0 overflow-hidden">

          {/* Стр. 1 */}
          <div className="absolute inset-0">
            <StepOne onLiveChange={setStep1Live} />
          </div>

          {/* Стр. 2 */}
          <div
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{
              transform:
                calcPage < 2
                  ? 'translateX(100%)'
                  : calcPage === 2
                  ? 'translateX(0)'
                  : 'translateX(-100%)',
            }}
          >
            <StepTwo
              areaStr={step1Live.areaStr}
              freeLayout={step1Live.freeLayout}
              condition={step1Live.condition}
              onBack={() => setCalcPage(1)}
              onTotalChange={setStep2Total}
              onParamsChange={handleStep2ParamsChange}
            />
          </div>

          {/* Стр. 3 */}
          <div
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{ transform: calcPage >= 3 ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <StepThree
              areaStr={step1Live.areaStr}
              rows={priceBoxRows}
              globalTotal={activeTotal}
              condition={step1Live.condition}
              step2Params={step2Params}
              onClose={() => setCalcPage(1)}
              onTotalChange={setStep3Total}
            />
          </div>

        </div>

        {/* PriceBox — прибит к низу поверх контента */}
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <PriceBox
            rows={priceBoxRows}
            total={priceBoxTotal}
            page="2nd-3rd"
            showList={calcPage <= 2}
            showBtBack={calcPage === 3}
            ctaText={
              calcPage === 1
                ? 'Сформировать смету'
                : calcPage === 2
                ? 'Перейти к смете'
                : 'Скачать в PDF'
            }
            onCtaClick={
              calcPage === 1
                ? () => setCalcPage(2)
                : calcPage === 2
                ? handleGoToStep3
                : undefined
            }
            onBackClick={calcPage === 3 ? handleBackFromStep3 : undefined}
          />
        </div>

      </div>
    </div>
  )
}

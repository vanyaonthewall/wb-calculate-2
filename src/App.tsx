import { useState } from 'react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Chip } from './components/Chip'
import { Toggle } from './components/Toggle'
import { Radio } from './components/Radio'
import { SegmentControl } from './components/SegmentControl'
import { Ic } from './components/Ic'
import { IcControl } from './components/IcControl'
import { Card } from './components/Card'
import { Icon } from './components/Icon'
import { CalculationUnit } from './components/CalculationUnit'
import { PriceBox } from './components/PriceBox'
import { StepOne } from './components/StepOne'
import { StepTwo } from './components/StepTwo'
import { StepThree } from './components/StepThree'
import { ToggleSection } from './components/ToggleSection'
import type { PriceRow } from './components/PriceBox'

const TYPOGRAPHY = [
  { name: 'H1',           font: 'font-unbounded', weight: 'font-semibold', size: 'text-[length:var(--f-size-2xl,44px)]', lh: 'leading-[var(--f-lh-xl,48px)]',  sample: 'Заголовок' },
  { name: 'H2',           font: 'font-unbounded', weight: 'font-semibold', size: 'text-[length:var(--f-size-xl,30px)]',  lh: 'leading-[var(--f-lh-l,40px)]',   sample: 'Заголовок' },
  { name: 'H3',           font: 'font-unbounded', weight: 'font-bold',     size: 'text-[length:var(--f-size-l,20px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Заголовок' },
  { name: 'H4',           font: 'font-inter',     weight: 'font-semibold', size: 'text-[length:var(--f-size-l,20px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Заголовок' },
  { name: 'text-m',       font: 'font-inter',     weight: 'font-normal',   size: 'text-[length:var(--f-size-m,18px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-m-bold',  font: 'font-inter',     weight: 'font-medium',   size: 'text-[length:var(--f-size-m,18px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-s',       font: 'font-inter',     weight: 'font-normal',   size: 'text-[length:var(--f-size-s,16px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-s-bold',  font: 'font-inter',     weight: 'font-semibold', size: 'text-[length:var(--f-size-s,16px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: 'Пример текста' },
  { name: 'text-numbers', font: 'font-inter',     weight: 'font-semibold', size: 'text-[length:var(--f-size-s,16px)]',   lh: 'leading-[var(--f-lh-m,24px)]',   sample: '1 234 567', features: true },
  { name: 'text-xs',      font: 'font-inter',     weight: 'font-normal',   size: 'text-[length:var(--f-size-xs,14px)]',  lh: 'leading-[var(--f-lh-s,20px)]',   sample: 'Мелкий текст' },
] as const

function TokenBadge({ label }: { label: string }) {
  return (
    <span className="font-mono text-[11px] text-[color:var(--purple-500,#9744eb)] bg-[var(--secondary-purple-500,#eadafb)] px-1.5 py-0.5 rounded">
      {label}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-unbounded font-bold text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-850,#313131)] mb-[var(--gap-s,16px)]">
        {title}
      </h2>
      <div className="bg-white rounded-[var(--round-m,16px)] p-[var(--pad-m,24px)]">
        {children}
      </div>
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-[var(--gap-xs,12px)]">{children}</div>
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-inter text-[10px] text-[color:var(--grey-500,#999)] select-none">{children}</span>
}

export default function App() {
  const [mode, setMode] = useState<'comfort' | 'tiny'>('comfort')
  const [viewIdx, setViewIdx] = useState(0) // 0=calculator, 1=system, 2=logic
  const [calcPage, setCalcPage] = useState<1 | 2 | 3>(1)
  const [step1Live, setStep1Live] = useState<{ areaStr: string; freeLayout: boolean; rows: PriceRow[]; total: number }>({ areaStr: '35', freeLayout: false, rows: [], total: 0 })
  const [step2Total, setStep2Total] = useState(0)
  const [step3Total, setStep3Total] = useState(0)

  const activeTotal = step2Total > 0 ? step2Total : step1Live.total
  const priceBoxTotal = calcPage === 3 && step3Total > 0 ? step3Total : activeTotal
  const priceBoxRows  = step1Live.rows
  const [toggle, setToggle] = useState(false)
  const [radio, setRadio] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [segment, setSegment] = useState(0)
  const [selectedCard, setSelectedCard] = useState<number>(0)
  const [toggleSection, setToggleSection] = useState(true)

  const handleMode = (m: 'comfort' | 'tiny') => {
    setMode(m)
    document.documentElement.dataset.mode = m === 'tiny' ? 'tiny' : ''
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--grey-50,#f5f5f5)] px-[var(--pad-l,32px)] py-[var(--pad-l,32px)]">

      {/* Header */}
      <div className="max-w-2xl mx-auto mb-[var(--gap-m,32px)]">
        <h1 className="font-unbounded font-semibold text-[length:var(--f-size-2xl,44px)] leading-[var(--f-lh-xl,48px)] text-[color:var(--grey-850,#313131)]">
          WB&nbsp;Калькулятор
        </h1>
        <div className="flex gap-2 mt-3">
          <SegmentControl
            options={['Калькулятор', 'Система', 'Логика']}
            value={viewIdx}
            onChange={setViewIdx}
          />
          <SegmentControl
            options={['Просторный', 'Плотный']}
            value={mode === 'comfort' ? 0 : 1}
            onChange={i => handleMode(i === 0 ? 'comfort' : 'tiny')}
            variant="dark"
          />
        </div>
      </div>

      {viewIdx === 0 && (
        <div className="flex-1 flex items-center justify-center">
          {/* iPhone 17 frame — 402×874 */}
          <div
            style={{ width: 402, height: 874 }}
            className="relative bg-[var(--grey-50,#f5f5f5)] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden flex-shrink-0 rounded-[var(--round-l,24px)]"
          >
            {/* Dynamic Island */}
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-full z-10" />
            {/* Контент-область ниже Dynamic Island — flex col: скользящий контент + единый PriceBox */}
            <div className="absolute inset-0 top-[62px] flex flex-col">

              {/* Скользящий контент — все три страницы */}
              <div className="flex-1 relative">

                {/* Стр. 1 — базовый слой */}
                <div className="absolute inset-0">
                  <StepOne onLiveChange={setStep1Live} />
                </div>

                {/* Стр. 2 — въезжает справа, уходит влево при переходе на стр. 3 */}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-in-out"
                  style={{
                    transform: calcPage < 2
                      ? 'translateX(100%)'
                      : calcPage === 2
                      ? 'translateX(0)'
                      : 'translateX(-100%)',
                  }}
                >
                  <StepTwo
                    areaStr={step1Live.areaStr}
                    freeLayout={step1Live.freeLayout}
                    onBack={() => setCalcPage(1)}
                    onTotalChange={setStep2Total}
                  />
                </div>

                {/* Стр. 3 — въезжает справа */}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-in-out"
                  style={{ transform: calcPage >= 3 ? 'translateX(0)' : 'translateX(100%)' }}
                >
                  <StepThree
                    areaStr={step1Live.areaStr}
                    rows={priceBoxRows}
                    globalTotal={activeTotal}
                    onClose={() => setCalcPage(1)}
                    onTotalChange={setStep3Total}
                  />
                </div>

              </div>

              {/* Единый PriceBox — всегда прибит к низу, меняет состояние по странице */}
              <div className="shrink-0 relative z-10">
                <PriceBox
                  rows={priceBoxRows}
                  total={priceBoxTotal}
                  page="2nd-3rd"
                  showList={calcPage <= 2}
                  showBtBack={calcPage === 3}
                  ctaText={
                    calcPage === 1 ? 'Сформировать смету' :
                    calcPage === 2 ? 'Перейти к смете' :
                    'Скачать в PDF'
                  }
                  onCtaClick={
                    calcPage === 1 ? () => setCalcPage(2) :
                    calcPage === 2 ? () => setCalcPage(3) :
                    undefined
                  }
                  onBackClick={calcPage === 3 ? () => setCalcPage(2) : undefined}
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {viewIdx === 1 && (
      <div className="max-w-2xl mx-auto space-y-[var(--gap-m,32px)]">

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-[var(--gap-xs,12px)]">
            {TYPOGRAPHY.map((t) => (
              <div key={t.name} className="flex items-baseline gap-[var(--gap-s,16px)]">
                <span className="w-28 shrink-0 font-inter text-xs text-[color:var(--grey-500,#999)]">{t.name}</span>
                <span
                  className={`${t.font} ${t.weight} ${t.size} ${t.lh} text-[color:var(--grey-850,#313131)] flex-1`}
                  style={'features' in t ? { fontFeatureSettings: "'lnum' 1, 'tnum' 1" } : undefined}
                >
                  {t.sample}
                </span>
                <span className="shrink-0 flex gap-1 flex-wrap justify-end">
                  <TokenBadge label={t.size.match(/--[\w-]+/)?.[0]?.replace('--', '') ?? ''} />
                  <TokenBadge label={t.lh.match(/--[\w-]+/)?.[0]?.replace('--', '') ?? ''} />
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Icons */}
        <Section title="Icons">
          <Row>
            {(['ic-plus','ic-minus','ic-close','ic-pencil','ic-question','ic-list','ic-chevron','ic-back'] as const).map((name) => (
              <div key={name} className="flex flex-col items-center gap-1">
                <Icon name={name} size={24} className="text-[color:var(--grey-850,#313131)]" />
                <span className="font-mono text-[9px] text-[color:var(--grey-500,#999)]">{name.replace('ic-','')}</span>
              </div>
            ))}
          </Row>
        </Section>

        {/* Ic */}
        <Section title="Ic — icon states">
          <Row>
            {(['default','hover','active'] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <Ic icon="ic-question" state={s} />
                <Label>{s}</Label>
              </div>
            ))}
          </Row>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="grey-700 / grey-800 / grey-850" />
          </div>
        </Section>

        {/* IcControl */}
        <Section title="IcControl">
          <div className="space-y-[var(--gap-s,16px)]">
            <div>
              <Label>grey</Label>
              <Row>
                {(['s','m','l'] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-minus" color="grey" size={s} />
                    <Label>{s}</Label>
                  </div>
                ))}
                {(['active','disable'] as const).map((st) => (
                  <div key={st} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-minus" color="grey" size="m" state={st} />
                    <Label>{st}</Label>
                  </div>
                ))}
              </Row>
            </div>
            <div>
              <Label>secondary</Label>
              <Row>
                {(['s','m','l'] as const).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-plus" color="secondary" size={s} />
                    <Label>{s}</Label>
                  </div>
                ))}
                {(['active','disable'] as const).map((st) => (
                  <div key={st} className="flex flex-col items-center gap-1 mt-2">
                    <IcControl icon="ic-plus" color="secondary" size="m" state={st} />
                    <Label>{st}</Label>
                  </div>
                ))}
              </Row>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="inset-s/m/xl → padding" />
            <TokenBadge label="round-xs / round-m → border-radius" />
          </div>
        </Section>

        {/* Button */}
        <Section title="Button">
          <Button>Рассчитать стоимость</Button>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="inset-xl → py" />
            <TokenBadge label="round-s → border-radius" />
            <TokenBadge label="f-size-l + f-lh-m" />
          </div>
        </Section>

        {/* Input */}
        <Section title="Input">
          <div className="space-y-[var(--gap-xs,12px)]">
            <Input value={inputVal} onChange={setInputVal} placeholder="25" unit="м²" />
            <p className="font-inter text-xs text-[color:var(--grey-500,#999)]">
              Только цифры и десятичный разделитель (. или ,)
            </p>
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="inset-l → px" />
              <TokenBadge label="inset-m → py" />
              <TokenBadge label="round-s → border-radius" />
              <TokenBadge label="f-size-m + f-lh-m" />
            </div>
          </div>
        </Section>

        {/* Segment Control */}
        <Section title="Segment Control">
          <div className="space-y-[var(--gap-xs,12px)]">
            <SegmentControl options={['Косметика', 'White box', 'Бетон']} value={segment} onChange={setSegment} />
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="inset-2xs → container padding" />
              <TokenBadge label="inset-s → segment padding" />
              <TokenBadge label="round-full → border-radius" />
              <TokenBadge label="f-size-m + f-lh-m" />
            </div>
          </div>
        </Section>

        {/* Card */}
        <Section title="Card">
          <div className="space-y-[var(--gap-xs,12px)]">
            <Card
              header="Только покраска"
              subText="Подходит, если ваше помещение уже разделено комнатами"
              selected={selectedCard === 0}
              onChange={() => setSelectedCard(0)}
            />
            <Card
              header="White box"
              subText="Черновая отделка: стяжка пола, штукатурка стен, разводка коммуникаций"
              selected={selectedCard === 1}
              onChange={() => setSelectedCard(1)}
            />
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="pad-s → padding" />
              <TokenBadge label="round-m → border-radius" />
              <TokenBadge label="gap-xs → radio + content" />
              <TokenBadge label="gap-s → header + subtext" />
              <TokenBadge label="f-size-l (H3) + f-size-xs (text-xs)" />
            </div>
          </div>
        </Section>

        {/* Chips */}
        <Section title="Chip">
          <Row>
            <Chip color="grey">Косметика</Chip>
            <Chip color="grey">White box</Chip>
            <Chip color="secondary">Косметика</Chip>
            <Chip color="secondary">White box</Chip>
          </Row>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="inset-l → px" />
            <TokenBadge label="inset-xs → py" />
            <TokenBadge label="round-xs → border-radius" />
            <TokenBadge label="f-size-s + f-lh-m" />
          </div>
        </Section>

        {/* Controls */}
        <Section title="Controls">
          <Row>
            <span className="font-inter text-[color:var(--grey-700,#5e5e5e)] text-[length:var(--f-size-s,16px)]">Toggle</span>
            <Toggle checked={toggle} onChange={setToggle} />
            <Label>{toggle ? 'on' : 'off'}</Label>
            <span className="w-4" />
            <span className="font-inter text-[color:var(--grey-700,#5e5e5e)] text-[length:var(--f-size-s,16px)]">Radio</span>
            <Radio checked={radio} onChange={setRadio} />
            <Label>{radio ? 'on' : 'off'}</Label>
          </Row>
          <div className="flex gap-2 flex-wrap pt-[var(--gap-xs,12px)]">
            <TokenBadge label="round-full → border-radius" />
          </div>
        </Section>

        {/* Toggle Section */}
        <Section title="Toggle Section">
          <div className="space-y-[var(--gap-xs,12px)]">
            <ToggleSection checked={toggleSection} onChange={setToggleSection} />
            <div className="flex gap-2 flex-wrap">
              <TokenBadge label="gap-s → padding" />
              <TokenBadge label="gap-xs → toggle + text" />
              <TokenBadge label="round-m → border-radius" />
              <TokenBadge label="f-size-m (title) + f-size-xs (desc)" />
            </div>
          </div>
        </Section>

        {/* Calculation Unit */}
        <Section title="Calculation Unit">
          <CalculationUnit />
        </Section>

        {/* Price Box */}
        <Section title="Price Box">
          <PriceBox />
        </Section>

      </div>
      )}

    </div>
  )
}

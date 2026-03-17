import React, { useEffect, useRef } from 'react'
// @ts-expect-error — библиотека без типов
import useOdometer from 'use-odometer'
import 'odometer/themes/odometer-theme-default.css'

/** Число с анимацией rAF (без одометра) — expo-out, нет ведущих нулей, безопасно в React 18. */
export function CountUpNumber({
  value,
  className,
  style,
  duration = 650,
}: {
  value: number
  className?: string
  style?: React.CSSProperties
  duration?: number
}) {
  const [displayVal, setDisplayVal] = React.useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef<number>()

  useEffect(() => {
    const from = fromRef.current
    const startTime = performance.now()
    const animate = () => {
      const t = Math.min((performance.now() - startTime) / duration, 1)
      const ease = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t) // expo-out
      const current = Math.round(from + (value - from) * ease)
      fromRef.current = current
      setDisplayVal(current)
      if (t < 1) rafRef.current = requestAnimationFrame(animate)
    }
    cancelAnimationFrame(rafRef.current!)
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current!)
  }, [value, duration])

  const formatted = displayVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
  return <span className={className} style={style}>{formatted}</span>
}

/** Цена с CountUpNumber анимацией и символом ₽ — без ведущих нулей. */
export function CountUpPrice({
  value,
  className,
  style,
}: {
  value: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={className} style={style}>
      <CountUpNumber value={value} />
      {' ₽'}
    </span>
  )
}

/** Анимированное число (одометр). Не принимает children — DOM управляет odometer. */
export function AnimatedNumber({
  value,
  className,
  style,
  format = '( ddd)',
  duration = 650,
}: {
  value: number
  className?: string
  style?: React.CSSProperties
  format?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useOdometer(ref, value, { format, duration })
  return <span ref={ref} className={className} style={style} />
}

/** Цена с анимацией и символом ₽. */
export function AnimatedPrice({
  value,
  className,
  style,
}: {
  value: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span className={className} style={style}>
      <AnimatedNumber value={value} />
      {' ₽'}
    </span>
  )
}

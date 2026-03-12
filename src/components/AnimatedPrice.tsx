import React, { useRef } from 'react'
// @ts-expect-error — библиотека без типов
import useOdometer from 'use-odometer'
import 'odometer/themes/odometer-theme-default.css'

/** Анимированное число (одометр). Не принимает children — DOM управляет odometer. */
export function AnimatedNumber({
  value,
  className,
  style,
  format = '( ddd)',
  duration = 350,
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

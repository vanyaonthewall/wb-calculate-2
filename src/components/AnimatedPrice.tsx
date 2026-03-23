import React from 'react'

/** Число — мгновенная смена, без анимации. */
export function CountUpNumber({
  value,
  className,
  style,
}: {
  value: number
  className?: string
  style?: React.CSSProperties
  duration?: number
}) {
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')
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

/** Анимированное число (CountUp/RAF, без odometer-крутилки). */
export function AnimatedNumber({
  value,
  className,
  style,
}: {
  value: number
  className?: string
  style?: React.CSSProperties
  format?: string
  duration?: number
}) {
  return <CountUpNumber value={value} className={className} style={style} />
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

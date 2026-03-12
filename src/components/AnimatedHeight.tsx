import { useEffect, useRef, ReactNode } from 'react'

/** Accordion-обёртка с анимацией высоты.
 *  Контент всегда смонтирован — анимация работает через CSS height + JS-измерение. */
export function AnimatedHeight({
  open,
  children,
}: {
  open: boolean
  children: ReactNode
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const prevOpen = useRef(open)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const wasOpen = prevOpen.current
    prevOpen.current = open
    if (open === wasOpen) return

    if (open) {
      // Открытие: измеряем высоту, анимируем 0 → fullH с bounce
      const fullH = el.scrollHeight
      el.style.transition = 'none'
      el.style.height = '0px'
      el.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'height 0.35s ease-in'
          el.style.height = fullH + 'px'

          el.addEventListener(
            'transitionend',
            () => {
              el.style.height = 'auto'
              el.style.overflow = ''
              el.style.transition = ''
            },
            { once: true }
          )
        })
      })
    } else {
      // Закрытие: фиксируем высоту, анимируем fullH → 0 с ease-out
      const fullH = el.scrollHeight
      el.style.transition = 'none'
      el.style.height = fullH + 'px'
      el.style.overflow = 'hidden'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'height 0.35s ease-in-out'
          el.style.height = '0px'
        })
      })
    }
  }, [open])

  return (
    <div
      ref={wrapRef}
      style={
        open
          ? { height: 'auto' }
          : { height: 0, overflow: 'hidden' }
      }
    >
      {children}
    </div>
  )
}

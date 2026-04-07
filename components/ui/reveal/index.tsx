'use client'

import cn from 'clsx'
import type { ComponentProps } from 'react'
import { useReveal } from '@/hooks/use-reveal'
import s from './reveal.module.css'

interface RevealProps extends ComponentProps<'div'> {
  delay?: number
}

export function Reveal({
  children,
  className,
  delay,
  style,
  ...props
}: RevealProps) {
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className={cn(s.reveal, visible && s.visible, className)}
      style={
        delay !== undefined
          ? { ...style, transitionDelay: `${delay}ms` }
          : style
      }
      {...props}
    >
      {children}
    </div>
  )
}

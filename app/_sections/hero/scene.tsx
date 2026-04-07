'use client'

import { useEffect, useRef } from 'react'

const NODE_COUNT = 90
const CONNECTION_DISTANCE = 160
const SPEED = 0.25

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Keep non-null refs for use inside nested functions
    const safeCtx = ctx
    const safeCanvas = canvas

    let width = 0
    let height = 0
    let rafId = 0
    let particles: Particle[] = []

    function initParticles() {
      particles = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() > 0.8 ? 2.5 : 1.5,
      }))
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1
      width = safeCanvas.offsetWidth
      height = safeCanvas.offsetHeight
      safeCanvas.width = width * dpr
      safeCanvas.height = height * dpr
      safeCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    function draw() {
      safeCtx.clearRect(0, 0, width, height)

      const ox = mouse.current.x * 18
      const oy = mouse.current.y * 12

      // Connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        if (!a) continue
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          if (!b) continue
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.22
            safeCtx.beginPath()
            safeCtx.moveTo(a.x + ox, a.y + oy)
            safeCtx.lineTo(b.x + ox, b.y + oy)
            safeCtx.strokeStyle = `rgba(109,40,217,${alpha})`
            safeCtx.lineWidth = 0.6
            safeCtx.stroke()
          }
        }
      }

      // Nodes
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        safeCtx.beginPath()
        safeCtx.arc(p.x + ox, p.y + oy, p.r, 0, Math.PI * 2)
        const bright =
          p.r > 2 ? 'rgba(196,181,253,0.9)' : 'rgba(139,92,246,0.75)'
        safeCtx.fillStyle = bright
        safeCtx.fill()

        // Soft glow on larger nodes
        if (p.r > 2) {
          safeCtx.beginPath()
          safeCtx.arc(p.x + ox, p.y + oy, p.r * 3, 0, Math.PI * 2)
          const grad = safeCtx.createRadialGradient(
            p.x + ox,
            p.y + oy,
            0,
            p.x + ox,
            p.y + oy,
            p.r * 3
          )
          grad.addColorStop(0, 'rgba(139,92,246,0.18)')
          grad.addColorStop(1, 'rgba(139,92,246,0)')
          safeCtx.fillStyle = grad
          safeCtx.fill()
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5
      mouse.current.y = e.clientY / window.innerHeight - 0.5
    }

    const ro = new ResizeObserver(resize)
    ro.observe(safeCanvas)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    resize()
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

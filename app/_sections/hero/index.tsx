'use client'

import dynamic from 'next/dynamic'
import { Link } from '@/components/ui/link'
import s from './hero.module.css'

const HeroScene = dynamic(() => import('./scene').then((m) => m.HeroScene), {
  ssr: false,
})

export function Hero() {
  return (
    <section className={s.root} id="hero" aria-label="Introduction">
      <div className={s.noise} aria-hidden="true" />
      <div className={s.canvas} aria-hidden="true">
        <HeroScene />
      </div>

      <div className={s.content}>
        <p className={s.eyebrow}>
          Based in the UK &mdash; Open to opportunities
        </p>

        <h1 className={s.heading}>
          Hey.
          <br />
          I&apos;m Aidan.
        </h1>

        <p className={s.subheading}>
          I break things so <em>clients</em> don&apos;t have to.
        </p>

        <p className={s.body}>
          CrowdStrike engineer by day &mdash; wrangling API integrations and
          SIEM implementations so enterprise security teams don&apos;t have to
          lose sleep. Shipping open-source projects when I probably should be
          sleeping.
        </p>

        <div className={s.actions}>
          <Link href="#projects" className={s.btnPrimary}>
            See my work →
          </Link>
          <Link href="#contact" className={s.btnSecondary}>
            Get in touch
          </Link>
        </div>
      </div>

      <div className={s.scrollHint} aria-hidden="true">
        scroll
      </div>
    </section>
  )
}

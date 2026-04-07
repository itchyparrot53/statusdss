import { Link } from '@/components/ui/link'
import s from './hero.module.css'

export function Hero() {
  return (
    <section className={s.root} id="hero" aria-label="Introduction">
      {/* ── Animated CSS background ── */}
      <div className={s.bg} aria-hidden="true">
        <div className={s.orb1} />
        <div className={s.orb2} />
        <div className={s.orb3} />
        <div className={s.dotGrid} />
        <div className={s.scanLines} />
        <div className={s.noise} />
        <div className={s.vignette} />
      </div>

      {/* ── Content — sits in grid row 2, vertically centred ── */}
      <div className={s.contentArea}>
        <div className={s.content}>
          <p className={s.eyebrow}>
            Based in the UK &mdash; Open to opportunities
            <span className={s.cursor} aria-hidden="true" />
          </p>

          <h1 className={s.heading}>
            Hey.
            <br />
            <span className={s.headingAccent}>I&apos;m Aidan.</span>
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
      </div>

      <div className={s.scrollHint} aria-hidden="true">
        scroll
      </div>
    </section>
  )
}

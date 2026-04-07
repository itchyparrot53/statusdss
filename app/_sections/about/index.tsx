import { Link } from '@/components/ui/link'
import { Reveal } from '@/components/ui/reveal'
import s from './about.module.css'

const STATS = [
  { value: '6+', label: 'Years in Cyber' },
  { value: '40K+', label: 'Docker Pulls' },
  { value: '300+', label: 'GitHub Stars' },
] as const

export function About() {
  return (
    <section className={s.root} id="about" aria-label="About Aidan">
      <Reveal>
        <div>
          <p className={s.label}>About</p>
          <h2 className={s.heading}>
            Self-taught.
            <br />
            <span>Cyber-obsessed.</span>
            <br />
            Occasional open&#8209;source menace.
          </h2>

          <div className={s.stats}>
            {STATS.map((stat) => (
              <div key={stat.label} className={s.statItem}>
                <span className={s.statValue}>{stat.value}</span>
                <span className={s.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

          <hr className={s.divider} />
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className={s.body}>
          <p>
            I&apos;ve spent the last several years working at the sharp end of
            cybersecurity &mdash; first at Bulletproof, then Defense.com, and
            now at <strong>CrowdStrike</strong>, where I work on API
            integrations and SIEM implementations for enterprise clients. I know
            my way around a security stack, and I&apos;ve got the Kafka logs to
            prove it.
          </p>
          <p>
            When I&apos;m not on a client call or elbow-deep in Elasticsearch,
            I&apos;m building things. <strong>ListSync</strong> started as a
            weekend itch &mdash; a tool to sync my watchlists automatically. It
            ended up with 300+ GitHub stars and 40,000 Docker pulls. Turns out
            other people had the same itch.
          </p>
          <p>
            I&apos;m a self-taught developer who learns by shipping. I pick up
            whatever the job needs &mdash; Python, Docker, Vue, a bit of React
            &mdash; and I&apos;m always working on something new. Based in the
            UK. Usually caffeinated.
          </p>

          <div className={s.links}>
            <div className={s.linkGroup}>
              <p className={s.linkGroupLabel}>Find me online</p>
              <Link
                href="https://github.com/itchyparrot53"
                target="_blank"
                rel="noopener noreferrer"
                className={s.socialLink}
              >
                GitHub &mdash; itchyparrot53
              </Link>
              <Link
                href="https://www.linkedin.com/in/aidan-munns-359811139"
                target="_blank"
                rel="noopener noreferrer"
                className={s.socialLink}
              >
                LinkedIn &mdash; Aidan Munns
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

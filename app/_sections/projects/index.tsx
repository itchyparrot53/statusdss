import { Image } from '@/components/ui/image'
import { Link } from '@/components/ui/link'
import s from './projects.module.css'

const LISTSYNC_DASHBOARD =
  'https://s.2ya.me/api/shares/7efcbyD3/files/312d01e4-ff3d-4a96-839d-dfd4f5d40797'

const TAGS = ['Python', 'Docker', 'Vue 3', 'FastAPI', 'Open Source']

const STATS = [
  { value: '312+', label: 'GitHub Stars' },
  { value: '40K+', label: 'Docker Pulls' },
  { value: '31K+', label: 'Downloads' },
]

export function Projects() {
  return (
    <section className={s.root} id="projects" aria-label="Projects">
      <div className={s.header}>
        <p className={s.label}>Projects</p>
        <h2 className={s.heading}>Things I&apos;ve shipped.</h2>
      </div>

      {/* ListSync — featured project */}
      <article className={s.card}>
        <div className={s.imageWrap}>
          <Image
            src={LISTSYNC_DASHBOARD}
            alt="ListSync web dashboard"
            fill
            className={s.image}
            unoptimized
          />
          <div className={s.imageBadge}>
            <span className={s.badge}>Open Source</span>
            <span className={s.badge}>v0.6.6</span>
          </div>
        </div>

        <div className={s.cardBody}>
          <div className={s.cardMeta}>
            <h3 className={s.projectTitle}>ListSync</h3>
            <div className={s.tags}>
              {TAGS.map((tag) => (
                <span key={tag} className={s.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <p className={s.description}>
              Built to scratch my own itch &mdash; automatically syncs
              watchlists from IMDb, Trakt, Letterboxd and others into
              Overseerr/Jellyseerr. What started as a weekend project now has a
              proper web dashboard, a REST API, 300+ GitHub stars and an actual
              community. Turns out other people had the same itch.
            </p>
            <div className={s.stats}>
              {STATS.map((stat) => (
                <div key={stat.label} className={s.stat}>
                  <span className={s.statValue}>{stat.value}</span>
                  <span className={s.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={s.cardActions}>
            <Link
              href="https://github.com/Woahai321/list-sync"
              target="_blank"
              rel="noopener noreferrer"
              className={s.btnGhost}
            >
              GitHub ↗
            </Link>
          </div>
        </div>
      </article>

      <p className={s.moreSoon}>More projects coming soon</p>
    </section>
  )
}

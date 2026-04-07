'use client'

import cn from 'clsx'
import { Reveal } from '@/components/ui/reveal'
import { useReveal } from '@/hooks/use-reveal'
import s from './skills.module.css'

const SKILL_GROUPS = [
  {
    title: 'Cyber & Security',
    skills: [
      'SIEM / SOC',
      'Pen Testing',
      'Kafka',
      'Elasticsearch',
      'Kibana',
      'Burp Suite',
      'Kali Linux',
      'CrowdStrike CRWD',
    ],
  },
  {
    title: 'Development',
    skills: [
      'Python',
      'JavaScript',
      'TypeScript',
      'Vue / Nuxt',
      'React',
      'Node.js',
      'FastAPI',
      'HTML & CSS',
    ],
  },
  {
    title: 'Infrastructure',
    skills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'GCP',
      'GitLab CI/CD',
      'Linux',
      'Proxmox',
    ],
  },
  {
    title: 'Tooling',
    skills: [
      'Git / GitHub',
      'GitLab',
      'Jira / Confluence',
      'PostgreSQL',
      'MongoDB',
      'Active Directory',
      'Selenium',
      'Tailwind CSS',
    ],
  },
] as const

const WANT_TO_LEARN = [
  'Advanced Full-Stack Architectures',
  'Serverless Technologies',
  'Containerisation & Orchestration',
  'Rust',
  'WebGL / Three.js',
  'Emerging Front-End Frameworks',
]

function SkillGroup({
  group,
  index,
}: {
  group: (typeof SKILL_GROUPS)[number]
  index: number
}) {
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className={cn(s.group, visible && s.groupVisible)}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <p className={s.groupTitle}>{group.title}</p>
      <ul className={s.skillList}>
        {group.skills.map((skill) => (
          <li key={skill} className={s.skill}>
            <span className={s.skillDot} aria-hidden="true" />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Skills() {
  return (
    <section className={s.root} id="skills" aria-label="Skills">
      <Reveal>
        <div className={s.header}>
          <p className={s.label}>Skills</p>
          <h2 className={s.heading}>What I work with.</h2>
        </div>
      </Reveal>

      <div className={s.grid}>
        {SKILL_GROUPS.map((group, index) => (
          <SkillGroup key={group.title} group={group} index={index} />
        ))}
      </div>

      <Reveal delay={200}>
        <div className={s.wantToLearn}>
          <p className={s.wantToLearnTitle}>On the list</p>
          <div className={s.wantToLearnList}>
            {WANT_TO_LEARN.map((item) => (
              <span key={item} className={s.learnTag}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

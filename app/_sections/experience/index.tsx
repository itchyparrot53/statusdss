import s from './experience.module.css'

const ROLES = [
  {
    company: 'CrowdStrike',
    role: 'Technical Support Engineer (API/SIEM)',
    date: '2024 – Present',
    location: 'Remote',
    summary:
      'Working across API integrations and SIEM implementations for enterprise clients. Handling complex technical issues at the intersection of security tooling, cloud infrastructure, and custom integrations.',
    tech: ['CrowdStrike CRWD', 'SIEM', 'API', 'Python', 'AWS', 'Azure'],
  },
  {
    company: 'Defense.com',
    role: 'Technical Support Specialist',
    date: '2023 – 2024',
    location: 'Stevenage · Hybrid',
    summary:
      'Led SIEM/SOC implementations for enterprise clients. Resolved Tier 2 security issues using Kafka and Elasticsearch, managed DevOps tasks in GitLab, and collaborated with SOC and engineering teams on R&D projects.',
    tech: ['Kafka', 'Elasticsearch', 'Kibana', 'GitLab CI/CD', 'Docker'],
  },
  {
    company: 'Bulletproof (Cyber Security)',
    role: 'Technical Customer Success Executive',
    date: '2022 – 2023',
    location: 'Stevenage',
    summary:
      'Managed £2.5M in penetration testing engagements across infrastructure, web, API, and red team operations. Delivered SIEM/DPO integration support, vulnerability assessments, and client training.',
    tech: ['Elastic SIEM', 'Burp Suite', 'Kali Linux', 'Metasploit', 'Jira'],
  },
  {
    company: 'Motocaddy Golf',
    role: 'Technical Support Advisor',
    date: '2021 – 2022',
    location: "Bishop's Stortford",
    summary:
      'Multi-channel technical support for customers and UK service agents across 25+ electric golf trolley models. Managed support cases end-to-end with minimal escalation.',
    tech: [],
  },
  {
    company: 'Biggleswade Academy',
    role: 'Information Technology Technician',
    date: '2020 – 2021',
    location: 'Bedfordshire',
    summary:
      '1st and 2nd line IT support in a school environment. Helped transition staff and students to remote learning during the pandemic — imaging and deploying iPads and Chromebooks at scale.',
    tech: ['Active Directory', 'G-Suite', 'Meraki'],
  },
  {
    company: 'Everest Home Improvements',
    role: 'Infrastructure Technician (1st Line)',
    date: '2018 – 2020',
    location: 'Cuffley',
    summary:
      'IT support and infrastructure management across a large office estate. Reduced average ticket resolution time by 20% through improved tooling and triage processes.',
    tech: ['ConnectWise', 'SCCM', 'Active Directory'],
  },
] as const

export function Experience() {
  return (
    <section className={s.root} id="experience" aria-label="Work experience">
      <div className={s.header}>
        <p className={s.label}>Experience</p>
        <h2 className={s.heading}>Where I&apos;ve been.</h2>
      </div>

      <ol className={s.timeline}>
        {ROLES.map((role) => (
          <li key={`${role.company}-${role.date}`} className={s.entry}>
            <span className={s.entryDate}>{role.date}</span>
            <div className={s.entryContent}>
              <span className={s.company}>{role.company}</span>
              <span className={s.role}>{role.role}</span>
              <span className={s.location}>{role.location}</span>
              <p className={s.summary}>{role.summary}</p>
              {role.tech.length > 0 && (
                <div className={s.techStack}>
                  {role.tech.map((t) => (
                    <span key={t} className={s.tech}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

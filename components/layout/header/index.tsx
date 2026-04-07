'use client'

import cn from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from '@/components/ui/link'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Exp.' },
  { href: '#contact', label: 'Contact' },
] as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-safe transition-all duration-300',
        scrolled
          ? 'border-[rgba(139,92,246,0.1)] border-b bg-[rgba(9,9,15,0.85)] py-3 backdrop-blur-md'
          : 'bg-transparent py-5'
      )}
      style={{ height: 'var(--header-height)' }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        className="font-bold font-mono text-sm text-white uppercase tracking-widest transition-colors hover:text-purple-400"
        aria-label="Aidan Munns — home"
      >
        AM
      </Link>

      {/* Nav */}
      <nav aria-label="Main navigation">
        <ul className="flex items-center" style={{ gap: '2rem' }}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-mono text-[11px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.15em] transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

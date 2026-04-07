import { Link } from '@/components/ui/link'

export function Footer() {
  return (
    <footer className="flex dt:flex-row flex-col items-center justify-between gap-4 border-[rgba(139,92,246,0.1)] border-t p-safe font-mono text-[10px] text-[rgba(255,255,255,0.2)] uppercase tracking-widest">
      <span>© {new Date().getFullYear()} Aidan Munns</span>
      <div className="flex items-center gap-6">
        <Link
          href="https://github.com/itchyparrot53"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[rgba(139,92,246,0.9)]"
        >
          GitHub
        </Link>
        <Link
          href="https://www.linkedin.com/in/aidan-munns-359811139"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-[rgba(139,92,246,0.9)]"
        >
          LinkedIn
        </Link>
        <Link
          href="#contact"
          className="transition-colors hover:text-[rgba(139,92,246,0.9)]"
        >
          Contact
        </Link>
      </div>
    </footer>
  )
}

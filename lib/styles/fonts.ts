import { Space_Mono } from 'next/font/google'
import localFont from 'next/font/local'

const mono = localFont({
  src: [
    {
      path: '../../public/fonts/ServerMono/ServerMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--next-font-mono',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace',
  ],
})

const display = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
})

const fonts = [mono, display]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }

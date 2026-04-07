import { Wrapper } from '@/components/layout/wrapper'
import { About } from './_sections/about'
import { Contact } from './_sections/contact'
import { Experience } from './_sections/experience'
import { Hero } from './_sections/hero'
import { Projects } from './_sections/projects'
import { Skills } from './_sections/skills'

export default function Home() {
  return (
    <Wrapper theme="dark" lenis={{}}>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Contact />
    </Wrapper>
  )
}

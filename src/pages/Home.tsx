import { useScrollReveal } from '../lib/reveal.ts'
import Booking from '../components/home/Booking.tsx'
import SiteFooter from '../components/home/Footer.tsx'
import Faq from '../components/home/Faq.tsx'
import Intro from '../components/home/Intro.tsx'
import Process from '../components/home/Process.tsx'
import ValueSection from '../components/home/ValueSection.tsx'
import { CompareSection, ConfidenceSection, ClosingSection } from '../components/home/StorySections.tsx'

export default function Home() {
  useScrollReveal()

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="page">
        <main id="contenido">
          <Intro />
          <ValueSection />
          <CompareSection />
          <Process />
          <ConfidenceSection />
          <Booking />
          <Faq />
          <ClosingSection />
        </main>
        <SiteFooter />
      </div>
    </>
  )
}

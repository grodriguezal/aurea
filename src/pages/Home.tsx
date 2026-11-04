import { useState } from 'react'
import Booking from '../components/home/Booking.tsx'
import { Closing, SiteFooter } from '../components/home/Closing.tsx'
import Faq from '../components/home/Faq.tsx'
import Intro from '../components/home/Intro.tsx'
import { Process, Visit } from '../components/home/Process.tsx'
import Valuation from '../components/home/Valuation.tsx'
import ValueSection from '../components/home/ValueSection.tsx'
import { scrollToId } from '../lib/format.ts'

export default function Home() {
  // Shared by the offers (pick a jeweler) and the booking calendar.
  const [shop, setShop] = useState(0)

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="page">
        <main id="contenido">
          <Intro />
          <ValueSection />
          <Valuation
            onChooseShop={(index) => {
              setShop(index)
              scrollToId('cita')
            }}
          />
          <Process />
          <Visit />
          <Booking shop={shop} onShopChange={setShop} />
          <Faq />
          <Closing />
        </main>
        <SiteFooter />
      </div>
    </>
  )
}

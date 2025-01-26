// src/app/page.tsx
import MainBanner from '@/components/homepage/MainBanner'
import About from '@/components/homepage/About'
import Ranking from '@/components/homepage/Ranking'
import Events from '@/components/homepage/Events'
import Sponsors from '@/components/homepage/Sponsors'
import Store from '@/components/homepage/Store'
import PastEvents from '@/components/homepage/PastEvents'
import Channel from '@/components/homepage/Channel'
import Services from '@/components/homepage/Services'
import Team from '@/components/homepage/Team'
import Contact from '@/components/homepage/Contact'
import Footer from '@/components/homepage/Footer'

export default function Home() {
  return (
    <>
      <MainBanner />
      <About />
      <Ranking />
      <Events />
      <Sponsors />
      <Store />
      <PastEvents />
      <Channel />
      <Services />
      <Team />
      <Contact />
      <Footer />
    </>
  )
}
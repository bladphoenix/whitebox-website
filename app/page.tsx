import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TechMarquee from '@/components/TechMarquee'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Pricing from '@/components/Pricing'
import Workflow from '@/components/Workflow'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <>
      {/* Background decorative mesh */}
      <div className="bg-mesh" />

      <Navbar />

      <main>
        <Hero />
        <TechMarquee />
        <Services />
        <Portfolio />
        <Pricing />
        <Workflow />
        <Contact />
      </main>

      <Footer />

      {/* Mounts the scroll-reveal observer (client-only) */}
      <ScrollReveal />
    </>
  )
}

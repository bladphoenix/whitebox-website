import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TechMarquee from '@/components/TechMarquee'
import Services from '@/components/Services'
import Projects from '@/components/Projects'
import Pricing from '@/components/Pricing'
import Workflow from '@/components/Workflow'
import Testimonials from '@/components/Testimonials'
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
        <Projects />
        <Pricing />
        <Workflow />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      {/* Mounts the scroll-reveal observer (client-only) */}
      <ScrollReveal />
    </>
  )
}

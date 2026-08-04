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

/* Isi halaman datang dari data/content.json, jadi hasil render tidak lagi
   bisa dibekukan saat build. ISR: disajikan dari cache, dibangun ulang paling
   cepat tiap 5 menit — dan langsung, tanpa menunggu, setiap panel admin
   menyimpan (lihat revalidatePath di app/api/admin/content/route.ts). */
export const revalidate = 300

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

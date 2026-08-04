'use client'

import { useLanguage } from '@/lib/i18n'
import LetterGlitch, { type Palet } from '@/components/LetterGlitch'

/* Palet latar LetterGlitch. Tiga warna aksen situs plus satu warna redup:
   warna redup itu yang membuat sebagian besar huruf tenggelam jadi tekstur,
   sementara aksen hanya sesekali menyembul. Kalau ketiganya sama terang,
   latarnya jadi ramai dan judul di depannya susah dibaca. */
const PALET: Palet = {
  dark: ['#4f8bff', '#7c3aed', '#06b6d4', '#1c2740'],
  light: ['#2563eb', '#6d28d9', '#0891b2', '#cbd5e1'],
}

export default function Contact() {
  const { t } = useLanguage()
  const c = t.contact

  return (
    <section id="kontak">
      <LetterGlitch palet={PALET} glitchSpeed={50} centerVignette outerVignette={false} smooth />

      <div className="section-wrap">
        <div className="contact-inner reveal">
          <div className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            {c.label}
          </div>
          <h2 className="contact-title">
            {c.titleLine1}<br />{c.titleLine2}
          </h2>
          <p className="contact-sub">{c.sub}</p>

          <div className="contact-btns">
            <a
              href="https://wa.me/62859191749378"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn btn-wa"
            >
              <i className="fa-brands fa-whatsapp" /> WhatsApp
            </a>
            <a
              href="https://t.me/+6287821381136"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn btn-tg"
            >
              <i className="fa-brands fa-telegram" /> Telegram
            </a>
          </div>

          <div className="contact-avail">
            <span className="avail-dot" />
            <span>{c.availability}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

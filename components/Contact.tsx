'use client'

import { useLanguage } from '@/lib/i18n'

export default function Contact() {
  const { t } = useLanguage()
  const c = t.contact

  return (
    <section id="kontak">
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
              href="https://wa.me/6287821381136"
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

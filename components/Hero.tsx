'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'

export default function Hero() {
  const { t } = useLanguage()
  const h = t.hero

  return (
    <section id="beranda">
      <div className="hero-inner section-wrap">
        {/* Left – copy */}
        <div>
          <div className="hero-badge reveal">{h.badge}</div>

          <h1 className="hero-title reveal reveal-d1">
            {h.titleTop}<br />
            <span className="gradient-text">{h.titleAccent}</span>
          </h1>

          <p className="hero-sub reveal reveal-d2">{h.sub}</p>

          <div className="hero-actions reveal reveal-d3">
            <a href="#portofolio" className="btn-primary">
              <i className="fa-solid fa-arrow-right" /> {h.btnPrimary}
            </a>
            <a href="#layanan" className="btn-ghost">{h.btnGhost}</a>
          </div>

          <div className="hero-stats reveal reveal-d2">
            {h.stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – visual */}
        <div className="hero-visual reveal reveal-d2">
          <div className="float-tag float-tag-1">
            <i className="fa-brands fa-microsoft" /> Enterprise Cloud
          </div>
          <div className="float-tag float-tag-2">
            <i className="fa-solid fa-shield-halved" /> SSL Secured
          </div>
          <div className="hero-img-wrap">
            <Image
              src="https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=800&auto=format&fit=crop"
              alt="Whitebox.asia Workspace"
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="hero-quote">
              <p>{h.quote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

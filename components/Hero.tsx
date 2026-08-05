'use client'

import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'
import { bisaDioptimalkan } from '@/lib/content'
import TextType from './TextType'

export default function Hero() {
  const { t, p, content } = useLanguage()
  const h = t.hero
  const { stats, image } = content.hero

  return (
    <section id="beranda">
      <div className="hero-inner section-wrap">
        {/* Left – copy */}
        <div>
          <div className="hero-badge reveal">{h.badge}</div>

          <TextType
            className="hero-title reveal reveal-d1"
            baris={[
              { teks: h.titleTop },
              { teks: h.titleAccent, className: 'gradient-text' },
            ]}
          />

          <p className="hero-sub reveal reveal-d2">{h.sub}</p>

          <div className="hero-actions reveal reveal-d3">
            <a href="#portofolio" className="btn-primary">
              <i className="fa-solid fa-arrow-right" /> {h.btnPrimary}
            </a>
            <a href="#layanan" className="btn-ghost">{h.btnGhost}</a>
          </div>

          <div className="hero-stats reveal reveal-d2">
            {stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{p(s.label, s.labelEn)}</div>
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
              src={image}
              alt="Whitebox.asia Workspace"
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              style={{ objectFit: 'cover' }}
              unoptimized={!bisaDioptimalkan(image)}
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

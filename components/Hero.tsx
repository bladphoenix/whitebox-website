'use client'

import { useLanguage } from '@/lib/i18n'
import TextType from './TextType'
import DepthCarousel from './DepthCarousel'

export default function Hero() {
  const { t, p, content } = useLanguage()
  const h = t.hero
  const { stats, images } = content.hero

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
            <DepthCarousel
              slid={images.map((src, i) => ({
                // Hanya kartu terdepan yang membawa makna; sisanya hiasan yang
                // berputar, jadi alt-nya dikosongkan agar tidak dibacakan ulang.
                gambar: src,
                alt: i === 0 ? 'Whitebox.asia Workspace' : '',
              }))}
              lebarKartu={340}
              tinggiKartu={500}
              sebaran={62}
              radius={16}
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

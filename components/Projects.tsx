'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'

type Project = {
  domain: string
  img: string
  tag: string
  tagEn: string
  color: string
}

const projects: Project[] = [
  {
    domain: 'rsud-iskak.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/rsud-iskak.com_zp2z5m.png',
    tag: 'Instansi Kesehatan',
    tagEn: 'Healthcare Institution',
    color: '#3b82f6',
  },
  {
    domain: 'colosseumcorporation.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086499/colosseumcorporation.com_t7b0qf.png',
    tag: 'Korporat',
    tagEn: 'Corporate',
    color: '#14b8a6',
  },
  {
    domain: 'serum78.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/serum78.com_ztqr7q.png',
    tag: 'Brand & Skincare',
    tagEn: 'Brand & Skincare',
    color: '#f43f5e',
  },
  {
    domain: 'verosdjayasteel.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086499/verosdjayasteel.com_eud2vc.png',
    tag: 'Produsen Kandang Ayam',
    tagEn: 'Poultry Cage Manufacturer',
    color: '#f97316',
  },
  {
    domain: 'balitravel.store',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086500/balitravel.store_zs4w34.png',
    tag: 'Travel & Tour',
    tagEn: 'Travel & Tour',
    color: '#06b6d4',
  },
  {
    domain: 'balisundaytour.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086500/balisundaytour.com_vtq59d.png',
    tag: 'Travel & Tour',
    tagEn: 'Travel & Tour',
    color: '#06b6d4',
  },
  {
    domain: 'holidaytobali.info',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086499/holidaytobali.info_dyti8h.png',
    tag: 'Travel & Tour',
    tagEn: 'Travel & Tour',
    color: '#06b6d4',
  },
  {
    domain: 'kostulungagung.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/kostulungagung.com_a7xr2l.png',
    tag: 'Properti & Kos',
    tagEn: 'Property & Boarding',
    color: '#10b981',
  },
  {
    domain: 'perdana-mentri.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/perdana-mentri.com_bnktqc.png',
    tag: 'Portal Berita',
    tagEn: 'News Portal',
    color: '#ef4444',
  },
  {
    domain: 'perdanamentri.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/perdanamentri.com_zb00tx.png',
    tag: 'Portal Berita',
    tagEn: 'News Portal',
    color: '#ef4444',
  },
]

/** true jika pengguna mengaktifkan "reduce motion" di OS */
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function Projects() {
  const { t, lang } = useLanguage()
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [lightbox, setLightbox] = useState<Project | null>(null)

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [])

  // Lightbox: kunci scroll latar (termasuk mobile/iOS) + tutup dengan Escape
  useEffect(() => {
    if (!lightbox) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)

    // Teknik position:fixed — mencegah scroll/rubber-band latar di HP yang lolos dari overflow:hidden
    const body = document.body
    const scrollY = window.scrollY
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px` // cegah geser layout saat scrollbar hilang (desktop)
    body.classList.add('lightbox-open') // sembunyikan navbar selagi popup aktif

    return () => {
      document.removeEventListener('keydown', onKey)
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.width = prev.width
      body.style.overflow = prev.overflow
      body.style.paddingRight = prev.paddingRight
      body.classList.remove('lightbox-open')

      // Kembalikan posisi scroll semula secara INSTAN.
      // `html { scroll-behavior: smooth }` membuat scrollTo ikut dianimasikan, sehingga
      // terlihat seolah halaman loncat ke atas lalu scroll turun sendiri. Matikan sesaat.
      const html = document.documentElement
      const prevBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      window.scrollTo(0, scrollY)
      html.style.scrollBehavior = prevBehavior
    }
  }, [lightbox])

  const scroll = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.proj-card')
    const step = card ? card.offsetWidth + 28 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const isEn = lang === 'en'

  return (
    <section id="portofolio">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">{t.projects.label}</div>
          <h2 className="section-title">{t.projects.title}</h2>
          <p className="section-sub">{t.projects.sub}</p>
        </div>

        <div className="proj-slider reveal">
          <button
            type="button"
            className="proj-arrow proj-arrow-prev"
            onClick={() => { if (!atStart) scroll(-1) }}
            aria-disabled={atStart}
            aria-label={isEn ? 'Previous' : 'Sebelumnya'}
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <div className="proj-track" ref={trackRef} onScroll={updateArrows}>
            {projects.map((p) => (
              <div className="proj-card" key={p.domain}>
                <button
                  type="button"
                  className="proj-frame"
                  onClick={() => setLightbox(p)}
                  aria-label={
                    isEn
                      ? `View full image of ${p.domain}`
                      : `Lihat gambar penuh website ${p.domain}`
                  }
                >
                  <div className="proj-bar">
                    <span className="proj-dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="proj-url">
                      <i className="fa-solid fa-lock" aria-hidden="true" /> {p.domain}
                    </span>
                  </div>
                  <div className="proj-shot">
                    <Image
                      src={p.img}
                      alt={isEn ? `${p.domain} website preview` : `Tampilan website ${p.domain}`}
                      width={640}
                      height={440}
                      sizes="(max-width: 768px) calc(86vw - 96px), (max-width: 1024px) calc(45vw - 96px), 364px"
                    />
                    <span className="proj-zoom" aria-hidden="true">
                      <i className="fa-solid fa-magnifying-glass-plus" />
                    </span>
                  </div>
                </button>

                <div className="proj-body">
                  <span
                    className="proj-tag"
                    style={{ ['--tag']: p.color } as React.CSSProperties}
                  >
                    {isEn ? p.tagEn : p.tag}
                  </span>
                  <a
                    className="proj-visit"
                    href={`https://${p.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      isEn
                        ? `Visit ${p.domain} (opens in a new tab)`
                        : `Kunjungi ${p.domain} (buka di tab baru)`
                    }
                  >
                    {t.projects.visit} <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="proj-arrow proj-arrow-next"
            onClick={() => { if (!atEnd) scroll(1) }}
            aria-disabled={atEnd}
            aria-label={isEn ? 'Next' : 'Berikutnya'}
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Lightbox / popup gambar penuh */}
      {lightbox && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? `Full image ${lightbox.domain}` : `Gambar penuh ${lightbox.domain}`}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-head">
              <span className="lightbox-domain">
                <i className="fa-solid fa-lock" aria-hidden="true" /> {lightbox.domain}
              </span>
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setLightbox(null)}
                aria-label={isEn ? 'Close' : 'Tutup'}
                autoFocus
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <div className="lightbox-scroll">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lightbox-img"
                src={lightbox.img}
                alt={isEn ? `${lightbox.domain} full preview` : `Tampilan penuh website ${lightbox.domain}`}
              />
            </div>

            <div className="lightbox-caption">
              <a
                className="lightbox-visit"
                href={`https://${lightbox.domain}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.projects.visitSite} <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

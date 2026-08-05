'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'
import { bisaDioptimalkan, type Project } from '@/lib/content'

type Arah = 'kiri' | 'kanan'

/**
 * Satu baris kartu yang berjalan sendiri tanpa henti.
 *
 * Cara kerjanya: daftar kartu dirender BERULANG dalam beberapa "grup" yang
 * isinya persis sama, lalu seluruh trek digeser dengan transform. Begitu
 * pergeseran mencapai lebar satu grup, nilainya dikembalikan ke nol — karena
 * grup berikutnya identik, matanya tidak melihat lompatan itu.
 *
 * Jumlah grup dihitung dari lebar layar, bukan ditebak: butuh minimal satu
 * grup penuh di luar layar supaya sisi yang ditinggalkan selalu ada isinya.
 *
 * Dipakai rAF, bukan animasi CSS, karena tiga hal yang tidak bisa dilakukan
 * @keyframes: berhenti dengan melambat (bukan mematung), berhenti total saat
 * barisnya keluar dari layar, dan menyesuaikan diri kalau lebar kartu berubah.
 */
function Baris({
  items,
  arah,
  kecepatan,
  hemat,
  anak,
}: {
  items: Project[]
  arah: Arah
  /** piksel per detik */
  kecepatan: number
  /** true kalau pengguna minta "reduce motion" — baris jadi geser manual */
  hemat: boolean
  anak: (p: Project, salinan: boolean, kunci: string) => ReactNode
}) {
  const wadahRef = useRef<HTMLDivElement>(null)
  const trekRef = useRef<HTMLDivElement>(null)
  const grupRef = useRef<HTMLDivElement>(null)
  const lebarGrup = useRef(0)
  const berhenti = useRef(false)
  const [jmlGrup, setJmlGrup] = useState(2)

  // Ukur lebar satu grup dan tentukan berapa grup yang perlu dirender.
  useEffect(() => {
    const wadah = wadahRef.current
    const grup = grupRef.current
    if (!wadah || !grup || hemat) return

    const ukur = () => {
      const w = grup.offsetWidth
      lebarGrup.current = w
      if (!w) return
      const perlu = Math.max(2, Math.ceil(wadah.clientWidth / w) + 1)
      setJmlGrup((lama) => (lama === perlu ? lama : perlu))
    }

    ukur()
    const ro = new ResizeObserver(ukur)
    ro.observe(wadah)
    ro.observe(grup)
    return () => ro.disconnect()
  }, [items.length, hemat])

  useEffect(() => {
    if (hemat) return
    const wadah = wadahRef.current
    const trek = trekRef.current
    if (!wadah || !trek) return

    const tanda = arah === 'kiri' ? 1 : -1
    let posisi = 0
    let laju = 0
    let lalu = 0
    let id = 0

    const gambar = (t: number) => {
      id = requestAnimationFrame(gambar)
      const dt = lalu ? Math.min(t - lalu, 100) : 16.7
      lalu = t

      const w = lebarGrup.current
      if (!w) return

      // Melambat/menderu halus menuju kecepatan tujuan. Pangkat dt/16.7 membuat
      // lamanya perlambatan sama di layar 60 Hz maupun 120 Hz.
      const tujuan = berhenti.current ? 0 : kecepatan
      const k = 1 - Math.pow(1 - 0.085, dt / 16.7)
      laju += (tujuan - laju) * k
      if (Math.abs(laju - tujuan) < 0.04) laju = tujuan

      posisi += tanda * laju * (dt / 1000)
      posisi = ((posisi % w) + w) % w
      trek.style.transform = `translate3d(${(-posisi).toFixed(2)}px, 0, 0)`
    }

    // Baris yang tidak terlihat tidak perlu dianimasikan sama sekali.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!id) {
            lalu = 0
            id = requestAnimationFrame(gambar)
          }
        } else if (id) {
          cancelAnimationFrame(id)
          id = 0
        }
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(wadah)

    return () => {
      io.disconnect()
      if (id) cancelAnimationFrame(id)
    }
  }, [arah, kecepatan, hemat])

  const setBerhenti = (nilai: boolean) => () => {
    berhenti.current = nilai
  }

  return (
    <div
      className={`pm-row${hemat ? ' manual' : ''}`}
      ref={wadahRef}
      onMouseEnter={setBerhenti(true)}
      onMouseLeave={setBerhenti(false)}
      onTouchStart={setBerhenti(true)}
      onTouchEnd={setBerhenti(false)}
      onTouchCancel={setBerhenti(false)}
      onFocus={setBerhenti(true)}
      onBlur={setBerhenti(false)}
      // Memberi fokus ke kartu yang sebagian keluar layar membuat peramban
      // menggeser wadahnya sendiri; itu merusak hitungan transform di atas.
      onScroll={hemat ? undefined : (e) => { e.currentTarget.scrollLeft = 0 }}
    >
      <div className="pm-track" ref={trekRef}>
        {Array.from({ length: hemat ? 1 : jmlGrup }, (_, g) => (
          <div
            className="pm-grup"
            key={g}
            ref={g === 0 ? grupRef : undefined}
            aria-hidden={g > 0 || undefined}
          >
            {items.map((p, i) => anak(p, g > 0, `${g}-${i}-${p.domain}`))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const { t, lang, content } = useLanguage()
  const projects = content.projects
  const [lightbox, setLightbox] = useState<Project | null>(null)
  const [hemat, setHemat] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ikuti = () => setHemat(mq.matches)
    ikuti()
    mq.addEventListener('change', ikuti)
    return () => mq.removeEventListener('change', ikuti)
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

  const isEn = lang === 'en'

  /** Kartu proyek. `salinan` = kartu di grup ulangan: masih bisa diklik,
   *  tapi dikeluarkan dari urutan tab supaya tidak muncul berkali-kali. */
  const kartu = (p: Project, salinan: boolean, kunci: string) => (
    <div className="proj-card" key={kunci}>
      <button
        type="button"
        className="proj-frame"
        onClick={() => setLightbox(p)}
        tabIndex={salinan ? -1 : undefined}
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
            sizes="(max-width: 768px) 250px, (max-width: 1024px) 300px, 340px"
            unoptimized={!bisaDioptimalkan(p.img)}
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
          tabIndex={salinan ? -1 : undefined}
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
  )

  // Dua baris berlawanan arah. Membagi daftar jadi dua hanya masuk akal kalau
  // proyeknya cukup banyak; di bawah itu keduanya memakai daftar yang sama,
  // yang bawah dibalik supaya tidak terlihat sebagai bayangan baris atas.
  const jml = projects.length
  const tengah = Math.ceil(jml / 2)
  const banyak = jml >= 4
  const barisAtas = banyak ? projects.slice(0, tengah) : projects
  const barisBawah = banyak ? projects.slice(tengah) : [...projects].reverse()

  return (
    <section id="portofolio">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">{t.projects.label}</div>
          <h2 className="section-title">{t.projects.title}</h2>
          <p className="section-sub">{t.projects.sub}</p>
        </div>
      </div>

      {jml > 0 && (
        <div className="pm reveal">
          <Baris items={barisAtas} arah="kanan" kecepatan={38} hemat={hemat} anak={kartu} />
          {jml > 1 && (
            <Baris items={barisBawah} arah="kiri" kecepatan={30} hemat={hemat} anak={kartu} />
          )}
        </div>
      )}

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

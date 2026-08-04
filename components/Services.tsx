'use client'

import { useLanguage } from '@/lib/i18n'
import GridMotion, { type GridTile } from '@/components/GridMotion'

const delays = ['', ' reveal-d1', ' reveal-d2', ' reveal-d3']

/* Lambang teknologi untuk latar GridMotion — sama dengan daftar di
   TechMarquee, jadi latarnya bercerita hal yang sama dengan sisa halaman. */
const lambang = [
  'fa-brands fa-php',
  'fa-brands fa-python',
  'fa-brands fa-docker',
  'fa-brands fa-aws',
  'fa-solid fa-terminal',
  'fa-brands fa-android',
  'fa-brands fa-digital-ocean',
  'fa-brands fa-css3-alt',
  'fa-brands fa-microsoft',
  'fa-solid fa-server',
]

/* Peta 4 baris × 7 kolom: G = cuplikan layar proyek, L = lambang teknologi.
   Ditulis manual, bukan diacak, supaya gambarnya tidak pernah sejajar lurus
   antar baris dan hasilnya sama persis di server maupun browser (kalau
   diacak, React akan protes beda hasil saat hydrate). */
const PETA = ['LGLLGLL', 'GLLGLLG', 'LLGLLGL', 'GLLGLLG'].join('')

/* Cuplikan layar proyek dipesan ke Cloudinary sudah kecil dan buram
   (w_400,e_blur:300): 5 KB per gambar, bukan 420 KB. Buramnya bukan cuma
   soal ukuran — tanpa itu judul di dalam cuplikan ikut terbaca dan
   bertabrakan dengan judul section di depannya. */
function kecilkan(url: string): string {
  return url.replace(
    /\/image\/upload\/(?!w_)/,
    '/image/upload/w_400,e_blur:300,q_auto,f_auto/'
  )
}

export default function Services() {
  const { t, p, content } = useLanguage()

  const gambar = content.projects.map((pr) => kecilkan(pr.img)).filter(Boolean)
  let iG = 0
  let iL = 0
  const tiles: GridTile[] = PETA.split('').map((c) =>
    c === 'G' && gambar.length
      ? { jenis: 'gambar', src: gambar[iG++ % gambar.length] }
      : { jenis: 'ikon', icon: lambang[iL++ % lambang.length] }
  )

  return (
    <section id="layanan">
      <GridMotion items={tiles} />

      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">{t.services.label}</div>
          <h2 className="section-title">{t.services.title}</h2>
          <p className="section-sub">{t.services.sub}</p>
        </div>

        <div className="services-grid">
          {content.services.map((s, i) => (
            <div className={`service-card reveal${delays[i % delays.length]}`} key={i}>
              <div className="service-icon" style={{ background: s.iconBg }}>
                <i className={s.icon} style={{ color: s.iconColor }} />
              </div>
              <h3>{p(s.title, s.titleEn)}</h3>
              <p>{p(s.desc, s.descEn)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

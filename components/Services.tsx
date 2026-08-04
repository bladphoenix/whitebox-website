'use client'

import { useLanguage } from '@/lib/i18n'
import GridMotion, { type GridTile } from '@/components/GridMotion'

const meta = [
  { iconBg: 'rgba(37,99,235,0.1)', iconColor: '#3b82f6', icon: 'fa-solid fa-code' },
  { iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10b981', icon: 'fa-solid fa-chart-line' },
  { iconBg: 'rgba(109,40,217,0.1)', iconColor: '#8b5cf6', icon: 'fa-solid fa-server' },
  { iconBg: 'rgba(239,68,68,0.1)', iconColor: '#ef4444', icon: 'fa-solid fa-network-wired' },
]

const delays = ['', ' reveal-d1', ' reveal-d2', ' reveal-d3']

/* ── Isi latar GridMotion ────────────────────────────────────────────
   Cuplikan layar proyek klien yang sama dengan section portofolio, tapi
   dipesan ke Cloudinary dalam lebar 400px dan sudah diburamkan di sisi
   CDN (w_400,e_blur:300): 5 KB per gambar, bukan 420 KB.

   Buram-nya bukan cuma soal ukuran. Tanpa itu, judul di dalam cuplikan
   ("Ayam Baja Kuat, Awet &…") ikut terbaca dan bertabrakan dengan judul
   section di depannya. Diburamkan, yang tersisa tinggal warna dan tata
   letaknya — masih jelas itu website, tapi tidak lagi minta dibaca. */
const CLOUD = 'https://res.cloudinary.com/dmis60dxy/image/upload/w_400,e_blur:300,q_auto,f_auto'

const cuplikan = [
  'v1784086501/rsud-iskak.com_zp2z5m.png',
  'v1784086499/colosseumcorporation.com_t7b0qf.png',
  'v1784086501/serum78.com_ztqr7q.png',
  'v1784086499/verosdjayasteel.com_eud2vc.png',
  'v1784086500/balitravel.store_zs4w34.png',
  'v1784086500/balisundaytour.com_vtq59d.png',
  'v1784086499/holidaytobali.info_dyti8h.png',
  'v1784086501/kostulungagung.com_a7xr2l.png',
  'v1784086501/perdana-mentri.com_bnktqc.png',
  'v1784086501/perdanamentri.com_zb00tx.png',
].map((id) => `${CLOUD}/${id}`)

/* Lambang teknologi yang dipakai sehari-hari — sama dengan daftar di
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

/* Peta 4 baris × 7 kolom: G = cuplikan layar, L = lambang teknologi.
   Ditulis manual, bukan diacak, supaya gambarnya tidak pernah sejajar
   lurus antar baris dan hasilnya sama persis di server maupun browser
   (kalau diacak, React akan protes beda hasil saat hydrate). */
const PETA = ['LGLLGLL', 'GLLGLLG', 'LLGLLGL', 'GLLGLLG'].join('')

let iG = 0
let iL = 0
/* split(''), bukan [...PETA] — target tsconfig di sini masih ES5 dan
   spread pada string butuh downlevelIteration. */
const tiles: GridTile[] = PETA.split('').map((c) =>
  c === 'G'
    ? { jenis: 'gambar', src: cuplikan[iG++ % cuplikan.length] }
    : { jenis: 'ikon', icon: lambang[iL++ % lambang.length] }
)

export default function Services() {
  const { t } = useLanguage()

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
          {t.services.cards.map((s, i) => (
            <div className={`service-card reveal${delays[i]}`} key={i}>
              <div className="service-icon" style={{ background: meta[i].iconBg }}>
                <i className={meta[i].icon} style={{ color: meta[i].iconColor }} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

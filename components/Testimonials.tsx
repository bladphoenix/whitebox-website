'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n'
import type { Testimonial } from '@/lib/content'

/** "Rangga Prasetyo" -> "RP" */
function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}


function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="testi-stars" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <i key={i} className="fa-solid fa-star" />
        if (i === full && half) return <i key={i} className="fa-solid fa-star-half-stroke" />
        return <i key={i} className="fa-regular fa-star" />
      })}
    </span>
  )
}

const KOLOM = 3

/** Arah gerak tiap kolom + lama satu putaran. Makin besar detiknya makin pelan. */
const KOLOM_CONF = [
  { arah: 'up' as const, durasi: 64 },
  { arah: 'down' as const, durasi: 76 },
  { arah: 'up' as const, durasi: 68 },
]

/**
 * Bagi testimoni ke 3 kolom secara selang-seling (0,3,6,9 · 1,4,7 · 2,5,8).
 * Sengaja tanpa pengulangan isi: di layar sempit hanya satu salinan yang
 * ditampilkan, jadi kalau di sini diulang, testimoninya akan tampak dobel.
 * Tinggi satu kolom (3-4 kartu berkutipan panjang) sudah melebihi tinggi
 * wadah 720px, sehingga tidak akan menyisakan celah kosong saat bergulir.
 */
function bagiKolom(items: Testimonial[]) {
  return Array.from({ length: KOLOM }, (_, c) => items.filter((_, i) => i % KOLOM === c))
}

/** Berapa testimoni yang langsung tampil di layar sempit. */
const AWAL_MOBILE = 3

export default function Testimonials() {
  const { t, isEn, content } = useLanguage()
  const [semua, setSemua] = useState(false)

  // Testimoni yang ditandai "sembunyikan" di panel tetap tersimpan di JSON,
  // hanya tidak ikut tampil.
  const tampil = content.testimonials.filter((x) => !x.hidden)
  const kolomItems = bagiKolom(tampil)
  const sisa = tampil.length - AWAL_MOBILE

  const Kartu = ({ item }: { item: Testimonial }) => (
    <div className="testi-card">
      <div className="testi-top">
        <Stars rating={item.rating} />
        <span className="testi-quote-mark" aria-hidden="true">
          &rdquo;
        </span>
      </div>

      <p className="testi-quote">{isEn ? item.quoteEn : item.quote}</p>

      <div className="testi-foot">
        <div className="testi-avatar" style={{ background: item.color }} aria-hidden="true">
          {initials(item.name)}
        </div>
        <div className="testi-meta">
          <span className="testi-name">{item.name}</span>
          <span className="testi-role">
            {(isEn ? item.roleEn : item.role)} · {item.location}
          </span>
        </div>
      </div>

      <span className="testi-tag" style={{ ['--tag']: item.color } as React.CSSProperties}>
        {isEn ? item.serviceEn : item.service}
      </span>
    </div>
  )

  return (
    <section id="testimoni">
      <div className="section-wrap">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-label">{t.testimonials.label}</div>
          <h2 className="section-title">{t.testimonials.title}</h2>
          <p className="section-sub">{t.testimonials.sub}</p>
          <div className="testi-summary">
            <Stars rating={5} />
            <span className="testi-summary-text">
              <strong>{t.testimonials.summaryStrong}</strong> {t.testimonials.summaryText}
            </span>
          </div>
        </div>

        {/* Dinding testimoni: 3 kolom bergulir vertikal, arah selang-seling.
            Tiap kolom berisi dua salinan identik; animasinya menggeser tepat
            -50% sehingga salinan kedua mengambil alih posisi salinan pertama
            tanpa sambungan terlihat. Salinan kedua disembunyikan dari pembaca
            layar supaya isinya tidak dibacakan dua kali. */}
        <div className="testi-wall reveal">
          {kolomItems.map((items, ci) => (
            <div className="testi-col" key={ci} data-arah={KOLOM_CONF[ci].arah}>
              <div
                className="testi-col-inner"
                style={{ ['--durasi']: `${KOLOM_CONF[ci].durasi}s` } as React.CSSProperties}
              >
                <div className="testi-col-group">
                  {items.map((item, i) => (
                    <Kartu key={`a${i}`} item={item} />
                  ))}
                </div>
                <div className="testi-col-group" aria-hidden="true">
                  {items.map((item, i) => (
                    <Kartu key={`b${i}`} item={item} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layar sempit: satu lajur, tiga dulu, sisanya di balik tombol.
            Seluruh testimoni tetap dirender ke HTML — yang belum tampil hanya
            disembunyikan lewat CSS — supaya isinya tidak hilang dari sumber
            halaman untuk mesin telusur. */}
        <div className="testi-mobile reveal">
          <div className={`testi-m-list${semua ? ' terbuka' : ''}`}>
            {tampil.map((item, i) => (
              <Kartu key={i} item={item} />
            ))}
          </div>

          {!semua && sisa > 0 && (
            <button type="button" className="testi-more" onClick={() => setSemua(true)}>
              {isEn ? `Show ${sisa} more testimonials` : `Lihat ${sisa} testimoni lainnya`}
              <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

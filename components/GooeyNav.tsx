'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Menu navbar dengan efek "gooey": pil penanda melompat ke menu yang diklik,
 * disertai letupan partikel yang meleleh menyatu kembali dengan pilnya.
 * Diadaptasi dari React Bits "GooeyNav"
 * (https://reactbits.dev/components/gooey-nav) dengan lima perbedaan:
 *
 * 1. Lelehnya dibuat dengan filter SVG (blur → ambang alfa), bukan dengan
 *    `blur + contrast(100)` di atas persegi hitam yang lalu dihapus memakai
 *    `mix-blend-mode: lighten`. Cara aslinya menuntut latar yang benar-benar
 *    gelap DAN buram. Navbar situs ini tembus pandang, berubah transparan
 *    penuh setelah menggulung, dan punya tema terang — di ketiga keadaan itu
 *    "lighten" tidak punya apa pun untuk menghapus persegi hitamnya, jadi yang
 *    muncul justru kotak hitam di sekeliling menu. Ambang alfa bekerja pada
 *    alfa, bukan pada warna, jadi latarnya boleh apa saja. Sebagai bonus,
 *    warna partikel tidak lagi dihancurkan `contrast(100)` menjadi merah/hijau/
 *    biru murni, sehingga bisa memakai warna aksen situs apa adanya.
 * 2. Satu pil, bukan dua. Aslinya menggambar pil di dalam lapisan filter DAN
 *    satu lagi lewat `li.active::after` dengan radius berbeda (10px lawan
 *    100vw), sehingga sudut pil yang di bawah selalu menyembul sedikit.
 * 3. Tanpa kembaran teks. Aslinya menyalin label ke `<span class="effect text">`
 *    padahal label aslinya sudah berada di lapisan yang lebih atas — hasilnya
 *    hanya teks ganda yang ikut terbaca pembaca layar.
 * 4. Tombol Enter tidak lagi dibajak. `onKeyDown` aslinya memanggil
 *    `preventDefault()` pada Enter, yang justru membatalkan lompatan tautannya;
 *    di sini Enter dibiarkan memicu klik seperti biasa. Sekalian: aslinya
 *    mengukur pil dari `<a>` saat diklik tapi dari `<li>` saat dimuat, jadi
 *    pilnya berubah ukuran sendiri setelah klik pertama.
 * 5. Diam saat pengguna minta "reduce motion" — pilnya tetap berpindah, hanya
 *    tanpa letupan.
 */

export type ItemGooey = { label: string; href: string }

const JUMLAH_PARTIKEL = 14
const JARAK_PARTIKEL: [number, number] = [72, 8] // lemparan awal → tempat mendarat
const PUTARAN_PARTIKEL = 100
const DURASI = 560 // ms
const RAGAM_WAKTU = 280 // ms, selisih acak antar partikel
const WARNA = [1, 2, 3, 1, 2, 3, 1, 4]

const derau = (n = 1) => n / 2 - Math.random() * n

/** Titik ke-`ke` dari `total` titik yang tersebar melingkar sejauh `jarak`. */
const lingkar = (jarak: number, ke: number, total: number): [number, number] => {
  const sudut = ((360 + derau(8)) / total) * ke * (Math.PI / 180)
  return [jarak * Math.cos(sudut), jarak * Math.sin(sudut)]
}

export default function GooeyNav({
  item,
  cta,
  awal = 0,
}: {
  item: ItemGooey[]
  /** Tombol ajakan di ujung daftar — di luar jangkauan pil. */
  cta?: React.ReactNode
  awal?: number
}) {
  const wadahRef = useRef<HTMLDivElement>(null)
  const daftarRef = useRef<HTMLUListElement>(null)
  const lapisRef = useRef<HTMLSpanElement>(null)
  const [aktif, setAktif] = useState(awal)

  const tempelkanKe = (li: HTMLElement) => {
    const wadah = wadahRef.current
    const lapis = lapisRef.current
    if (!wadah || !lapis) return
    const w = wadah.getBoundingClientRect()
    const k = li.getBoundingClientRect()
    lapis.style.left = `${k.x - w.x}px`
    lapis.style.top = `${k.y - w.y}px`
    lapis.style.width = `${k.width}px`
    lapis.style.height = `${k.height}px`
  }

  useEffect(() => {
    const daftar = daftarRef.current
    const lapis = lapisRef.current
    if (!daftar || !lapis) return

    const pindah = () => {
      const li = daftar.querySelectorAll<HTMLElement>('.gn-item')[aktif]
      if (li) tempelkanKe(li)
    }
    pindah()
    lapis.classList.add('gn-nyala')

    // Ukuran menu berubah sendiri di tiga keadaan: navbar menyusut jadi pill
    // (jarak antar menu dan ukuran hurufnya dianimasikan 0,7 detik), bahasa
    // ditukar ID↔EN, dan font Inter selesai dimuat. ResizeObserver menembak di
    // setiap frame perubahan itu, jadi pilnya menempel terus tanpa perlu
    // transisi sendiri — sekaligus tidak ikut tertinggal saat navbar bergerak.
    const ro = new ResizeObserver(pindah)
    ro.observe(daftar)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktif])

  const letupkan = (lapis: HTMLElement) => {
    // Sisa letupan sebelumnya dibuang: klik beruntun tidak boleh menumpuk.
    lapis.querySelectorAll('.gn-partikel').forEach((p) => p.remove())

    for (let i = 0; i < JUMLAH_PARTIKEL; i++) {
      const waktu = DURASI * 2 + derau(RAGAM_WAKTU * 2)
      const mulai = lingkar(JARAK_PARTIKEL[0], JUMLAH_PARTIKEL - i, JUMLAH_PARTIKEL)
      const akhir = lingkar(JARAK_PARTIKEL[1] + derau(7), JUMLAH_PARTIKEL - i, JUMLAH_PARTIKEL)
      const p = derau(PUTARAN_PARTIKEL / 10)
      const putar = (p > 0 ? p + PUTARAN_PARTIKEL / 20 : p - PUTARAN_PARTIKEL / 20) * 10

      const partikel = document.createElement('span')
      partikel.className = 'gn-partikel'
      const gaya: Record<string, string> = {
        '--mulai-x': `${mulai[0]}px`,
        '--mulai-y': `${mulai[1]}px`,
        '--akhir-x': `${akhir[0]}px`,
        '--akhir-y': `${akhir[1]}px`,
        '--waktu': `${waktu}ms`,
        '--skala': `${1 + derau(0.2)}`,
        '--warna': `var(--gn-warna-${WARNA[Math.floor(Math.random() * WARNA.length)]})`,
        '--putar': `${putar}deg`,
      }
      for (const [k, v] of Object.entries(gaya)) partikel.style.setProperty(k, v)

      const titik = document.createElement('span')
      titik.className = 'gn-titik'
      partikel.appendChild(titik)
      // Dibuang oleh animasinya sendiri; tidak ada timer yang perlu dibersihkan
      // kalau komponennya keburu dilepas di tengah letupan.
      partikel.addEventListener('animationend', (e) => {
        if (e.target === partikel) partikel.remove()
      })
      lapis.appendChild(partikel)
    }
  }

  const klik = (e: React.MouseEvent<HTMLAnchorElement>, ke: number) => {
    if (ke === aktif) return
    setAktif(ke)

    const lapis = lapisRef.current
    const li = e.currentTarget.parentElement
    if (!lapis || !li) return

    // Dipindah di sini juga, bukan hanya lewat efek: kalau menunggu render
    // berikutnya, pil dan partikelnya sempat terlihat satu frame di menu lama.
    tempelkanKe(li)
    lapis.classList.remove('gn-nyala')
    void lapis.offsetWidth // paksa reflow supaya animasi pilnya diputar ulang
    lapis.classList.add('gn-nyala')

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) letupkan(lapis)
  }

  return (
    <div className="gn" ref={wadahRef}>
      <ul className="nav-links" ref={daftarRef}>
        {item.map((it, i) => (
          <li key={it.href} className={`gn-item${i === aktif ? ' aktif' : ''}`}>
            <a
              href={it.href}
              aria-current={i === aktif ? 'location' : undefined}
              onClick={(e) => klik(e, i)}
            >
              {it.label}
            </a>
          </li>
        ))}
        {cta && <li className="gn-cta">{cta}</li>}
      </ul>

      <span className="gn-efek" ref={lapisRef} aria-hidden="true" />

      {/* Blur lalu alfanya diambang: yang tersisa hanya bentuk bertepi tegas,
          dan dua bentuk yang saling berdekatan lebur jadi satu tetesan. */}
      <svg className="gn-svg" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="gn-leleh"
            x="-200%"
            y="-400%"
            width="500%"
            height="900%"
            colorInterpolationFilters="sRGB"
          >
            {/* Diukur dengan mata: 6 membuat partikel larut di bawah ambang
                sehingga nyaris tak ada yang tersisa, 3 membuatnya tetap jadi
                bulatan terpisah tanpa leher yang meleleh. 5 pas. */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="kabur" />
            <feColorMatrix
              in="kabur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { bisaDioptimalkan, sumberUnsplash } from '@/lib/content'

/**
 * Korsel bertumpuk dengan kedalaman. Diadaptasi dari React Bits
 * "DepthCarousel" (https://reactbits.dev/components/depth-carousel)
 * dengan enam perbedaan:
 *
 * 1. Tanpa GSAP. Aslinya menarik gsap@^3.13 (~70 KB) hanya untuk satu tween
 *    angka; di sini rAF dengan kurva power3.out yang sama persis
 *    (1 - (1-t)³).
 * 2. Penggulung roda TIDAK dipasang. Aslinya memanggil preventDefault() pada
 *    setiap peristiwa wheel di atas korsel — di hero, itu berarti pengguna
 *    yang menggulung halaman ke bawah dengan kursor kebetulan di atas gambar
 *    malah memutar korselnya dan halamannya diam. Geser, panah, titik, dan
 *    tombol panah papan ketik sudah cukup.
 * 3. "Reduce motion" dibaca terpisah dari autoplay. Di aslinya reducedRef
 *    hanya diisi di dalam effect autoplay, yang keluar lebih awal kalau
 *    autoplay mati — akibatnya pengguna yang minta gerak seminimal mungkin
 *    tetap mendapat tween penuh.
 * 4. Autoplay berhenti total saat korselnya keluar layar.
 * 5. next/image, bukan <img> mentah: gambar Unsplash/Cloudinary ikut
 *    dioptimalkan dan diperkecil sesuai lebar kartu; host lain otomatis
 *    dilewatkan tanpa optimasi.
 * 6. Kelas berawalan dc- supaya tidak pernah bertabrakan dengan kelas
 *    halaman depan.
 */

export type SlidDalam = { gambar: string; alt?: string }

const jepit = (v: number, min: number, maks: number) => Math.min(Math.max(v, min), maks)

/** power3.out — kurva yang sama dengan setelan bawaan aslinya. */
const mulus = (t: number) => 1 - Math.pow(1 - t, 3)

export default function DepthCarousel({
  slid,
  lebarKartu = 300,
  tinggiKartu = 380,
  radius = 18,
  tinta = '#05060a',
  kedalaman = 210,
  sebaran = 78,
  miring = 20,
  arahMiring = 'right',
  perspektif = 1400,
  kartuTampak = 3,
  peredupan = 0.22,
  kabur = 5,
  durasi = 700,
  autoplay = true,
  jedaAutoplay = 3800,
  panah = true,
  titik = true,
  className = '',
}: {
  slid: SlidDalam[]
  lebarKartu?: number
  tinggiKartu?: number
  radius?: number
  tinta?: string
  kedalaman?: number
  sebaran?: number
  miring?: number
  arahMiring?: 'left' | 'right'
  perspektif?: number
  kartuTampak?: number
  peredupan?: number
  kabur?: number
  durasi?: number
  autoplay?: boolean
  jedaAutoplay?: number
  panah?: boolean
  titik?: boolean
  className?: string
}) {
  const data = useMemo(() => slid.filter((s) => s && s.gambar), [slid])
  const jml = data.length

  const akarRef = useRef<HTMLDivElement>(null)
  const kartuRefs = useRef<(HTMLDivElement | null)[]>([])
  const tintaRefs = useRef<(HTMLSpanElement | null)[]>([])

  const posRef = useRef(0)
  const fokusRef = useRef(0)
  const skalaRef = useRef(1)
  const hematRef = useRef(false)
  const seretRef = useRef<{ x: number; awal: number; xAkhir: number; tAkhir: number; v: number; gerak: boolean; id: number } | null>(null)
  const rafRef = useRef(0)
  const [aktif, setAktif] = useState(0)

  // Nilai terbaru dibaca dari ref di dalam rAF/pointer supaya effect-nya tidak
  // perlu dipasang ulang tiap kali salah satu prop berubah.
  const cfgRef = useRef({ jml, kedalaman, sebaran, miring, arahMiring, kartuTampak, peredupan, kabur, durasi, lebarKartu })
  cfgRef.current = { jml, kedalaman, sebaran, miring, arahMiring, kartuTampak, peredupan, kabur, durasi, lebarKartu }

  const tata = useCallback((pos: number) => {
    const cfg = cfgRef.current
    const n = cfg.jml
    if (!n) return
    const arah = cfg.arahMiring === 'left' ? -1 : 1
    const sk = skalaRef.current

    for (let i = 0; i < n; i++) {
      const el = kartuRefs.current[i]
      if (!el) continue

      // Jarak terpendek dalam lingkaran: kartu terakhir tetangga kartu pertama.
      let d = i - pos
      if (n > 1) {
        d = ((d % n) + n) % n
        if (d > n / 2) d -= n
      }

      const belakang = Math.max(0, d)
      const tampak = Math.abs(d) <= cfg.kartuTampak + 0.5

      const tz = -cfg.kedalaman * d
      const tx = arah * cfg.sebaran * d
      const ry = arah * cfg.miring * jepit(d, 0, 1)

      let alpha = d < 0 ? Math.max(0, 1 + d) : 1
      if (!tampak) alpha = 0

      const terang = Math.max(0.15, 1 - belakang * cfg.peredupan)
      const blur = cfg.kabur > 0 ? Math.min(cfg.kabur, (belakang / Math.max(1, cfg.kartuTampak)) * cfg.kabur) : 0

      el.style.transform =
        `translate(-50%, -50%) scale(${sk}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`
      el.style.opacity = alpha.toFixed(3)
      el.style.filter = `brightness(${terang.toFixed(3)}) blur(${blur.toFixed(2)}px)`
      el.style.zIndex = String(Math.round(2000 - d * 20))
      el.style.pointerEvents = tampak && alpha > 0.05 ? 'auto' : 'none'

      const ov = tintaRefs.current[i]
      if (ov) ov.style.opacity = jepit(belakang * cfg.peredupan * 1.25, 0, 0.86).toFixed(3)
    }
  }, [])

  const geser = useCallback((tujuan: number, animasi: boolean) => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    const cfg = cfgRef.current
    const dari = posRef.current
    const n = cfg.jml

    const rapikan = () => {
      if (n > 0) posRef.current = ((posRef.current % n) + n) % n
      tata(posRef.current)
    }

    if (!animasi || hematRef.current || dari === tujuan) {
      posRef.current = tujuan
      rapikan()
      return
    }

    const mulai = performance.now()
    const langkah = (t: number) => {
      const maju = Math.min((t - mulai) / cfg.durasi, 1)
      posRef.current = dari + (tujuan - dari) * mulus(maju)
      tata(posRef.current)
      if (maju < 1) rafRef.current = requestAnimationFrame(langkah)
      else { rafRef.current = 0; rapikan() }
    }
    rafRef.current = requestAnimationFrame(langkah)
  }, [tata])

  const keFokus = useCallback((mentah: number, animasi = true) => {
    const n = cfgRef.current.jml
    if (!n) return
    const idx = ((mentah % n) + n) % n
    let delta = idx - posRef.current
    if (n > 1) {
      delta = ((delta % n) + n) % n
      if (delta > n / 2) delta -= n
    }
    geser(posRef.current + delta, animasi)
    if (idx !== fokusRef.current) {
      fokusRef.current = idx
      setAktif(idx)
    }
  }, [geser])

  const majuKe = useCallback((langkah: number) => keFokus(fokusRef.current + langkah, true), [keFokus])

  // Prefers-reduced-motion dibaca sendiri, tidak menumpang effect autoplay.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ikut = () => { hematRef.current = mq.matches }
    ikut()
    mq.addEventListener('change', ikut)
    return () => mq.removeEventListener('change', ikut)
  }, [])

  // Skala mengikuti lebar wadah supaya kartu tidak pernah keluar bingkai.
  useEffect(() => {
    const akar = akarRef.current
    if (!akar) return
    const ro = new ResizeObserver((entri) => {
      const w = entri[0].contentRect.width
      const cfg = cfgRef.current
      // Ruang yang dibutuhkan = kartu depan + sebaran ke dua sisi + sedikit
      // napas di tepi. Angka napasnya sengaja kecil: di bingkai hero yang
      // sempit, napas besar memaksa skala turun dan kartunya jadi menciut
      // di tengah bidang kosong.
      const butuh = cfg.lebarKartu + Math.abs(cfg.sebaran) * 2 + 56
      skalaRef.current = jepit(w / butuh, 0.4, 1)
      tata(posRef.current)
    })
    ro.observe(akar)
    return () => ro.disconnect()
  }, [tata])

  useEffect(() => { tata(posRef.current) },
    [tata, kedalaman, sebaran, miring, arahMiring, kartuTampak, peredupan, kabur, lebarKartu, tinggiKartu, radius, jml])

  // Autoplay: berhenti saat disentuh kursor, saat ada fokus di dalamnya, dan
  // saat korselnya sendiri keluar layar.
  useEffect(() => {
    const akar = akarRef.current
    if (!akar || !autoplay || jml < 2) return

    let disentuh = false
    let adaFokus = false
    let terlihat = true
    let timer: ReturnType<typeof setInterval> | null = null

    const berhenti = () => { if (timer) clearInterval(timer); timer = null }
    const jalan = () => {
      berhenti()
      if (hematRef.current) return
      timer = setInterval(() => {
        if (!disentuh && !adaFokus && terlihat) majuKe(1)
      }, Math.max(jedaAutoplay, 600))
    }

    const masuk = () => { disentuh = true }
    const keluar = () => { disentuh = false }
    const fokusMasuk = () => { adaFokus = true }
    const fokusKeluar = () => { adaFokus = false }
    akar.addEventListener('mouseenter', masuk)
    akar.addEventListener('mouseleave', keluar)
    akar.addEventListener('focusin', fokusMasuk)
    akar.addEventListener('focusout', fokusKeluar)

    const io = new IntersectionObserver(([e]) => {
      terlihat = e.isIntersecting
      if (terlihat) jalan()
      else berhenti()
    }, { rootMargin: '80px 0px' })
    io.observe(akar)

    jalan()
    return () => {
      berhenti()
      io.disconnect()
      akar.removeEventListener('mouseenter', masuk)
      akar.removeEventListener('mouseleave', keluar)
      akar.removeEventListener('focusin', fokusMasuk)
      akar.removeEventListener('focusout', fokusKeluar)
    }
  }, [autoplay, jedaAutoplay, jml, majuKe])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const turunPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (cfgRef.current.jml < 2) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    seretRef.current = {
      x: e.clientX, awal: posRef.current, xAkhir: e.clientX,
      tAkhir: performance.now(), v: 0, gerak: false, id: e.pointerId,
    }
  }

  const gerakPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = seretRef.current
    if (!s) return
    const langkahPx = Math.max(cfgRef.current.lebarKartu * 0.55 * skalaRef.current, 40)
    const dx = e.clientX - s.x
    if (!s.gerak && Math.abs(dx) > 4) {
      s.gerak = true
      akarRef.current?.setPointerCapture(s.id)
    }
    if (!s.gerak) return
    const kini = performance.now()
    s.v = (e.clientX - s.xAkhir) / Math.max(kini - s.tAkhir, 1)
    s.xAkhir = e.clientX
    s.tAkhir = kini
    posRef.current = s.awal - dx / langkahPx
    tata(posRef.current)
  }

  const lepasPointer = () => {
    const s = seretRef.current
    if (!s) return
    seretRef.current = null
    if (!s.gerak) return
    const langkahPx = Math.max(cfgRef.current.lebarKartu * 0.55 * skalaRef.current, 40)
    keFokus(Math.round(posRef.current - (s.v * 180) / langkahPx), true)
  }

  if (!jml) return null

  return (
    <div
      ref={akarRef}
      className={`dc ${className}`.trim()}
      style={{ ['--dc-perspektif']: `${perspektif}px` } as React.CSSProperties}
      role="group"
      aria-roledescription="carousel"
      aria-label="Galeri gambar"
      tabIndex={0}
      onPointerDown={turunPointer}
      onPointerMove={gerakPointer}
      onPointerUp={lepasPointer}
      onPointerCancel={lepasPointer}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); majuKe(-1) }
        else if (e.key === 'ArrowRight') { e.preventDefault(); majuKe(1) }
      }}
    >
      <div className="dc-panggung">
        {data.map((s, i) => (
          <div
            key={`${i}-${s.gambar}`}
            className="dc-kartu"
            ref={(el) => { kartuRefs.current[i] = el }}
            style={{ width: lebarKartu, height: tinggiKartu, borderRadius: radius }}
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${jml}`}
            aria-hidden={aktif !== i}
            onClick={() => { if (!seretRef.current?.gerak) keFokus(i, true) }}
          >
            <Image
              className="dc-gambar"
              /* Berkas hulu diminta 4× ukuran kartu DAN senisbah dengannya, jadi
                 tidak ada piksel yang terbuang di sisi yang dipotong cover.
                 next/image tetap yang menentukan mana yang dikirim ke pengunjung
                 lewat `sizes`. */
              src={sumberUnsplash(s.gambar, lebarKartu * 4, tinggiKartu * 4)}
              alt={s.alt ?? ''}
              width={lebarKartu * 2}
              height={tinggiKartu * 2}
              sizes={`${lebarKartu}px`}
              draggable={false}
              unoptimized={!bisaDioptimalkan(s.gambar)}
              priority={i === 0}
            />
            <span
              className="dc-tinta"
              ref={(el) => { tintaRefs.current[i] = el }}
              style={{ background: tinta }}
            />
          </div>
        ))}
      </div>

      {panah && jml > 1 && (
        <>
          <button type="button" className="dc-panah dc-panah-kiri" aria-label="Sebelumnya" onClick={() => majuKe(-1)}>
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>
          <button type="button" className="dc-panah dc-panah-kanan" aria-label="Berikutnya" onClick={() => majuKe(1)}>
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </>
      )}

      {titik && jml > 1 && (
        <div className="dc-titik" role="tablist" aria-label="Pilih gambar">
          {data.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={aktif === i}
              aria-label={`Gambar ${i + 1}`}
              className={`dc-titik-satu${aktif === i ? ' aktif' : ''}`}
              onClick={() => keFokus(i, true)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

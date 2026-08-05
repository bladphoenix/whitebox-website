'use client'

import { useEffect, useRef } from 'react'

/**
 * Garis tepi "listrik" yang bergetar. Diadaptasi dari React Bits
 * "ElectricBorder" (https://reactbits.dev/animations/electric-border)
 * dengan enam perbedaan:
 *
 * 1. LAPISAN, bukan pembungkus. Aslinya membungkus anak-anaknya, yang di sini
 *    berarti pembungkus itulah yang jadi item grid — tinggi kartu tidak lagi
 *    seragam, animasi reveal dan angkat-saat-hover menempel di elemen yang
 *    salah, dan badge yang menggantung di luar kartu ikut terpotong. Sebagai
 *    lapisan absolut di dalam kartu, tidak ada satu pun tata letak yang berubah.
 * 2. Warnanya dibaca dari `currentColor` yang sudah dihitung, dan dibaca ulang
 *    saat tema berganti. Kanvas tidak bisa menerima `var(--accent)`.
 * 3. Berhenti total saat kartunya keluar layar.
 * 4. Diam kalau pengguna minta "reduce motion" — kanvasnya tidak dipasang
 *    sama sekali, tersisa cahaya statis dari CSS.
 * 5. Oktaf 10 → 6 dan satu titik tiap 4 px keliling (aslinya tiap 2 px). Pada
 *    kartu setinggi ~620 px versi asli menghitung ±86.000 sin() per frame;
 *    selisih rupanya tidak terlihat pada garis setipis ini.
 * 6. `oklch(from ...)` diganti `color-mix`. Sintaks warna relatif itu baru ada
 *    di peramban 2023+; kalau tidak dikenali, nilai bordernya gugur ke
 *    currentColor dan cahayanya salah warna.
 */

const OKTAF = 6
const LACUNARITY = 1.6
const GAIN = 0.7
const FREKUENSI = 10
const SIMPANGAN = 60    // sejauh apa garis boleh terlempar dari jalurnya (px)
const TEPI = 60         // ruang di luar kartu supaya lemparan itu tidak terpotong
const JARAK_SAMPEL = 4  // satu titik tiap sekian piksel keliling

const acak = (x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1

function noise2D(x: number, y: number) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const a = acak(i + j * 57)
  const b = acak(i + 1 + j * 57)
  const c = acak(i + (j + 1) * 57)
  const d = acak(i + 1 + (j + 1) * 57)
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy
}

function noiseBertingkat(x: number, amplitudo: number, waktu: number, benih: number) {
  let y = 0
  let a = amplitudo
  let f = FREKUENSI
  for (let i = 0; i < OKTAF; i++) {
    // Oktaf pertama sengaja dilewat (amplitudo 0 di versi asli lewat
    // baseFlatness): tanpa itu seluruh garis ikut melenggang, bukan bergetar.
    if (i > 0) y += a * noise2D(f * x + benih * 100, waktu * f * 0.3)
    f *= LACUNARITY
    a *= GAIN
  }
  return y
}

/** Titik ke-t (0..1) sepanjang keliling persegi bersudut bulat. */
function titikKeliling(t: number, lebar: number, tinggi: number, r: number, geser: number) {
  const lurusX = lebar - 2 * r
  const lurusY = tinggi - 2 * r
  const busur = (Math.PI * r) / 2
  const keliling = 2 * lurusX + 2 * lurusY + 4 * busur
  let sisa = t * keliling
  const sudut = (cx: number, cy: number, mulai: number, maju: number) => ({
    x: cx + r * Math.cos(mulai + maju * (Math.PI / 2)),
    y: cy + r * Math.sin(mulai + maju * (Math.PI / 2)),
  })

  if (sisa <= lurusX) return { x: geser + r + sisa, y: geser }
  sisa -= lurusX
  if (sisa <= busur) return sudut(geser + lebar - r, geser + r, -Math.PI / 2, sisa / busur)
  sisa -= busur
  if (sisa <= lurusY) return { x: geser + lebar, y: geser + r + sisa }
  sisa -= lurusY
  if (sisa <= busur) return sudut(geser + lebar - r, geser + tinggi - r, 0, sisa / busur)
  sisa -= busur
  if (sisa <= lurusX) return { x: geser + lebar - r - sisa, y: geser + tinggi }
  sisa -= lurusX
  if (sisa <= busur) return sudut(geser + r, geser + tinggi - r, Math.PI / 2, sisa / busur)
  sisa -= busur
  if (sisa <= lurusY) return { x: geser, y: geser + tinggi - r - sisa }
  sisa -= lurusY
  return sudut(geser + r, geser + r, Math.PI, sisa / busur)
}

export default function ElectricBorder({
  radius = 24,
  kecepatan = 1,
  kekacauan = 0.1,
}: {
  radius?: number
  kecepatan?: number
  kekacauan?: number
}) {
  const akarRef = useRef<HTMLDivElement>(null)
  const kanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const akar = akarRef.current
    const kanvas = kanvasRef.current
    if (!akar || !kanvas) return
    const ctx = kanvas.getContext('2d')
    if (!ctx) return

    const kurangGerak = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (kurangGerak.matches) return

    let lebar = 0
    let tinggi = 0
    let dpr = 1
    let warna = getComputedStyle(akar).color

    // Diukur dari kotak BORDER kartu induknya, bukan dari .eb sendiri. .eb
    // memakai inset:0 sehingga hanya sebesar kotak padding, dan tebal border
    // tidak bisa ditebak lewat CSS: Chrome membulatkan `border-width: 1.5px`
    // ke 1px pada layar dpr 1 dan 1.5px pada dpr 2. Keduanya sepusat, jadi
    // mengambil ukurannya dari kartu sudah cukup membuat jejaknya pas.
    const sumber = akar.parentElement ?? akar

    const ukur = () => {
      const kotak = sumber.getBoundingClientRect()
      lebar = kotak.width + TEPI * 2
      tinggi = kotak.height + TEPI * 2
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      kanvas.width = Math.max(1, Math.round(lebar * dpr))
      kanvas.height = Math.max(1, Math.round(tinggi * dpr))
      kanvas.style.width = `${lebar}px`
      kanvas.style.height = `${tinggi}px`
    }
    ukur()

    let waktu = 0
    let lalu = 0
    let id = 0

    const gambar = (t: number) => {
      id = requestAnimationFrame(gambar)
      const dt = lalu ? Math.min((t - lalu) / 1000, 0.1) : 0.016
      lalu = t
      waktu += dt * kecepatan

      const kLebar = lebar - TEPI * 2
      const kTinggi = tinggi - TEPI * 2
      if (kLebar <= 0 || kTinggi <= 0) return

      // setTransform tiap frame, bukan scale: scale menumpuk pada konteks yang
      // sudah diskalakan, dan garisnya membesar tiap kali kartunya di-resize.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, lebar, tinggi)

      ctx.strokeStyle = warna
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const r = Math.min(radius, Math.min(kLebar, kTinggi) / 2)
      const keliling = 2 * (kLebar + kTinggi) + 2 * Math.PI * r
      const jml = Math.max(48, Math.floor(keliling / JARAK_SAMPEL))

      ctx.beginPath()
      for (let i = 0; i <= jml; i++) {
        const maju = i / jml
        const p = titikKeliling(maju, kLebar, kTinggi, r, TEPI)
        const dx = noiseBertingkat(maju * 8, kekacauan, waktu, 0) * SIMPANGAN
        const dy = noiseBertingkat(maju * 8, kekacauan, waktu, 1) * SIMPANGAN
        if (i === 0) ctx.moveTo(p.x + dx, p.y + dy)
        else ctx.lineTo(p.x + dx, p.y + dy)
      }
      ctx.closePath()
      ctx.stroke()
    }

    const ro = new ResizeObserver(ukur)
    ro.observe(sumber)

    // Kartu di luar layar tidak perlu dianimasikan sama sekali.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!id) { lalu = 0; id = requestAnimationFrame(gambar) }
        } else if (id) {
          cancelAnimationFrame(id)
          id = 0
        }
      },
      { rootMargin: '120px 0px' }
    )
    io.observe(akar)

    // Warna aksen berbeda antara tema gelap dan terang.
    const mo = new MutationObserver(() => { warna = getComputedStyle(akar).color })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      if (id) cancelAnimationFrame(id)
    }
  }, [radius, kecepatan, kekacauan])

  return (
    <div className="eb" ref={akarRef} aria-hidden="true" style={{ borderRadius: radius }}>
      <div className="eb-kanvas-wadah">
        <canvas className="eb-kanvas" ref={kanvasRef} />
      </div>
      <div className="eb-cahaya-1" />
      <div className="eb-cahaya-2" />
      <div className="eb-cahaya-latar" />
    </div>
  )
}

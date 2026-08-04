'use client'

import { useEffect, useRef } from 'react'

/* Diadaptasi dari React Bits "LetterGlitch" (varian JS + CSS):
   https://reactbits.dev/tools/background-studio?bg=letter-glitch

   Komponen aslinya tidak punya dependensi apa pun — murni canvas 2D — jadi
   yang berubah cuma hal-hal yang menyangkut situs ini:

   1. Transisi warnanya diperbaiki. Aslinya menyimpan warna sebagai string
      lalu memanggil hexToRgb() pada hasil interpolasi sendiri; setelah
      langkah pertama string-nya sudah berbentuk "rgb(…)" sehingga regex
      heksanya gagal, hasilnya warna berhenti di 5% perjalanan dan lama-lama
      seluruh layar meluruh ke rata-rata palet. Di sini warna disimpan
      sebagai angka {r,g,b} dan titik awal tiap transisi ikut dicatat, jadi
      perjalanannya benar-benar sampai ke warna tujuan.
   2. Ikut tema. Palet dibaca dari data-theme di <html> dan diperbarui lewat
      MutationObserver saat tombol tema ditekan.
   3. Berhenti saat section tidak terlihat. Aslinya rAF jalan terus; section
      ini ada di dasar halaman, percuma menggambar 3.000-an huruf tiap frame
      selama pengunjung masih di atas.
   4. Diam total kalau pengguna minta kurangi gerak — hurufnya tetap
      tergambar sekali, cuma tidak berkedip.
   5. Ukuran mengikuti ResizeObserver, bukan cuma event resize window. Tinggi
      section ini berubah saat bahasa diganti tanpa jendela ikut berubah. */

type Rgb = { r: number; g: number; b: number }

type Huruf = {
  karakter: string
  warna: Rgb
  dari: Rgb
  tujuan: Rgb
  maju: number
}

export type Palet = { dark: string[]; light: string[] }

type Props = {
  palet: Palet
  glitchSpeed?: number
  centerVignette?: boolean
  outerVignette?: boolean
  smooth?: boolean
  characters?: string
}

const KARAKTER_BAWAAN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
const LEBAR_KARAKTER = 10
const TINGGI_KARAKTER = 20
const UKURAN_FONT = 16

export default function LetterGlitch({
  palet,
  glitchSpeed = 50,
  centerVignette = true,
  outerVignette = false,
  smooth = true,
  characters = KARAKTER_BAWAAN,
}: Props) {
  const wadahRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wadah = wadahRef.current
    const canvas = canvasRef.current
    if (!wadah || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const daftarKarakter = Array.from(characters)
    const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let paletRgb: Rgb[] = []
    let huruf: Huruf[] = []
    let kolom = 0
    let frame = 0
    let glitchTerakhir = 0

    const keRgb = (hex: string): Rgb => {
      const h = hex.replace(/^#/, '')
      const p = h.length === 3 ? h.replace(/./g, (c) => c + c) : h
      return {
        r: parseInt(p.slice(0, 2), 16),
        g: parseInt(p.slice(2, 4), 16),
        b: parseInt(p.slice(4, 6), 16),
      }
    }

    const acakKarakter = () => daftarKarakter[Math.floor(Math.random() * daftarKarakter.length)]
    const acakWarna = () => paletRgb[Math.floor(Math.random() * paletRgb.length)]

    const bacaPalet = () => {
      const terang = document.documentElement.getAttribute('data-theme') === 'light'
      paletRgb = (terang ? palet.light : palet.dark).map(keRgb)
    }

    const isiHuruf = (jumlah: number) => {
      huruf = Array.from({ length: jumlah }, () => {
        const w = acakWarna()
        return { karakter: acakKarakter(), warna: w, dari: w, tujuan: w, maju: 1 }
      })
    }

    const gambar = () => {
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${UKURAN_FONT}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      ctx.textBaseline = 'top'
      for (let i = 0; i < huruf.length; i++) {
        const h = huruf[i]
        ctx.fillStyle = `rgb(${h.warna.r}, ${h.warna.g}, ${h.warna.b})`
        ctx.fillText(h.karakter, (i % kolom) * LEBAR_KARAKTER, Math.floor(i / kolom) * TINGGI_KARAKTER)
      }
    }

    const ukurUlang = () => {
      const r = wadah.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      // dpr dibatasi 2: di HP 3x kanvasnya jadi 9x luas piksel tanpa
      // perbedaan yang terlihat pada huruf 16px.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(r.width * dpr)
      canvas.height = Math.floor(r.height * dpr)
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      kolom = Math.ceil(r.width / LEBAR_KARAKTER)
      const baris = Math.ceil(r.height / TINGGI_KARAKTER)
      isiHuruf(kolom * baris)
      gambar()
    }

    const kedip = () => {
      const jumlah = Math.max(1, Math.floor(huruf.length * 0.05))
      for (let i = 0; i < jumlah; i++) {
        const h = huruf[Math.floor(Math.random() * huruf.length)]
        if (!h) continue
        h.karakter = acakKarakter()
        h.dari = h.warna
        h.tujuan = acakWarna()
        if (smooth) {
          h.maju = 0
        } else {
          h.warna = h.tujuan
          h.maju = 1
        }
      }
    }

    const lanjutTransisi = () => {
      let adaYangBerubah = false
      for (const h of huruf) {
        if (h.maju >= 1) continue
        h.maju = Math.min(1, h.maju + 0.05)
        h.warna = {
          r: Math.round(h.dari.r + (h.tujuan.r - h.dari.r) * h.maju),
          g: Math.round(h.dari.g + (h.tujuan.g - h.dari.g) * h.maju),
          b: Math.round(h.dari.b + (h.tujuan.b - h.dari.b) * h.maju),
        }
        adaYangBerubah = true
      }
      return adaYangBerubah
    }

    const putar = (waktu: number) => {
      let perluGambar = false
      if (waktu - glitchTerakhir >= glitchSpeed) {
        kedip()
        glitchTerakhir = waktu
        perluGambar = true
      }
      if (smooth && lanjutTransisi()) perluGambar = true
      if (perluGambar) gambar()
      frame = requestAnimationFrame(putar)
    }

    const jalan = () => {
      if (kurangiGerak || frame) return
      glitchTerakhir = 0
      frame = requestAnimationFrame(putar)
    }
    const berhenti = () => {
      if (!frame) return
      cancelAnimationFrame(frame)
      frame = 0
    }

    bacaPalet()
    ukurUlang()

    const pengamatTampil = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? jalan() : berhenti()),
      { rootMargin: '100px' }
    )
    pengamatTampil.observe(wadah)

    let tundaUkur = 0
    const pengamatUkuran = new ResizeObserver(() => {
      window.clearTimeout(tundaUkur)
      tundaUkur = window.setTimeout(ukurUlang, 120)
    })
    pengamatUkuran.observe(wadah)

    const pengamatTema = new MutationObserver(() => {
      bacaPalet()
      // Warna lama berasal dari palet tema sebelumnya; diundi ulang semua
      // supaya tidak ada sisa warna tema lama yang menggantung.
      for (const h of huruf) {
        const w = acakWarna()
        h.warna = w
        h.dari = w
        h.tujuan = w
        h.maju = 1
      }
      gambar()
    })
    pengamatTema.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      berhenti()
      pengamatTampil.disconnect()
      pengamatUkuran.disconnect()
      pengamatTema.disconnect()
      window.clearTimeout(tundaUkur)
    }
    // palet/characters datang dari konstanta tingkat modul, tidak pernah berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="lg" ref={wadahRef} aria-hidden="true">
      <canvas className="lg-canvas" ref={canvasRef} />
      {outerVignette && <div className="lg-vignette-luar" />}
      {centerVignette && <div className="lg-vignette-tengah" />}
    </div>
  )
}

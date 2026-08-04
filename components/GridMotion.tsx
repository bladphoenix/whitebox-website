'use client'

import { useEffect, useRef } from 'react'

/* Diadaptasi dari React Bits "GridMotion" (varian JS + CSS):
   https://reactbits.dev/tools/background-studio?bg=grid-motion

   Empat penyesuaian dari kode aslinya:

   1. Tanpa GSAP. Aslinya memakai gsap.ticker + tween 'power3.out' yang
      di-retarget setiap frame — hasilnya setara dengan penghalusan
      eksponensial biasa, jadi ditulis manual supaya situs ini tetap tanpa
      dependensi selain Next/React.
   2. Tanpa menyentuh `window` saat render. Aslinya menghitung
      window.innerWidth/2 langsung di dalam useRef, yang membuat build Next
      gagal di tahap server-render.
   3. Berhenti total kalau section-nya tidak terlihat, kalau perangkatnya
      tanpa kursor (HP), atau kalau pengguna minta kurangi gerak.
   4. Nama kelas diberi awalan gm- ; aslinya memakai .row / .intro / .fullview
      yang terlalu umum untuk stylesheet global sepanjang globals.css. */

export type GridTile =
  | { jenis: 'gambar'; src: string; }
  | { jenis: 'ikon'; icon: string; }

const BARIS = 4
const KOLOM = 7

/* Jarak geser maksimum satu baris, dari ujung kiri ke ujung kanan layar. */
const GESER_MAKS = 300

/* Kelembaman tiap baris: makin kecil, makin santai baris itu menyusul
   kursor. Nilainya diturunkan dari durasi tween aslinya (1,4s sampai 1,0s)
   supaya rasa geraknya sama. */
const KELEMBAMAN = [0.036, 0.042, 0.045, 0.05]

export default function GridMotion({ items }: { items: GridTile[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const barisRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const diamSaja =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    if (diamSaja) return

    let tikus = window.innerWidth / 2
    const posisi = new Array(BARIS).fill(0)
    let frame = 0
    let lalu = 0

    const onMouseMove = (e: MouseEvent) => { tikus = e.clientX }

    const gambar = (waktu: number) => {
      const dt = lalu ? Math.min(waktu - lalu, 100) : 16.7
      lalu = waktu

      for (let i = 0; i < BARIS; i++) {
        const arah = i % 2 === 0 ? 1 : -1
        const tujuan = ((tikus / window.innerWidth) * GESER_MAKS - GESER_MAKS / 2) * arah

        /* Penghalusan eksponensial yang tidak ikut berubah kalau layarnya
           120Hz — tanpa koreksi dt ini, geraknya jadi dua kali lebih cepat. */
        const k = 1 - Math.pow(1 - KELEMBAMAN[i], dt / 16.7)
        posisi[i] += (tujuan - posisi[i]) * k

        const el = barisRefs.current[i]
        if (el) el.style.transform = `translate3d(${posisi[i].toFixed(2)}px, 0, 0)`
      }

      frame = requestAnimationFrame(gambar)
    }

    /* Section ini ada di tengah halaman; percuma memutar rAF dan mendengarkan
       mousemove selama pengguna masih di hero atau sudah lewat jauh ke bawah. */
    const pengamat = new IntersectionObserver(
      ([entri]) => {
        if (entri.isIntersecting && !frame) {
          window.addEventListener('mousemove', onMouseMove, { passive: true })
          frame = requestAnimationFrame(gambar)
        } else if (!entri.isIntersecting && frame) {
          window.removeEventListener('mousemove', onMouseMove)
          cancelAnimationFrame(frame)
          frame = 0
          lalu = 0
        }
      },
      { rootMargin: '120px' }
    )
    pengamat.observe(wrap)

    return () => {
      pengamat.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="gm" ref={wrapRef} aria-hidden="true">
      <div className="gm-grid">
        {Array.from({ length: BARIS }, (_, b) => (
          <div
            className="gm-row"
            key={b}
            ref={(el) => { barisRefs.current[b] = el }}
          >
            {Array.from({ length: KOLOM }, (_, k) => {
              const tile = items[b * KOLOM + k]
              return (
                <div className="gm-cell" key={k}>
                  {tile?.jenis === 'gambar' ? (
                    <span
                      className="gm-img"
                      style={{ backgroundImage: `url(${tile.src})` }}
                    />
                  ) : tile?.jenis === 'ikon' ? (
                    <i className={tile.icon} />
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="gm-fade" />
    </div>
  )
}

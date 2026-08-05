'use client'

import { Fragment, useEffect, useLayoutEffect, useState } from 'react'

/**
 * Efek mesin ketik. Diadaptasi dari React Bits "TextType"
 * (https://reactbits.dev/text-animations/text-type) dengan lima perbedaan:
 *
 * 1. Tanpa GSAP. Aslinya menarik gsap@^3.13 (~70 KB) hanya untuk mengedipkan
 *    kursor — di sini cukup @keyframes.
 * 2. Server merender teks UTUH, pengetikan baru mulai sesudah komponen
 *    terpasang di peramban. Aslinya mulai dari string kosong, yang berarti
 *    <h1> di HTML kiriman server ikut kosong — judul terpenting halaman
 *    hilang dari sumber untuk mesin telusur.
 * 3. Nol pergeseran tata letak. Sisa teks yang belum diketik tetap menempati
 *    ruangnya (visibility: hidden) dan kursornya berlebar nol, jadi tidak ada
 *    satu pun baris di bawahnya yang ikut bergerak selama mengetik.
 * 4. Menerima beberapa baris, masing-masing dengan className sendiri, supaya
 *    baris beraksen tetap memakai gradiennya.
 * 5. Mengetik sekali lalu berhenti, bukan menghapus dan mengulang. Untuk satu
 *    kalimat, pengulangan hanya berarti judul halaman menghapus dirinya
 *    sendiri berulang kali.
 */

export type BarisKetik = { teks: string; className?: string }

// useLayoutEffect memperingatkan kalau dipanggil saat render di server.
// Cabangnya tetap sama sepanjang hidup proses, jadi urutan hook tidak berubah.
const useTataLetak = typeof window === 'undefined' ? useEffect : useLayoutEffect

const KECEPATAN = 42      // ms dasar per karakter
const JITTER = 30         // ...ditambah acak sampai sekian ms, supaya tidak terdengar seperti metronom
const JEDA_SPASI = 45     // jeda ekstra sesudah spasi
const JEDA_BARIS = 260    // jeda saat berpindah baris
const JEDA_AWAL = 420     // menunggu animasi reveal mulai memunculkan judulnya
const KURSOR_PADAM = 2600 // kursor menghilang sekian ms sesudah kalimat selesai

export default function TextType({
  baris,
  className = '',
  as: Tag = 'h1',
}: {
  baris: BarisKetik[]
  className?: string
  as?: 'h1' | 'h2' | 'p' | 'div'
}) {
  const total = baris.reduce((n, b) => n + b.teks.length, 0)
  const kunci = baris.map((b) => b.teks).join(' ')

  // Nilai awal = teks utuh, supaya render di server dan hidrasi pertama sama-sama
  // berisi kalimat lengkap. Effect di bawah yang mengosongkannya sebelum dilukis.
  const [ketik, setKetik] = useState(total)
  const [kursorTampak, setKursorTampak] = useState(false)

  useTataLetak(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setKetik(total)
      setKursorTampak(false)
      return
    }

    const isi = baris.map((b) => b.teks)
    const batas: number[] = []
    let jml = 0
    for (const s of isi) { jml += s.length; batas.push(jml) }

    const karakterKe = (i: number) => {
      let awal = 0
      for (const s of isi) {
        if (i < awal + s.length) return s[i - awal]
        awal += s.length
      }
      return ''
    }
    const jeda = (sudah: number) => {
      if (sudah < total && batas.includes(sudah)) return JEDA_BARIS
      return KECEPATAN + Math.random() * JITTER + (karakterKe(sudah - 1) === ' ' ? JEDA_SPASI : 0)
    }

    let i = 0
    let id: ReturnType<typeof setTimeout>
    const langkah = () => {
      i += 1
      setKetik(i)
      id = i < total ? setTimeout(langkah, jeda(i)) : setTimeout(() => setKursorTampak(false), KURSOR_PADAM)
    }

    setKetik(0)
    setKursorTampak(true)
    id = setTimeout(langkah, JEDA_AWAL)
    return () => clearTimeout(id)
    // `baris` sengaja tidak masuk daftar: Hero membuat array barunya setiap
    // render, jadi menambahkannya akan memulai ulang pengetikan tanpa henti.
    // `kunci` sudah mewakili seluruh isinya.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci, total])

  // Kursor duduk di baris terakhir yang sudah tersentuh; saat tepat berada di
  // pergantian baris, ia ikut pindah ke baris berikutnya seperti caret sungguhan.
  let barisKursor = 0
  let jalan = 0
  baris.forEach((b, i) => {
    if (ketik >= jalan) barisKursor = i
    jalan += b.teks.length
  })

  let awal = 0
  return (
    // aria-label menjaga judulnya tetap utuh bagi pembaca layar walau di layar
    // baru separuh terketik.
    <Tag className={className} aria-label={kunci}>
      {baris.map((b, i) => {
        const mulai = awal
        awal += b.teks.length
        const n = Math.max(0, Math.min(ketik - mulai, b.teks.length))
        return (
          <Fragment key={i}>
            {i > 0 && <br />}
            <span className={b.className}>
              {b.teks.slice(0, n)}
              {kursorTampak && i === barisKursor && <span className="tt-kursor" aria-hidden="true" />}
              {n < b.teks.length && <span className="tt-sisa">{b.teks.slice(n)}</span>}
            </span>
          </Fragment>
        )
      })}
    </Tag>
  )
}

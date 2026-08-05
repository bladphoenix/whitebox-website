'use client'

import { useState } from 'react'

/* Kumpulan kolom isian kecil yang dipakai ulang di semua tab panel. */

export function Teks({
  label,
  value,
  onChange,
  baris,
  petunjuk,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  baris?: number
  petunjuk?: string
  placeholder?: string
}) {
  return (
    <label className="a-field">
      <span className="a-label">
        {label}
        {petunjuk && <em>{petunjuk}</em>}
      </span>
      {baris ? (
        <textarea
          rows={baris}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}

/** Sepasang isian Indonesia + Inggris. Sisi Inggris boleh dikosongkan —
 *  situs akan memakai teks Indonesia kalau begitu. */
export function Dwi({
  label,
  id,
  en,
  onId,
  onEn,
  baris,
}: {
  label: string
  id: string
  en: string
  onId: (v: string) => void
  onEn: (v: string) => void
  baris?: number
}) {
  return (
    <div className="a-dwi">
      <Teks label={`${label} · ID`} value={id} onChange={onId} baris={baris} />
      <Teks
        label={`${label} · EN`}
        value={en}
        onChange={onEn}
        baris={baris}
        placeholder="kosong = pakai teks Indonesia"
      />
    </div>
  )
}

/** Warna: pemilih visual kalau nilainya heksa, kotak teks untuk yang lain
 *  (beberapa kartu memakai var(--accent3) dan sejenisnya). */
export function Warna({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const heksa = /^#[0-9a-f]{6}$/i.test(value)
  return (
    <label className="a-field a-warna">
      <span className="a-label">{label}</span>
      <span className="a-warna-row">
        <input
          type="color"
          value={heksa ? value : '#000000'}
          disabled={!heksa}
          title={heksa ? 'Pilih warna' : 'Nilai bukan heksa — sunting sebagai teks'}
          onChange={(e) => onChange(e.target.value)}
        />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      </span>
    </label>
  )
}

export function Centang({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="a-centang">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

/** Satu baris dalam daftar: bisa dilipat, dinaikkan, diturunkan, dihapus. */
export function Baris({
  judul,
  ringkas,
  atas,
  bawah,
  hapus,
  bukaAwal,
  children,
}: {
  judul: string
  ringkas?: string
  atas: () => void
  bawah: () => void
  /** Tanpa ini tombol hapusnya tidak ditampilkan — dipakai untuk baris yang
   *  tidak boleh habis, misalnya gambar hero terakhir. */
  hapus?: () => void
  bukaAwal?: boolean
  children: React.ReactNode
}) {
  const [buka, setBuka] = useState(Boolean(bukaAwal))
  return (
    <div className={`a-baris${buka ? ' buka' : ''}`}>
      <div className="a-baris-kepala">
        <button type="button" className="a-baris-judul" onClick={() => setBuka(!buka)}>
          <i className={`fa-solid fa-chevron-${buka ? 'down' : 'right'}`} aria-hidden="true" />
          <strong>{judul || '(tanpa judul)'}</strong>
          {ringkas && <span className="a-baris-ringkas">{ringkas}</span>}
        </button>
        <span className="a-baris-alat">
          <button type="button" onClick={atas} title="Naikkan" aria-label="Naikkan">
            <i className="fa-solid fa-arrow-up" />
          </button>
          <button type="button" onClick={bawah} title="Turunkan" aria-label="Turunkan">
            <i className="fa-solid fa-arrow-down" />
          </button>
          {hapus && (
            <button
              type="button"
              className="a-hapus"
              title="Hapus"
              aria-label="Hapus"
              onClick={() => {
                if (confirm(`Hapus "${judul}"? Perubahan baru permanen setelah kamu menyimpan.`)) hapus()
              }}
            >
              <i className="fa-solid fa-trash" />
            </button>
          )}
        </span>
      </div>
      {buka && <div className="a-baris-isi">{children}</div>}
    </div>
  )
}

export function TambahBaris({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="a-tambah" onClick={onClick}>
      <i className="fa-solid fa-plus" /> {label}
    </button>
  )
}

/** Pindahkan elemen daftar; di ujung tidak melakukan apa-apa. */
export function geser<T>(arr: T[], dari: number, ke: number): T[] {
  if (ke < 0 || ke >= arr.length) return arr
  const salinan = [...arr]
  const [item] = salinan.splice(dari, 1)
  salinan.splice(ke, 0, item)
  return salinan
}

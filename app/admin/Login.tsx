'use client'

import { useState } from 'react'
import Tema from './Tema'

export default function Login() {
  const [sandi, setSandi] = useState('')
  const [sibuk, setSibuk] = useState(false)
  const [salah, setSalah] = useState('')

  async function kirim(e: React.FormEvent) {
    e.preventDefault()
    setSibuk(true)
    setSalah('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: sandi }),
      })
      if (res.ok) {
        // Muat ulang penuh: halaman /admin dirender di server dan baru akan
        // menampilkan editor setelah cookie sesinya ikut terkirim.
        location.reload()
        return
      }
      const data = await res.json().catch(() => ({}))
      setSalah(data.pesan || `Gagal masuk (HTTP ${res.status}).`)
    } catch {
      setSalah('Tidak bisa menghubungi server.')
    } finally {
      setSibuk(false)
    }
  }

  return (
    <div className="a-masuk">
      <div className="a-masuk-tema">
        <Tema />
      </div>
      <form className="a-masuk-kotak" onSubmit={kirim}>
        <h1>Panel Isi Situs</h1>
        <p>Whitebox.asia</p>
        <label className="a-field">
          <span className="a-label">Kata sandi</span>
          <input
            type="password"
            value={sandi}
            autoFocus
            autoComplete="current-password"
            onChange={(e) => setSandi(e.target.value)}
          />
        </label>
        {salah && <div className="a-masuk-salah">{salah}</div>}
        <button type="submit" className="a-btn utama" disabled={sibuk || !sandi}>
          {sibuk ? 'Memeriksa…' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}

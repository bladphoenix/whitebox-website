'use client'

import { useEffect, useState } from 'react'

/** Kunci sendiri, bukan `mf-theme` milik situs: panel ini alat kerja, dan
 *  temanya tidak boleh ikut mengubah tampilan situs yang sedang dipratinjau
 *  di tab sebelah. */
export const KUNCI_TEMA = 'mf-admin-theme'

/** Dipasang di <head> panel supaya temanya sudah benar sebelum halaman
 *  tergambar. Kalau menunggu React, layar sempat berkedip gelap dulu.
 *  Isinya harus sepakat dengan komponen di bawah. */
export const SKRIP_TEMA = `(function(){try{
var k=${JSON.stringify(KUNCI_TEMA)},t=localStorage.getItem(k);
if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
document.documentElement.setAttribute('data-theme',t);
}catch(e){}})();`

export default function Tema() {
  const [tema, setTema] = useState<'dark' | 'light'>('dark')

  // Baru dibaca sesudah terpasang. Saat render pertama, server tidak punya
  // localStorage — kalau dibaca di sana, tandanya beda dan React mengeluh.
  useEffect(() => {
    setTema(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')
  }, [])

  const tukar = () => {
    const baru = tema === 'dark' ? 'light' : 'dark'
    setTema(baru)
    document.documentElement.setAttribute('data-theme', baru)
    try {
      localStorage.setItem(KUNCI_TEMA, baru)
    } catch {
      // mode penyamaran / penyimpanan diblokir — temanya tetap berganti,
      // hanya tidak diingat
    }
  }

  const label = tema === 'dark' ? 'Ganti ke tampilan terang' : 'Ganti ke tampilan gelap'
  return (
    <button type="button" className="a-btn a-tema" onClick={tukar} title={label} aria-label={label}>
      <i className={`fa-solid ${tema === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
    </button>
  )
}

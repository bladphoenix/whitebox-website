import type { Metadata } from 'next'
import './admin.css'
import { SKRIP_TEMA } from './Tema'

export const metadata: Metadata = {
  title: 'Panel Isi Situs — Whitebox.asia',
  // Panel ini terbuka di internet; jangan sampai ikut terindeks.
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dijalankan sebelum isi panel selesai diurai, jadi tema tersimpan
          sudah terpasang sebelum ada yang tergambar. Tata letak root menulis
          data-theme="dark" di <html>; nilainya ditimpa di sini. */}
      <script dangerouslySetInnerHTML={{ __html: SKRIP_TEMA }} />
      <div className="a-root">{children}</div>
    </>
  )
}

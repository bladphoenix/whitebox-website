import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Panel Isi Situs — Whitebox.asia',
  // Panel ini terbuka di internet; jangan sampai ikut terindeks.
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="a-root">{children}</div>
}

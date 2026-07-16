'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'id' | 'en'

export const translations = {
  id: {
    nav: {
      home: 'Beranda',
      services: 'Layanan',
      portfolio: 'Portofolio',
      pricing: 'Harga',
      testimonials: 'Testimoni',
      contact: 'Kontak',
      cta: 'Hubungi Saya',
    },
    hero: {
      badge: 'Freelance Specialist',
      titleTop: 'Bangun Website Cepat &',
      titleAccent: 'Server Stabil.',
      sub: 'Kami dari Whitebox.asia — spesialis yang fokus pada performa web, optimasi SEO, dan manajemen infrastruktur cloud yang aman dan skalabel.',
      btnPrimary: 'Lihat Proyek',
      btnGhost: 'Layanan Saya',
      stats: [
        { num: '50+', label: 'Proyek Selesai' },
        { num: '5yr+', label: 'Pengalaman' },
        { num: '99%', label: 'Uptime Server' },
      ],
      quote: '"Mengelola infrastruktur Cloud Container & Google Cloud dengan presisi tinggi."',
    },
    services: {
      label: 'Keahlian',
      title: 'Solusi Teknis End-to-End',
      sub: 'Dari desain antarmuka hingga deployment infrastruktur cloud.',
      cards: [
        { title: 'Web Design', desc: 'Pembuatan website responsif menggunakan PHP, Python, dan Kotlin dengan standar performa tinggi.' },
        { title: 'SEO Expert', desc: 'Optimasi kecepatan dan struktur data untuk menempati halaman pertama Google secara organik.' },
        { title: 'VPS Setup', desc: 'Konfigurasi Ubuntu/Debian di Azure, DigitalOcean, atau AWS dengan keamanan berlapis.' },
        { title: 'Server Management', desc: 'Manajemen cPanel, Docker Registry, dan keamanan direktori server secara profesional.' },
      ],
    },
    projects: {
      label: 'Portofolio',
      title: 'Karya yang Sudah Online',
      sub: 'Sebagian brand & instansi yang mempercayakan website dan sistemnya kepada kami.',
      visit: 'Kunjungi',
      visitSite: 'Kunjungi situs',
    },
    pricing: {
      label: 'Harga',
      title: 'Paket & Layanan',
      sub: 'Solusi infrastruktur, website, dan layanan kreatif profesional.',
      creativeTitle: 'Layanan Kreatif & Desain',
    },
    workflow: {
      label: 'Alur Kerja',
      title: 'Proses Transparan',
      sub: '4 langkah sederhana menuju proyek sukses.',
      steps: [
        { title: 'Konsultasi', desc: 'Diskusikan kebutuhan proyek, target SEO, atau spesifikasi server via WA/Telegram.' },
        { title: 'Penawaran & DP', desc: 'Estimasi biaya dan waktu dikirim. Pengerjaan dimulai setelah konfirmasi DP.' },
        { title: 'Eksekusi', desc: 'Development website, setup VPS, atau audit domain sesuai paket yang dipilih.' },
        { title: 'Serah Terima', desc: 'Review hasil kerja, pelunasan, dan penyerahan akses penuh (FTP/Shell/cPanel).' },
      ],
    },
    testimonials: {
      label: 'Testimoni',
      title: 'Apa Kata Klien Kami',
      sub: 'Cerita nyata dari pemilik bisnis, kreator, dan profesional yang kami bantu.',
      summaryStrong: '5,0',
      summaryText: 'rata-rata dari klien di berbagai kota Indonesia',
    },
    contact: {
      label: 'Kontak',
      titleLine1: 'Siap Mulai',
      titleLine2: 'Proyek Anda?',
      sub: 'Hubungi kami langsung untuk cek stok domain, konsultasi infrastruktur, atau pendaftaran kursus webshell.',
      availability: 'Tersedia Senin–Sabtu, 09.00–21.00 WIB',
    },
  },

  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      testimonials: 'Testimonials',
      contact: 'Contact',
      cta: 'Contact Me',
    },
    hero: {
      badge: 'Freelance Specialist',
      titleTop: 'Build Fast Websites &',
      titleAccent: 'Stable Servers.',
      sub: 'We are Whitebox.asia — a specialist focused on web performance, SEO optimization, and secure, scalable cloud infrastructure management.',
      btnPrimary: 'View Projects',
      btnGhost: 'My Services',
      stats: [
        { num: '50+', label: 'Completed Projects' },
        { num: '5yr+', label: 'Experience' },
        { num: '99%', label: 'Server Uptime' },
      ],
      quote: '"Managing Cloud Container & Google Cloud infrastructure with high precision."',
    },
    services: {
      label: 'Expertise',
      title: 'End-to-End Technical Solutions',
      sub: 'From interface design to cloud infrastructure deployment.',
      cards: [
        { title: 'Web Design', desc: 'Building responsive websites with PHP, Python, and Kotlin to high-performance standards.' },
        { title: 'SEO Expert', desc: 'Speed and structured-data optimization to organically rank on Google’s first page.' },
        { title: 'VPS Setup', desc: 'Ubuntu/Debian configuration on Azure, DigitalOcean, or AWS with layered security.' },
        { title: 'Server Management', desc: 'Professional management of cPanel, Docker Registry, and server directory security.' },
      ],
    },
    projects: {
      label: 'Portfolio',
      title: 'Work That’s Already Live',
      sub: 'A selection of brands & institutions that trusted us with their website and systems.',
      visit: 'Visit',
      visitSite: 'Visit site',
    },
    pricing: {
      label: 'Pricing',
      title: 'Packages & Services',
      sub: 'Professional infrastructure, website, and creative-service solutions.',
      creativeTitle: 'Creative & Design Services',
    },
    workflow: {
      label: 'Workflow',
      title: 'A Transparent Process',
      sub: '4 simple steps to a successful project.',
      steps: [
        { title: 'Consultation', desc: 'Discuss your project needs, SEO targets, or server specs via WhatsApp/Telegram.' },
        { title: 'Quote & Deposit', desc: 'A cost and time estimate is sent. Work begins once the deposit is confirmed.' },
        { title: 'Execution', desc: 'Website development, VPS setup, or domain audit based on the chosen package.' },
        { title: 'Handover', desc: 'Review the results, settle payment, and receive full access (FTP/Shell/cPanel).' },
      ],
    },
    testimonials: {
      label: 'Testimonials',
      title: 'What Our Clients Say',
      sub: 'Real stories from business owners, creators, and professionals we’ve helped.',
      summaryStrong: '5.0',
      summaryText: 'average rating from clients across Indonesia',
    },
    contact: {
      label: 'Contact',
      titleLine1: 'Ready to Start',
      titleLine2: 'Your Project?',
      sub: 'Contact us directly to check domain stock, discuss infrastructure, or enroll in the webshell course.',
      availability: 'Available Mon–Sat, 9 AM–9 PM WIB',
    },
  },
}

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (typeof translations)['id']
}

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id')

  useEffect(() => {
    const saved = localStorage.getItem('mf-lang') as Lang | null
    if (saved === 'id' || saved === 'en') {
      setLangState(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('mf-lang', l)
    document.documentElement.lang = l
  }

  const toggle = () => setLang(lang === 'id' ? 'en' : 'id')

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

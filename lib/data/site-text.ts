/* Teks pendek tiap section, dua bahasa.
 *
 * Dulu ini satu berkas dengan lib/i18n.tsx. Dipisah karena isinya sekarang
 * bisa disunting dari /admin, jadi harus bisa dibaca dari sisi server juga —
 * dan lib/i18n.tsx adalah komponen klien.
 *
 * Daftar (kartu layanan, statistik hero, langkah alur kerja) sengaja TIDAK
 * ada di sini. Di pohon id/en yang terpisah, satu kartu harus disunting di
 * dua tempat dan urutan indeksnya wajib sama persis — gampang meleset. Semua
 * daftar pindah ke site-data.ts dengan pasangan `x` / `xEn` bersebelahan. */

export type SectionText = {
  nav: {
    home: string
    services: string
    portfolio: string
    pricing: string
    testimonials: string
    contact: string
    cta: string
  }
  hero: {
    badge: string
    titleTop: string
    titleAccent: string
    sub: string
    btnPrimary: string
    btnGhost: string
    quote: string
  }
  services: { label: string; title: string; sub: string }
  projects: { label: string; title: string; sub: string; visit: string; visitSite: string }
  pricing: { label: string; title: string; sub: string; creativeTitle: string }
  workflow: { label: string; title: string; sub: string }
  testimonials: {
    label: string
    title: string
    sub: string
    summaryStrong: string
    summaryText: string
  }
  contact: {
    label: string
    titleLine1: string
    titleLine2: string
    sub: string
    availability: string
  }
}

export type SiteText = { id: SectionText; en: SectionText }

export const siteText: SiteText = {
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
      quote: '"Mengelola infrastruktur Cloud Container & Google Cloud dengan presisi tinggi."',
    },
    services: {
      label: 'Keahlian',
      title: 'Solusi Teknis End-to-End',
      sub: 'Dari desain antarmuka hingga deployment infrastruktur cloud.',
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
      quote: '"Managing Cloud Container & Google Cloud infrastructure with high precision."',
    },
    services: {
      label: 'Expertise',
      title: 'End-to-End Technical Solutions',
      sub: 'From interface design to cloud infrastructure deployment.',
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

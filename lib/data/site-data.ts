/* Data isi situs — bentuk awal (seed).
 *
 * Semua isi yang bisa disunting dari /admin berangkat dari sini. Saat pertama
 * kali dijalankan, lib/content-store.ts menulis berkas ini menjadi JSON di
 * DATA_DIR; sesudah itu JSON-lah yang dipakai dan berkas ini hanya jadi
 * cadangan kalau ada kunci baru yang belum ada di JSON lama.
 *
 * Jangan menambah 'use client' di sini — modul ini dibaca dari sisi server. */

export type PriceFeature = {
  text: string
  textEn: string
  iconColor?: string
  icon?: string
  cls?: string
}

export type PriceCard = {
  name: string
  nameEn: string
  desc?: string
  descEn?: string
  amount: string
  amountEn?: string
  amountSuffix?: string
  amountSuffixEn?: string
  amountColor?: string
  features: PriceFeature[]
  btnText: string
  btnTextEn: string
  btnVariant: 'outline' | 'solid'
  accent?: string
  featured?: boolean
  badge?: string
  badgeEn?: string
  /** harga sejajar nama (bukan di bawahnya) — dipakai baris kedua & kartu kreatif */
  amountInline?: boolean
  /** ukuran font harga saat amountInline, mis. '1.8rem' */
  amountSize?: string
  /** deskripsi ikut di dalam baris judul, bukan di bawahnya */
  descInHeader?: boolean
  /** daftar fitur dipecah jadi dua kolom */
  featureColumns?: 2
}

export type Project = {
  domain: string
  img: string
  tag: string
  tagEn: string
  color: string
}

export type Testimonial = {
  service: string
  serviceEn: string
  color: string
  name: string
  role: string
  roleEn: string
  location: string
  quote: string
  quoteEn: string
  rating: number
  /** disembunyikan dari situs, tapi tetap tersimpan */
  hidden?: boolean
}

export type ServiceCard = {
  title: string
  titleEn: string
  desc: string
  descEn: string
  icon: string
  iconColor: string
  iconBg: string
}

export type HeroStat = { num: string; label: string; labelEn: string }
export type WorkflowStep = { title: string; titleEn: string; desc: string; descEn: string }

/* ── Layanan ─────────────────────────────────────────────────────────
   Sebelumnya teksnya ada di lib/i18n.tsx dan ikonnya di components/
   Services.tsx. Digabung di sini supaya satu kartu = satu baris data. */
export const services: ServiceCard[] = [
  {
    title: 'Web Design',
    titleEn: 'Web Design',
    desc: 'Pembuatan website responsif menggunakan PHP, Python, dan Kotlin dengan standar performa tinggi.',
    descEn: 'Building responsive websites with PHP, Python, and Kotlin to high-performance standards.',
    icon: 'fa-solid fa-code',
    iconColor: '#3b82f6',
    iconBg: 'rgba(37,99,235,0.1)',
  },
  {
    title: 'SEO Expert',
    titleEn: 'SEO Expert',
    desc: 'Optimasi kecepatan dan struktur data untuk menempati halaman pertama Google secara organik.',
    descEn: 'Speed and structured-data optimization to organically rank on Google’s first page.',
    icon: 'fa-solid fa-chart-line',
    iconColor: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
  },
  {
    title: 'VPS Setup',
    titleEn: 'VPS Setup',
    desc: 'Konfigurasi Ubuntu/Debian di Azure, DigitalOcean, atau AWS dengan keamanan berlapis.',
    descEn: 'Ubuntu/Debian configuration on Azure, DigitalOcean, or AWS with layered security.',
    icon: 'fa-solid fa-server',
    iconColor: '#8b5cf6',
    iconBg: 'rgba(109,40,217,0.1)',
  },
  {
    title: 'Server Management',
    titleEn: 'Server Management',
    desc: 'Manajemen cPanel, Docker Registry, dan keamanan direktori server secara profesional.',
    descEn: 'Professional management of cPanel, Docker Registry, and server directory security.',
    icon: 'fa-solid fa-network-wired',
    iconColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.1)',
  },
]

/* ── Hero ────────────────────────────────────────────────────────── */
export const heroStats: HeroStat[] = [
  { num: '50+', label: 'Proyek Selesai', labelEn: 'Completed Projects' },
  { num: '5yr+', label: 'Pengalaman', labelEn: 'Experience' },
  { num: '99%', label: 'Uptime Server', labelEn: 'Server Uptime' },
]

/* Gambar hero — dipakai korsel bertumpuk. Yang pertama tampil paling depan
   saat halaman baru dibuka. Semuanya dipilih yang bernuansa gelap supaya tidak
   menabrak tema situs; yang terang membuat bingkainya seperti berlubang. */
export const heroImages = [
  // monitor melengkung berisi kode — gambar hero lama
  'https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=800&auto=format&fit=crop',
  // MacBook Pro dengan editor gelap
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  // rak server
  'https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?q=80&w=800&auto=format&fit=crop',
  // panel kabel jaringan
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
  // deretan perangkat di ruang data
  'https://images.unsplash.com/photo-1639066648921-82d4500abf1a?q=80&w=800&auto=format&fit=crop',
]

/* ── Alur kerja ──────────────────────────────────────────────────── */
export const workflowSteps: WorkflowStep[] = [
  {
    title: 'Konsultasi',
    titleEn: 'Consultation',
    desc: 'Diskusikan kebutuhan proyek, target SEO, atau spesifikasi server via WA/Telegram.',
    descEn: 'Discuss your project needs, SEO targets, or server specs via WhatsApp/Telegram.',
  },
  {
    title: 'Penawaran & DP',
    titleEn: 'Quote & Deposit',
    desc: 'Estimasi biaya dan waktu dikirim. Pengerjaan dimulai setelah konfirmasi DP.',
    descEn: 'A cost and time estimate is sent. Work begins once the deposit is confirmed.',
  },
  {
    title: 'Eksekusi',
    titleEn: 'Execution',
    desc: 'Development website, setup VPS, atau audit domain sesuai paket yang dipilih.',
    descEn: 'Website development, VPS setup, or domain audit based on the chosen package.',
  },
  {
    title: 'Serah Terima',
    titleEn: 'Handover',
    desc: 'Review hasil kerja, pelunasan, dan penyerahan akses penuh (FTP/Shell/cPanel).',
    descEn: 'Review the results, settle payment, and receive full access (FTP/Shell/cPanel).',
  },
]

/* ── Kontak ──────────────────────────────────────────────────────── */
export const contactLinks = {
  /* nomor saja, tanpa + atau spasi — dipakai jadi https://wa.me/<nomor> */
  whatsapp: '62859191749378',
  /* boleh nomor (+62…) atau username; jadi https://t.me/<nilai> */
  telegram: '+6287821381136',
}

/* ── Portofolio ──────────────────────────────────────────────────── */
export const projects: Project[] = [
  {
    domain: 'rsud-iskak.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/rsud-iskak.com_zp2z5m.png',
    tag: 'Instansi Kesehatan',
    tagEn: 'Healthcare Institution',
    color: '#3b82f6',
  },
  {
    domain: 'colosseumcorporation.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086499/colosseumcorporation.com_t7b0qf.png',
    tag: 'Korporat',
    tagEn: 'Corporate',
    color: '#14b8a6',
  },
  {
    domain: 'serum78.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/serum78.com_ztqr7q.png',
    tag: 'Brand & Skincare',
    tagEn: 'Brand & Skincare',
    color: '#f43f5e',
  },
  {
    domain: 'verosdjayasteel.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086499/verosdjayasteel.com_eud2vc.png',
    tag: 'Produsen Kandang Ayam',
    tagEn: 'Poultry Cage Manufacturer',
    color: '#f97316',
  },
  {
    domain: 'balitravel.store',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086500/balitravel.store_zs4w34.png',
    tag: 'Travel & Tour',
    tagEn: 'Travel & Tour',
    color: '#06b6d4',
  },
  {
    domain: 'balisundaytour.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086500/balisundaytour.com_vtq59d.png',
    tag: 'Travel & Tour',
    tagEn: 'Travel & Tour',
    color: '#06b6d4',
  },
  {
    domain: 'holidaytobali.info',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086499/holidaytobali.info_dyti8h.png',
    tag: 'Travel & Tour',
    tagEn: 'Travel & Tour',
    color: '#06b6d4',
  },
  {
    domain: 'kostulungagung.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/kostulungagung.com_a7xr2l.png',
    tag: 'Properti & Kos',
    tagEn: 'Property & Boarding',
    color: '#10b981',
  },
  {
    domain: 'perdana-mentri.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/perdana-mentri.com_bnktqc.png',
    tag: 'Portal Berita',
    tagEn: 'News Portal',
    color: '#ef4444',
  },
  {
    domain: 'perdanamentri.com',
    img: 'https://res.cloudinary.com/dmis60dxy/image/upload/v1784086501/perdanamentri.com_zb00tx.png',
    tag: 'Portal Berita',
    tagEn: 'News Portal',
    color: '#ef4444',
  },
]

/* ── Harga: kartu utama ──────────────────────────────────────────── */
export const pricingMain: PriceCard[] = [
  {
    name: 'Web Design',
    nameEn: 'Web Design',
    desc: 'Untuk website baru atau company profile',
    descEn: 'For a new website or company profile',
    amount: 'IDR 500k',
    amountSuffix: '/proyek',
    amountSuffixEn: '/project',
    features: [
      { text: 'Desain Responsif & Modern', textEn: 'Responsive & Modern Design' },
      { text: 'Optimasi Kecepatan', textEn: 'Speed Optimization' },
      { text: 'Integrasi Google Search', textEn: 'Google Search Integration' },
    ],
    btnText: 'Pesan Sekarang',
    btnTextEn: 'Order Now',
    btnVariant: 'outline',
  },
  {
    name: 'Premium Aged Domain',
    nameEn: 'Premium Aged Domain',
    desc: 'DR tinggi & profil backlink berkualitas',
    descEn: 'High DR & quality backlink profile',
    amount: 'Hubungi',
    amountEn: 'Contact',
    amountSuffix: ' untuk harga',
    amountSuffixEn: ' for pricing',
    amountColor: 'var(--accent)',
    features: [
      { text: 'High Domain Rating (DR)', textEn: 'High Domain Rating (DR)' },
      { text: 'Akses Full: FTP / Shell / cPanel', textEn: 'Full Access: FTP / Shell / cPanel' },
      { text: 'Audit Backlink Manual', textEn: 'Manual Backlink Audit' },
      { text: 'Sesuai ketersediaan stok', textEn: 'Subject to stock availability' },
    ],
    btnText: 'Cek Stok Domain',
    btnTextEn: 'Check Domain Stock',
    btnVariant: 'solid',
    featured: true,
    badge: 'Stok Terbatas',
    badgeEn: 'Limited Stock',
  },
  {
    name: 'Webshell Course',
    nameEn: 'Webshell Course',
    desc: 'Kursus intensif 1-on-1 via Zoom/Meet',
    descEn: 'Intensive 1-on-1 course via Zoom/Meet',
    amount: 'IDR 25jt',
    amountSuffix: '/batch',
    amountSuffixEn: '/batch',
    amountColor: 'var(--accent2)',
    features: [
      { text: 'Manajemen Akses Shell', textEn: 'Shell Access Management', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
      { text: 'Scripting & Automasi Server', textEn: 'Server Scripting & Automation', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
      { text: 'Pengamanan Celah Keamanan', textEn: 'Security Vulnerability Hardening', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
      { text: 'Mentoring Privat 1-on-1', textEn: 'Private 1-on-1 Mentoring', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
    ],
    btnText: 'Daftar Kursus',
    btnTextEn: 'Enroll Now',
    btnVariant: 'outline',
    accent: 'var(--accent2)',
  },
  {
    name: 'Jasa Backlink SEO',
    nameEn: 'SEO Backlink Service',
    desc: 'Tingkatkan otoritas & ranking di Google',
    descEn: 'Boost your authority & Google ranking',
    amount: 'IDR 850k - 5jt',
    amountSuffix: ' /paket',
    amountSuffixEn: ' /package',
    amountColor: '#10b981',
    features: [
      { text: 'High DA/PA & DR Tertarget', textEn: 'Targeted High DA/PA & DR', iconColor: '#10b981' },
      { text: 'Contextual & Permanent Link', textEn: 'Contextual & Permanent Links', iconColor: '#10b981' },
      { text: 'Termasuk Artikel SEO 500 Kata', textEn: 'Includes a 500-word SEO article', iconColor: '#10b981' },
      { text: 'Report Lengkap & Transparan', textEn: 'Complete & Transparent Report', iconColor: '#10b981' },
    ],
    btnText: 'Tingkatkan Ranking',
    btnTextEn: 'Boost My Ranking',
    btnVariant: 'outline',
    accent: '#10b981',
  },
  {
    name: 'Jasa Social Media Ads',
    nameEn: 'Social Media Ads',
    desc: 'Scale up bisnis dengan kampanye berbayar',
    descEn: 'Scale up your business with paid campaigns',
    amount: 'IDR 500k - 20jt',
    amountSuffix: ' /bulan',
    amountSuffixEn: ' /month',
    amountColor: '#f43f5e',
    features: [
      { text: 'Setup Meta (FB/IG) & TikTok Pixel', textEn: 'Meta (FB/IG) & TikTok Pixel Setup', iconColor: '#f43f5e' },
      { text: 'Riset Audiens & Copywriting Iklan', textEn: 'Audience Research & Ad Copywriting', iconColor: '#f43f5e' },
      { text: 'A/B Testing Winning Campaign', textEn: 'A/B Testing for Winning Campaigns', iconColor: '#f43f5e' },
      { text: 'Laporan Performa & ROI Mingguan', textEn: 'Weekly Performance & ROI Reports', iconColor: '#f43f5e' },
    ],
    btnText: 'Mulai Kampanye Ads',
    btnTextEn: 'Start an Ad Campaign',
    btnVariant: 'outline',
    accent: '#f43f5e',
  },
  {
    name: 'Jasa Build PBN',
    nameEn: 'PBN Build Service',
    desc: 'Bangun jaringan blog privat super aman',
    descEn: 'Build a rock-solid private blog network',
    amount: 'IDR 1.5jt - 10jt',
    amountSuffix: ' /network',
    amountSuffixEn: ' /network',
    amountColor: '#f97316',
    features: [
      { text: 'IP Server / Hosting Berbeda (No Footprint)', textEn: 'Separate Server / Hosting IPs (No Footprint)', iconColor: '#f97316' },
      { text: 'Setup Premium Aged Domain & WP', textEn: 'Premium Aged Domain & WP Setup', iconColor: '#f97316' },
      { text: 'Termasuk Artikel Unik & Terjadwal', textEn: 'Includes Unique, Scheduled Articles', iconColor: '#f97316' },
      { text: 'Proteksi Anti-Bot & Crawler Blocker', textEn: 'Anti-Bot Protection & Crawler Blocker', iconColor: '#f97316' },
    ],
    btnText: 'Bangun PBN Sekarang',
    btnTextEn: 'Build My PBN Now',
    btnVariant: 'outline',
    accent: '#f97316',
  },
]

/* ── Harga: baris kedua (dua kartu lebar) ────────────────────────── */
export const pricingRow2: PriceCard[] = [
  {
    name: 'Full Stack & Server',
    nameEn: 'Full Stack & Server',
    desc: 'Solusi lengkap web + cloud deployment',
    descEn: 'Complete web + cloud deployment solution',
    amount: 'Custom',
    amountSuffix: '/estimasi',
    amountSuffixEn: '/estimate',
    features: [
      { text: 'Web Design + SEO Full', textEn: 'Full Web Design + SEO' },
      { text: 'Deployment Enterprise Cloud Container', textEn: 'Enterprise Cloud Container Deployment' },
      { text: 'Setup Monitoring Otomatis', textEn: 'Automated Monitoring Setup' },
    ],
    btnText: 'Konsultasi Gratis',
    btnTextEn: 'Free Consultation',
    btnVariant: 'outline',
  },
  {
    name: 'Manajemen Server',
    nameEn: 'Server Management',
    desc: 'Pemeliharaan rutin infrastruktur',
    descEn: 'Routine infrastructure maintenance',
    amount: 'IDR 1jt',
    amountSuffix: '/bln',
    amountSuffixEn: '/mo',
    amountColor: '#ef4444',
    amountInline: true,
    amountSize: '2rem',
    descInHeader: true,
    featureColumns: 2,
    features: [
      { text: 'Backup Terjadwal', textEn: 'Scheduled Backups' },
      { text: 'Patching Rutin', textEn: 'Routine Patching' },
      { text: 'Uptime 24/7', textEn: '24/7 Uptime' },
      { text: 'Support Prioritas', textEn: 'Priority Support' },
    ],
    btnText: 'Mulai Langganan',
    btnTextEn: 'Start Subscription',
    btnVariant: 'solid',
    accent: '#ef4444',
  },
]

/* ── Harga: layanan kreatif ──────────────────────────────────────── */
export const pricingCreative: PriceCard[] = [
  {
    name: 'Jasa Desain Logo',
    nameEn: 'Logo Design Service',
    amount: 'IDR 300k',
    amountColor: 'var(--accent3)',
    amountInline: true,
    amountSize: '1.8rem',
    features: [
      { text: '3 Opsi Desain Unik', textEn: '3 Unique Design Options', iconColor: 'var(--accent3)' },
      { text: 'File Vektor (SVG/AI)', textEn: 'Vector Files (SVG/AI)', iconColor: 'var(--accent3)' },
      { text: 'Resolusi Tinggi (PNG/JPG)', textEn: 'High Resolution (PNG/JPG)', iconColor: 'var(--accent3)' },
      { text: 'Revisi Sampai Puas', textEn: 'Unlimited Revisions', iconColor: 'var(--accent3)' },
      { text: 'Versi Transparan (PNG)', textEn: 'Transparent Version (PNG)', iconColor: 'var(--accent3)' },
      { text: 'Versi Gelap & Terang', textEn: 'Dark & Light Versions', iconColor: 'var(--accent3)' },
      { text: 'Free Mockup Presentasi', textEn: 'Free Presentation Mockup', iconColor: 'var(--accent3)' },
    ],
    btnText: 'Pesan Desain Logo',
    btnTextEn: 'Order Logo Design',
    btnVariant: 'outline',
    accent: 'var(--accent3)',
  },
  {
    name: 'Jasa Bikin CV',
    nameEn: 'CV / Resume Service',
    amount: 'IDR 150k',
    amountColor: '#eab308',
    amountInline: true,
    amountSize: '1.8rem',
    features: [
      { text: 'Desain Standar ATS', textEn: 'ATS-Compliant Design', iconColor: '#eab308' },
      { text: 'Format PDF & Word', textEn: 'PDF & Word Formats', iconColor: '#eab308' },
      { text: 'Konsultasi Tata Bahasa', textEn: 'Grammar Consultation', iconColor: '#eab308' },
      { text: 'Revisi Gratis 1x', textEn: '1x Free Revision', iconColor: '#eab308' },
      { text: 'Desain Modern & Profesional', textEn: 'Modern & Professional Design', iconColor: '#eab308' },
      { text: 'Pengerjaan Maks. 1x24 Jam', textEn: 'Delivered within 24 hours', iconColor: '#eab308' },
      { text: 'Template Eksklusif Anti-Pasaran', textEn: 'Exclusive, Non-Generic Template', iconColor: '#eab308' },
    ],
    btnText: 'Tingkatkan Karir',
    btnTextEn: 'Boost My Career',
    btnVariant: 'outline',
    accent: '#eab308',
  },
  {
    name: 'Aplikasi Premium',
    nameEn: 'Premium Apps',
    desc: 'Akun premium bergaransi, dijamin aman 100%',
    descEn: 'Guaranteed premium accounts, 100% safe',
    amount: '10k – 100k',
    amountColor: '#a855f7',
    amountInline: true,
    amountSize: '1.3rem',
    features: [
      { text: 'CapCut Pro', textEn: 'CapCut Pro', iconColor: '#a855f7' },
      { text: 'Gemini Pro', textEn: 'Gemini Pro', iconColor: '#a855f7' },
      { text: 'Canva Pro', textEn: 'Canva Pro', iconColor: '#a855f7' },
      { text: 'ChatGPT Plus', textEn: 'ChatGPT Plus', iconColor: '#a855f7' },
      { text: 'Getcontact Premium', textEn: 'Getcontact Premium', iconColor: '#a855f7' },
      { text: 'YouTube Premium', textEn: 'YouTube Premium', iconColor: '#a855f7' },
      { text: 'Vidio Platinum', textEn: 'Vidio Platinum', iconColor: '#a855f7' },
      { text: 'Untuk Aplikasi tertentu bisa request', textEn: 'Certain apps available on request', iconColor: '#a855f7' },
    ],
    btnText: 'Tanya Harga',
    btnTextEn: 'Ask for Price',
    btnVariant: 'outline',
    accent: '#a855f7',
  },
]

/* ── Testimoni ───────────────────────────────────────────────────── */
export const testimonials: Testimonial[] = [
  {
    service: 'Web Design',
    serviceEn: 'Web Design',
    color: '#3b82f6',
    name: 'Rangga Prasetyo',
    role: 'Pemilik Bengkel Motor RP Speed',
    roleEn: 'Owner, RP Speed Motorcycle Workshop',
    location: 'Sidoarjo',
    quote:
      'Terus terang harga 500rb sempat bikin saya ragu, mikir paling dapat website seadanya. Ternyata dikerjakan rapi, seminggu kelar dan enteng dibuka dari HP. Sekarang kalau orang nyari bengkel di daerah saya, RP Speed ikut nongol di Google, dan hampir tiap minggu ada 3-4 orang baru yang bilang nemu saya dari situ.',
    quoteEn:
      'Honestly the IDR 500k price made me hesitate at first — I figured I would just get a bare-bones site. Turns out it was done neatly, finished in a week and loads easily on a phone. Now when people search for a workshop in my area, RP Speed shows up on Google, and almost every week 3–4 new customers say they found me there.',
    rating: 5,
  },
  {
    service: 'Premium Aged Domain',
    serviceEn: 'Premium Aged Domain',
    color: '#06b6d4',
    name: 'Bagas Prakoso',
    role: 'Affiliate Marketer & Pemilik Money Site',
    roleEn: 'Affiliate Marketer & Money Site Owner',
    location: 'Malang',
    quote:
      'Saya termasuk yang hati-hati kalau beli aged domain, soalnya sering nemu backlink-nya penuh spam judi. Yang bikin saya mau lanjut, auditnya manual dan dibreakdown per referring domain, bukan cuma tempel angka DR doang. Domain DR 38 yang saya ambil sekarang jadi money site utama, artikel baru rata-rata keindeks 2-3 hari. Akses cPanel sama FTP dikasih penuh dari awal, jadi pas mau pindah ke server sendiri nggak pusing.',
    quoteEn:
      'I am cautious when buying aged domains because the backlinks are often full of gambling spam. What convinced me was the manual audit, broken down per referring domain instead of just slapping on a DR number. The DR 38 domain I bought is now my main money site, and new articles get indexed in 2–3 days on average. Full cPanel and FTP access was handed over from the start, so migrating to my own server was painless.',
    rating: 5,
  },
  {
    service: 'Webshell Course',
    serviceEn: 'Webshell Course',
    color: '#7c3aed',
    name: 'Fajar Nugroho',
    role: 'Junior DevOps Engineer',
    roleEn: 'Junior DevOps Engineer',
    location: 'Semarang',
    quote:
      'Kelasnya private one-on-one, jadi aku bisa nanya sampai bener-bener paham, nggak kayak tutorial YouTube yang suka loncat-loncat. Sekarang aku udah pegang akses shell di server production dan sempat bikin script backup otomatis yang jalan tiap malam. Malah pas audit internal kemarin aku nemu celah permission yang selama ini kelewat. Buat aku pribadi, materinya nyambung banget sama kerjaan sehari-hari.',
    quoteEn:
      'The class was private one-on-one, so I could keep asking until I really understood — not like YouTube tutorials that skip around. Now I handle shell access on a production server and even built an automated backup script that runs every night. During a recent internal audit I actually found a permission hole that had been overlooked. For me, the material ties in perfectly with my day-to-day work.',
    rating: 5,
  },
  {
    service: 'Jasa Backlink SEO',
    serviceEn: 'SEO Backlink Service',
    color: '#10b981',
    name: 'Nadia Rahmawati',
    role: 'Blogger Teknologi & Pemilik Gawaikita.id',
    roleEn: 'Tech Blogger & Owner of Gawaikita.id',
    location: 'Bandung',
    quote:
      'Dua artikel andalanku yang dari dulu susah naik akhirnya nangkring di page 1, dan traffic organik blog ikut merangkak stabil tiap minggu. Padahal awalnya aku deg-degan pakai jasa backlink, takut kena penalti gara-gara link asal-asalan. Ternyata semuanya contextual dari situs DA tinggi dan reportnya bisa aku cek satu per satu, jadi lega.',
    quoteEn:
      'Two of my flagship articles that were always stuck finally landed on page 1, and my blog’s organic traffic has been climbing steadily every week. I was nervous about using a backlink service at first, afraid of a penalty from sloppy links. Turns out they were all contextual from high-DA sites and I could check the report one by one, so I felt reassured.',
    rating: 5,
  },
  {
    service: 'Jasa Social Media Ads',
    serviceEn: 'Social Media Ads',
    color: '#f43f5e',
    name: 'Anindya Larasati',
    role: 'Owner Brand Skincare Lokal',
    roleEn: 'Owner, Local Skincare Brand',
    location: 'Surabaya',
    quote:
      'Dulu aku pasang iklan Meta sendiri, tapi budget kebakar terus dan aku nggak pernah tahu campaign mana yang sebenarnya jalan. Sama tim Whitebox pixel-nya dibenerin dulu, baru dari A/B testing ketemu 2 iklan yang ROAS-nya sampai 4x di bulan pertama. Buat aku laporan mingguannya ngebantu banget, akhirnya kelihatan uangnya lari ke mana dan nggak boncos asal-asalan lagi.',
    quoteEn:
      'I used to run Meta ads myself, but the budget kept burning and I never knew which campaign actually worked. The Whitebox team fixed the pixel first, then A/B testing found 2 ads with ROAS up to 4x in the first month. The weekly report helped me a lot — I could finally see where the money was going and stopped bleeding budget randomly.',
    rating: 5,
  },
  {
    service: 'Jasa Build PBN',
    serviceEn: 'PBN Build Service',
    color: '#f97316',
    name: 'Dimas Anggara',
    role: 'Affiliate Marketer Niche Gadget',
    roleEn: 'Gadget-Niche Affiliate Marketer',
    location: 'Pekanbaru',
    quote:
      'Saya pernah kapok pakai PBN murah, footprint-nya gampang kebaca sampai money site saya ikut kena deindex. Punya Whitebox ini beda urusannya, IP hosting-nya rapi dan ada crawler blocker jadi saya jauh lebih tenang. Kira-kira dua bulan keyword utama merangkak naik ke halaman 1, dan artikel di network-nya update sesuai jadwal tanpa perlu saya kejar-kejar.',
    quoteEn:
      'I had sworn off cheap PBNs before — the footprint was easy to spot and my money site got deindexed along with it. Whitebox’s is a different story: the hosting IPs are clean and there’s a crawler blocker, so I feel far more at ease. In about two months my main keyword crept up to page 1, and the network’s articles update on schedule without me chasing them.',
    rating: 5,
  },
  {
    service: 'Full Stack & Server',
    serviceEn: 'Full Stack & Server',
    color: '#14b8a6',
    name: 'Gilang Ramadhan',
    role: 'Founder SaaS Logistik (KirimCepat)',
    roleEn: 'Founder, Logistics SaaS (KirimCepat)',
    location: 'Yogyakarta',
    quote:
      'Dulu tanpa tim DevOps, saya pusing tiap kali deployment dan server sering ngadat pas jam sibuk. Whitebox turun tangan dari revamp web sampai setup Docker dan Kubernetes, dan sekarang aplikasi kami bisa autoscale sendiri waktu traffic naik 3x pas promo. Yang paling saya syukuri monitoring-nya otomatis, tiap ada anomali langsung ketahuan di dashboard sebelum user sempat komplain.',
    quoteEn:
      'Without a DevOps team, I used to dread every deployment and the server often choked during peak hours. Whitebox stepped in from the web revamp to setting up Docker and Kubernetes, and now our app autoscales on its own when traffic triples during promos. What I’m most grateful for is the automatic monitoring — any anomaly shows up on the dashboard before users even notice.',
    rating: 5,
  },
  {
    service: 'Manajemen Server',
    serviceEn: 'Server Management',
    color: '#ef4444',
    name: 'Andri Sanjaya',
    role: 'Pemilik Sanjaya Grosir Online',
    roleEn: 'Owner, Sanjaya Grosir Online',
    location: 'Balikpapan',
    quote:
      'Saya sama sekali nggak ngerti urusan server, dan paling takut ada masalah teknis pas orderan lagi rame-ramenya. Untungnya maintenance dipegang penuh sama tim Whitebox, backup mingguan sama patching jalan sendiri, dan kalau saya tanya di WhatsApp biasanya dibales nggak sampai setengah jam. Sejuta sebulan menurut saya sepadan buat setenang ini, saya jadi bisa fokus jualan aja.',
    quoteEn:
      'I don’t understand server stuff at all, and my biggest fear was a technical problem right when orders are pouring in. Luckily maintenance is fully handled by the Whitebox team — weekly backups and patching run on their own, and when I ask on WhatsApp they usually reply within half an hour. A million rupiah a month is worth it for this peace of mind; I can just focus on selling.',
    rating: 5,
  },
  {
    service: 'Jasa Desain Logo',
    serviceEn: 'Logo Design Service',
    color: '#a855f7',
    name: 'Putri Maharani',
    role: 'Pemilik Kedai Kopi Ranah',
    roleEn: 'Owner, Kedai Kopi Ranah',
    location: 'Padang',
    quote:
      'Logonya bikin aku senang justru karena file vektornya, langsung bisa aku kasih ke tukang buat cetak neon box sama stiker gelas dan hasilnya nggak pecah sama sekali. Dapat 3 opsi desain pula, padahal cuma bayar 300rb. Versi gelap-terangnya kepake banget pas posting di feed sama story IG, warnanya tetap kebaca di dua-duanya.',
    quoteEn:
      'The logo made me happy precisely because of the vector files — I could hand them straight to the printer for a neon box and cup stickers, and the result wasn’t pixelated at all. I even got 3 design options, all for just IDR 300k. The dark and light versions come in really handy for my IG feed and stories; the colors stay readable on both.',
    rating: 5,
  },
  {
    service: 'Jasa Bikin CV',
    serviceEn: 'CV / Resume Service',
    color: '#eab308',
    name: 'Dinda Kirana',
    role: 'Fresh Graduate Teknik Industri',
    roleEn: 'Industrial Engineering Fresh Graduate',
    location: 'Makassar',
    quote:
      'Jujur aku nggak berharap banyak dari CV harga 150rb, tapi hasilnya beda jauh sama CV Canva yang selama ini aku pakai. Seminggu setelah aku kirim versi baru, ada 2 panggilan interview, padahal 3 bulan sebelumnya lamaranku sepi terus, kayaknya sekarang baru kebaca sama sistem ATS. Prosesnya juga ngebut, sore aku kirim data besok paginya udah jadi.',
    quoteEn:
      'Honestly I didn’t expect much from an IDR 150k CV, but the result was worlds apart from the Canva CV I’d been using. A week after sending the new version, I got 2 interview calls — the previous 3 months my applications got no response, so I guess it’s finally readable by the ATS. The turnaround was fast too: I sent my details in the evening and it was ready the next morning.',
    rating: 5,
  },
]

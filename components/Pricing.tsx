'use client'

import { useLanguage } from '@/lib/i18n'

type Feature = { text: string; textEn: string; iconColor?: string; icon?: string; cls?: string }
type PriceCard = {
  name: string
  nameEn: string
  desc: string
  descEn: string
  amount: string
  amountEn?: string
  amountSuffix: string
  amountSuffixEn: string
  amountColor?: string
  features: Feature[]
  btnText: string
  btnTextEn: string
  btnClass: string
  btnStyle?: React.CSSProperties
  featured?: boolean
  badge?: string
  badgeEn?: string
  delay?: string
}

const mainCards: PriceCard[] = [
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
    btnClass: 'price-btn price-btn-outline',
    delay: '',
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
    btnClass: 'price-btn price-btn-solid',
    featured: true,
    badge: 'Stok Terbatas',
    badgeEn: 'Limited Stock',
    delay: ' reveal-d1',
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
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: 'var(--accent2)', color: 'var(--accent2)' },
    delay: ' reveal-d2',
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
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: '#10b981', color: '#10b981' },
    delay: ' reveal-d3',
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
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: '#f43f5e', color: '#f43f5e' },
    delay: ' reveal-d3',
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
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: '#f97316', color: '#f97316' },
    delay: ' reveal-d3',
  },
]

function FeatureItem({ f, isEn }: { f: Feature; isEn: boolean }) {
  return (
    <li className={f.cls || ''}>
      <i
        className={f.icon || 'fa-solid fa-check'}
        style={f.iconColor ? { color: f.iconColor } : undefined}
      />
      {isEn ? f.textEn : f.text}
    </li>
  )
}

function PriceCardComp({ card, isEn }: { card: PriceCard; isEn: boolean }) {
  return (
    <div className={`price-card${card.featured ? ' featured' : ''} reveal${card.delay || ''}`}>
      {card.badge && <div className="price-badge">{isEn ? card.badgeEn : card.badge}</div>}
      <div className="price-name">{isEn ? card.nameEn : card.name}</div>
      <div className="price-desc">{isEn ? card.descEn : card.desc}</div>
      <div className="price-amount" style={card.amountColor ? { color: card.amountColor } : {}}>
        {isEn && card.amountEn ? card.amountEn : card.amount}
        <span>{isEn ? card.amountSuffixEn : card.amountSuffix}</span>
      </div>
      <div className="price-divider" />
      <ul className="price-features">
        {card.features.map((f, i) => <FeatureItem key={i} f={f} isEn={isEn} />)}
      </ul>
      <a href="#kontak" className={card.btnClass} style={card.btnStyle}>
        {isEn ? card.btnTextEn : card.btnText}
      </a>
    </div>
  )
}

export default function Pricing() {
  const { t, lang } = useLanguage()
  const isEn = lang === 'en'

  return (
    <section id="harga">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">{t.pricing.label}</div>
          <h2 className="section-title">{t.pricing.title}</h2>
          <p className="section-sub">{t.pricing.sub}</p>
        </div>

        {/* Main 6-card grid */}
        <div className="pricing-grid">
          {mainCards.map((c, i) => <PriceCardComp key={i} card={c} isEn={isEn} />)}
        </div>

        {/* Row 2: Full Stack & Server Management */}
        <div className="pricing-row2">
          {/* Full Stack */}
          <div className="price-card reveal">
            <div className="price-name">Full Stack &amp; Server</div>
            <div className="price-desc">
              {isEn ? 'Complete web + cloud deployment solution' : 'Solusi lengkap web + cloud deployment'}
            </div>
            <div className="price-amount">Custom<span>{isEn ? '/estimate' : '/estimasi'}</span></div>
            <div className="price-divider" />
            <ul className="price-features">
              <li><i className="fa-solid fa-check" /> {isEn ? 'Full Web Design + SEO' : 'Web Design + SEO Full'}</li>
              <li><i className="fa-solid fa-check" /> {isEn ? 'Enterprise Cloud Container Deployment' : 'Deployment Enterprise Cloud Container'}</li>
              <li><i className="fa-solid fa-check" /> {isEn ? 'Automated Monitoring Setup' : 'Setup Monitoring Otomatis'}</li>
            </ul>
            <a href="#kontak" className="price-btn price-btn-outline">
              {isEn ? 'Free Consultation' : 'Konsultasi Gratis'}
            </a>
          </div>

          {/* Server Management */}
          <div className="price-card reveal reveal-d1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="price-name">{isEn ? 'Server Management' : 'Manajemen Server'}</div>
                <div className="price-desc">
                  {isEn ? 'Routine infrastructure maintenance' : 'Pemeliharaan rutin infrastruktur'}
                </div>
              </div>
              <div className="price-amount" style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>
                IDR 1jt<span>{isEn ? '/mo' : '/bln'}</span>
              </div>
            </div>
            <div className="price-divider" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <ul className="price-features">
                <li><i className="fa-solid fa-check" /> {isEn ? 'Scheduled Backups' : 'Backup Terjadwal'}</li>
                <li><i className="fa-solid fa-check" /> {isEn ? 'Routine Patching' : 'Patching Rutin'}</li>
              </ul>
              <ul className="price-features">
                <li><i className="fa-solid fa-check" /> {isEn ? '24/7 Uptime' : 'Uptime 24/7'}</li>
                <li><i className="fa-solid fa-check" /> {isEn ? 'Priority Support' : 'Support Prioritas'}</li>
              </ul>
            </div>
            <a href="#kontak" className="price-btn" style={{ background: '#ef4444', color: '#fff' }}>
              {isEn ? 'Start Subscription' : 'Mulai Langganan'}
            </a>
          </div>
        </div>

        {/* ── Kreatif & Desain ───────────────────────── */}
        <div className="section-header reveal" style={{ marginTop: 80, marginBottom: 40 }}>
          <h3 className="section-title" style={{ fontSize: '2rem' }}>{t.pricing.creativeTitle}</h3>
        </div>

        <div className="pricing-grid">
          {/* Logo Design */}
          <div className="price-card reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div className="price-name">{isEn ? 'Logo Design Service' : 'Jasa Desain Logo'}</div>
              <div className="price-amount" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--accent3)' }}>IDR 300k</div>
            </div>
            <div className="price-divider" />
            <ul className="price-features">
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> {isEn ? '3 Unique Design Options' : '3 Opsi Desain Unik'}</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> {isEn ? 'Vector Files (SVG/AI)' : 'File Vektor (SVG/AI)'}</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> {isEn ? 'High Resolution (PNG/JPG)' : 'Resolusi Tinggi (PNG/JPG)'}</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> {isEn ? 'Unlimited Revisions' : 'Revisi Sampai Puas'}</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> {isEn ? 'Transparent Version (PNG)' : 'Versi Transparan (PNG)'}</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> {isEn ? 'Dark & Light Versions' : 'Versi Gelap & Terang'}</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> {isEn ? 'Free Presentation Mockup' : 'Free Mockup Presentasi'}</li>
            </ul>
            <a href="#kontak" className="price-btn price-btn-outline" style={{ borderColor: 'var(--accent3)', color: 'var(--accent3)' }}>
              {isEn ? 'Order Logo Design' : 'Pesan Desain Logo'}
            </a>
          </div>

          {/* CV */}
          <div className="price-card reveal reveal-d1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div className="price-name">{isEn ? 'CV / Resume Service' : 'Jasa Bikin CV'}</div>
              <div className="price-amount" style={{ margin: 0, fontSize: '1.8rem', color: '#eab308' }}>IDR 150k</div>
            </div>
            <div className="price-divider" />
            <ul className="price-features">
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> {isEn ? 'ATS-Compliant Design' : 'Desain Standar ATS'}</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> {isEn ? 'PDF & Word Formats' : 'Format PDF & Word'}</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> {isEn ? 'Grammar Consultation' : 'Konsultasi Tata Bahasa'}</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> {isEn ? '1x Free Revision' : 'Revisi Gratis 1x'}</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> {isEn ? 'Modern & Professional Design' : 'Desain Modern & Profesional'}</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> {isEn ? 'Delivered within 24 hours' : 'Pengerjaan Maks. 1x24 Jam'}</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> {isEn ? 'Exclusive, Non-Generic Template' : 'Template Eksklusif Anti-Pasaran'}</li>
            </ul>
            <a href="#kontak" className="price-btn price-btn-outline" style={{ borderColor: '#eab308', color: '#eab308' }}>
              {isEn ? 'Boost My Career' : 'Tingkatkan Karir'}
            </a>
          </div>

          {/* Aplikasi Premium */}
          <div className="price-card reveal reveal-d2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div className="price-name">{isEn ? 'Premium Apps' : 'Aplikasi Premium'}</div>
              <div className="price-amount" style={{ margin: 0, fontSize: '1.3rem', color: '#a855f7' }}>
                10k – 100k
              </div>
            </div>
            <div className="price-desc" style={{ marginTop: 6 }}>
              {isEn ? 'Guaranteed premium accounts, 100% safe' : 'Akun premium bergaransi, dijamin aman 100%'}
            </div>
            <div className="price-divider" />
            <ul className="price-features">
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> CapCut Pro</li>
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> Gemini Pro</li>
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> Canva Pro</li>
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> ChatGPT Plus</li>
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> Getcontact Premium</li>
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> YouTube Premium</li>
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> Vidio Platinum</li>
              <li><i className="fa-solid fa-check" style={{ color: '#a855f7' }} /> {isEn ? 'Certain apps available on request' : 'Untuk Aplikasi tertentu bisa request'}</li>
            </ul>
            <a href="#kontak" className="price-btn price-btn-outline" style={{ borderColor: '#a855f7', color: '#a855f7' }}>
              {isEn ? 'Ask for Price' : 'Tanya Harga'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

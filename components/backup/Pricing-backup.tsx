type Feature = { text: string; iconColor?: string; icon?: string; cls?: string }
type PriceCard = {
  name: string
  desc: string
  amount: string
  amountSuffix: string
  amountColor?: string
  features: Feature[]
  btnText: string
  btnClass: string
  btnStyle?: React.CSSProperties
  featured?: boolean
  badge?: string
  delay?: string
}

const mainCards: PriceCard[] = [
  {
    name: 'Web Design',
    desc: 'Untuk website baru atau company profile',
    amount: 'IDR 500k',
    amountSuffix: '/proyek',
    features: [
      { text: 'Desain Responsif & Modern' },
      { text: 'Optimasi Kecepatan' },
      { text: 'Integrasi Google Search' },
    ],
    btnText: 'Pesan Sekarang',
    btnClass: 'price-btn price-btn-outline',
    delay: '',
  },
  {
    name: 'Premium Aged Domain',
    desc: 'DR tinggi & profil backlink berkualitas',
    amount: 'Hubungi',
    amountSuffix: ' untuk harga',
    amountColor: 'var(--accent)',
    features: [
      { text: 'High Domain Rating (DR)' },
      { text: 'Akses Full: FTP / Shell / cPanel' },
      { text: 'Audit Backlink Manual' },
      { text: 'Sesuai ketersediaan stok' },
    ],
    btnText: 'Cek Stok Domain',
    btnClass: 'price-btn price-btn-solid',
    featured: true,
    badge: 'Stok Terbatas',
    delay: ' reveal-d1',
  },
  {
    name: 'Webshell Course',
    desc: 'Kursus intensif 1-on-1 via Zoom/Meet',
    amount: 'IDR 25jt',
    amountSuffix: '/batch',
    amountColor: 'var(--accent2)',
    features: [
      { text: 'Manajemen Akses Shell', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
      { text: 'Scripting & Automasi Server', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
      { text: 'Pengamanan Celah Keamanan', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
      { text: 'Mentoring Privat 1-on-1', icon: 'fa-solid fa-graduation-cap', cls: 'edu' },
    ],
    btnText: 'Daftar Kursus',
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: 'var(--accent2)', color: 'var(--accent2)' },
    delay: ' reveal-d2',
  },
  {
    name: 'Jasa Backlink SEO',
    desc: 'Tingkatkan otoritas & ranking di Google',
    amount: 'IDR 850k - 5jt',
    amountSuffix: ' /paket',
    amountColor: '#10b981',
    features: [
      { text: 'High DA/PA & DR Tertarget', iconColor: '#10b981' },
      { text: 'Contextual & Permanent Link', iconColor: '#10b981' },
      { text: 'Termasuk Artikel SEO 500 Kata', iconColor: '#10b981' },
      { text: 'Report Lengkap & Transparan', iconColor: '#10b981' },
    ],
    btnText: 'Tingkatkan Ranking',
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: '#10b981', color: '#10b981' },
    delay: ' reveal-d3',
  },
  {
    name: 'Jasa Social Media Ads',
    desc: 'Scale up bisnis dengan kampanye berbayar',
    amount: 'IDR 500k - 20jt',
    amountSuffix: ' /bulan',
    amountColor: '#f43f5e',
    features: [
      { text: 'Setup Meta (FB/IG) & TikTok Pixel', iconColor: '#f43f5e' },
      { text: 'Riset Audiens & Copywriting Iklan', iconColor: '#f43f5e' },
      { text: 'A/B Testing Winning Campaign', iconColor: '#f43f5e' },
      { text: 'Laporan Performa & ROI Mingguan', iconColor: '#f43f5e' },
    ],
    btnText: 'Mulai Kampanye Ads',
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: '#f43f5e', color: '#f43f5e' },
    delay: ' reveal-d3',
  },
  {
    name: 'Jasa Build PBN',
    desc: 'Bangun jaringan blog privat super aman',
    amount: 'IDR 1.5jt - 10jt',
    amountSuffix: ' /network',
    amountColor: '#f97316',
    features: [
      { text: 'IP Server / Hosting Berbeda (No Footprint)', iconColor: '#f97316' },
      { text: 'Setup Premium Aged Domain & WP', iconColor: '#f97316' },
      { text: 'Termasuk Artikel Unik & Terjadwal', iconColor: '#f97316' },
      { text: 'Proteksi Anti-Bot & Crawler Blocker', iconColor: '#f97316' },
    ],
    btnText: 'Bangun PBN Sekarang',
    btnClass: 'price-btn price-btn-outline',
    btnStyle: { borderColor: '#f97316', color: '#f97316' },
    delay: ' reveal-d3',
  },
]

function FeatureItem({ f }: { f: Feature }) {
  return (
    <li className={f.cls || ''}>
      <i
        className={f.icon || 'fa-solid fa-check'}
        style={f.iconColor ? { color: f.iconColor } : undefined}
      />
      {f.text}
    </li>
  )
}

function PriceCardComp({ card }: { card: PriceCard }) {
  return (
    <div className={`price-card${card.featured ? ' featured' : ''} reveal${card.delay || ''}`}>
      {card.badge && <div className="price-badge">{card.badge}</div>}
      <div className="price-name">{card.name}</div>
      <div className="price-desc">{card.desc}</div>
      <div className="price-amount" style={card.amountColor ? { color: card.amountColor } : {}}>
        {card.amount}
        <span>{card.amountSuffix}</span>
      </div>
      <div className="price-divider" />
      <ul className="price-features">
        {card.features.map((f, i) => <FeatureItem key={i} f={f} />)}
      </ul>
      <a href="#kontak" className={card.btnClass} style={card.btnStyle}>
        {card.btnText}
      </a>
    </div>
  )
}

export default function Pricing() {
  return (
    <section id="harga">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">Harga</div>
          <h2 className="section-title">Paket &amp; Layanan</h2>
          <p className="section-sub">Solusi infrastruktur, website, dan layanan kreatif profesional.</p>
        </div>

        {/* Main 6-card grid */}
        <div className="pricing-grid">
          {mainCards.map((c, i) => <PriceCardComp key={i} card={c} />)}
        </div>

        {/* Row 2: Full Stack & Server Management */}
        <div className="pricing-row2">
          {/* Full Stack */}
          <div className="price-card reveal">
            <div className="price-name">Full Stack &amp; Server</div>
            <div className="price-desc">Solusi lengkap web + cloud deployment</div>
            <div className="price-amount">Custom<span>/estimasi</span></div>
            <div className="price-divider" />
            <ul className="price-features">
              <li><i className="fa-solid fa-check" /> Web Design + SEO Full</li>
              <li><i className="fa-solid fa-check" /> Deployment Enterprise Cloud Container</li>
              <li><i className="fa-solid fa-check" /> Setup Monitoring Otomatis</li>
            </ul>
            <a href="#kontak" className="price-btn price-btn-outline">Konsultasi Gratis</a>
          </div>

          {/* Server Management */}
          <div className="price-card reveal reveal-d1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="price-name">Manajemen Server</div>
                <div className="price-desc">Pemeliharaan rutin infrastruktur</div>
              </div>
              <div className="price-amount" style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>
                IDR 1jt<span>/bln</span>
              </div>
            </div>
            <div className="price-divider" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <ul className="price-features">
                <li><i className="fa-solid fa-check" /> Backup Terjadwal</li>
                <li><i className="fa-solid fa-check" /> Patching Rutin</li>
              </ul>
              <ul className="price-features">
                <li><i className="fa-solid fa-check" /> Uptime 24/7</li>
                <li><i className="fa-solid fa-check" /> Support Prioritas</li>
              </ul>
            </div>
            <a href="#kontak" className="price-btn" style={{ background: '#ef4444', color: '#fff' }}>
              Mulai Langganan
            </a>
          </div>
        </div>

        {/* Creative & Design row */}
        <div className="section-header reveal" style={{ marginTop: 80, marginBottom: 40 }}>
          <h3 className="section-title" style={{ fontSize: '2rem' }}>Layanan Kreatif &amp; Desain</h3>
        </div>

        <div className="pricing-row2">
          {/* Logo Design */}
          <div className="price-card reveal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div className="price-name">Jasa Desain Logo</div>
              <div className="price-amount" style={{ margin: 0, fontSize: '1.8rem', color: 'var(--accent3)' }}>IDR 300k</div>
            </div>
            <div className="price-divider" />
            <ul className="price-features" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> 3 Opsi Desain Unik</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> File Vektor (SVG/AI)</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> Resolusi Tinggi (PNG/JPG)</li>
              <li><i className="fa-solid fa-check" style={{ color: 'var(--accent3)' }} /> Revisi Sampai Puas</li>
            </ul>
            <a href="#kontak" className="price-btn price-btn-outline" style={{ borderColor: 'var(--accent3)', color: 'var(--accent3)' }}>
              Pesan Desain Logo
            </a>
          </div>

          {/* CV */}
          <div className="price-card reveal reveal-d1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div className="price-name">Jasa Bikin CV</div>
              <div className="price-amount" style={{ margin: 0, fontSize: '1.8rem', color: '#eab308' }}>IDR 150k</div>
            </div>
            <div className="price-divider" />
            <ul className="price-features" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> Desain Standar ATS</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> Format PDF &amp; Word</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> Konsultasi Tata Bahasa</li>
              <li><i className="fa-solid fa-check" style={{ color: '#eab308' }} /> Revisi Gratis 1x</li>
            </ul>
            <a href="#kontak" className="price-btn price-btn-outline" style={{ borderColor: '#eab308', color: '#eab308' }}>
              Tingkatkan Karir
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

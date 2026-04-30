const services = [
  {
    iconBg: 'rgba(37,99,235,0.1)',
    iconColor: '#3b82f6',
    icon: 'fa-solid fa-code',
    title: 'Web Design',
    desc: 'Pembuatan website responsif menggunakan PHP, Python, dan Kotlin dengan standar performa tinggi.',
  },
  {
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#10b981',
    icon: 'fa-solid fa-chart-line',
    title: 'SEO Expert',
    desc: 'Optimasi kecepatan dan struktur data untuk menempati halaman pertama Google secara organik.',
  },
  {
    iconBg: 'rgba(109,40,217,0.1)',
    iconColor: '#8b5cf6',
    icon: 'fa-solid fa-server',
    title: 'VPS Setup',
    desc: 'Konfigurasi Ubuntu/Debian di Azure, DigitalOcean, atau AWS dengan keamanan berlapis.',
  },
  {
    iconBg: 'rgba(239,68,68,0.1)',
    iconColor: '#ef4444',
    icon: 'fa-solid fa-network-wired',
    title: 'Server Management',
    desc: 'Manajemen cPanel, Docker Registry, dan keamanan direktori server secara profesional.',
  },
]

const delays = ['', ' reveal-d1', ' reveal-d2', ' reveal-d3']

export default function Services() {
  return (
    <section id="layanan">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">Keahlian</div>
          <h2 className="section-title">Solusi Teknis End-to-End</h2>
          <p className="section-sub">Dari desain antarmuka hingga deployment infrastruktur cloud.</p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div className={`service-card reveal${delays[i]}`} key={i}>
              <div
                className="service-icon"
                style={{ background: s.iconBg }}
              >
                <i className={s.icon} style={{ color: s.iconColor }} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

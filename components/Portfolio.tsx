import Image from 'next/image'

const projects = [
  {
    img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop',
    alt: 'Web Design Project',
    tagBg: 'rgba(37,99,235,0.1)',
    tagColor: '#3b82f6',
    tag: 'Web Design',
    title: 'Modern Web Design',
    desc: 'Pembuatan website responsif dan modern dengan performa tinggi yang dioptimasi untuk SEO.',
    delay: '',
  },
  {
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop',
    alt: 'Enterprise Cloud Container Setup',
    tagBg: 'rgba(109,40,217,0.1)',
    tagColor: '#8b5cf6',
    tag: 'Infrastructure',
    title: 'Enterprise Cloud Container Setup',
    desc: 'Implementasi Docker Registry dan Kubernetes (AKS) pada infrastruktur Azure untuk deployment aplikasi skala besar yang handal, aman, dan otomatis.',
    delay: ' reveal-d1',
  },
  {
    img: 'https://plus.unsplash.com/premium_photo-1733306493254-52b143296396?q=80&w=600&auto=format&fit=crop',
    alt: 'Telegram Monitoring Bot',
    tagBg: 'rgba(16,185,129,0.1)',
    tagColor: '#10b981',
    tag: 'Automation',
    title: 'Real-time Cloud Analytics',
    desc: 'Bot otomatisasi yang mengintegrasikan log server ke platform notifikasi untuk pengawasan performa server dan audit keamanan secara mandiri.',
    delay: ' reveal-d2',
  },
]

export default function Portfolio() {
  return (
    <section id="portofolio">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">Portfolio</div>
          <h2 className="section-title">Proyek Pilihan</h2>
          <p className="section-sub">Beberapa karya terbaik yang telah dikerjakan.</p>
        </div>

        <div className="portfolio-grid">
          {projects.map((p, i) => (
            <div className={`port-card reveal${p.delay}`} key={i}>
              <div className="port-img">
                <Image
                  src={p.img}
                  alt={p.alt}
                  width={600}
                  height={375}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="port-body">
                <span
                  className="port-tag"
                  style={{ background: p.tagBg, color: p.tagColor }}
                >
                  {p.tag}
                </span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

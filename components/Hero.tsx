import Image from 'next/image'

export default function Hero() {
  return (
    <section id="beranda">
      <div className="hero-inner section-wrap">
        {/* Left – copy */}
        <div>
          <div className="hero-badge reveal">Freelance Specialist</div>

          <h1 className="hero-title reveal reveal-d1">
            Bangun Website<br />Cepat &<br />
            <span className="gradient-text">Server Stabil.</span>
          </h1>

          <p className="hero-sub reveal reveal-d2">
            Kami dari Whitebox.asia — spesialis yang fokus pada performa web, optimasi
            SEO, dan manajemen infrastruktur cloud yang aman dan skalabel.
          </p>

          <div className="hero-actions reveal reveal-d3">
            <a href="#portofolio" className="btn-primary">
              <i className="fa-solid fa-arrow-right" /> Lihat Proyek
            </a>
            <a href="#layanan" className="btn-ghost">Layanan Saya</a>
          </div>

          <div className="hero-stats reveal reveal-d2">
            <div className="stat-item">
              <div className="stat-num">50+</div>
              <div className="stat-label">Proyek Selesai</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">5yr+</div>
              <div className="stat-label">Pengalaman</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">99%</div>
              <div className="stat-label">Uptime Server</div>
            </div>
          </div>
        </div>

        {/* Right – visual */}
        <div className="hero-visual reveal reveal-d2">
          <div className="float-tag float-tag-1">
            <i className="fa-brands fa-microsoft" /> Enterprise Cloud
          </div>
          <div className="float-tag float-tag-2">
            <i className="fa-solid fa-shield-halved" /> SSL Secured
          </div>
          <div className="hero-img-wrap">
            <Image
              src="https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=800&auto=format&fit=crop"
              alt="Whitebox.asia Workspace"
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              style={{ objectFit: 'cover' }}
            />
            <div className="hero-quote">
              <p>"Mengelola infrastruktur Cloud Container &amp; Google Cloud dengan presisi tinggi."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

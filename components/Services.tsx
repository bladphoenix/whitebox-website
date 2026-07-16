'use client'

import { useLanguage } from '@/lib/i18n'

const meta = [
  { iconBg: 'rgba(37,99,235,0.1)', iconColor: '#3b82f6', icon: 'fa-solid fa-code' },
  { iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10b981', icon: 'fa-solid fa-chart-line' },
  { iconBg: 'rgba(109,40,217,0.1)', iconColor: '#8b5cf6', icon: 'fa-solid fa-server' },
  { iconBg: 'rgba(239,68,68,0.1)', iconColor: '#ef4444', icon: 'fa-solid fa-network-wired' },
]

const delays = ['', ' reveal-d1', ' reveal-d2', ' reveal-d3']

export default function Services() {
  const { t } = useLanguage()

  return (
    <section id="layanan">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">{t.services.label}</div>
          <h2 className="section-title">{t.services.title}</h2>
          <p className="section-sub">{t.services.sub}</p>
        </div>

        <div className="services-grid">
          {t.services.cards.map((s, i) => (
            <div className={`service-card reveal${delays[i]}`} key={i}>
              <div className="service-icon" style={{ background: meta[i].iconBg }}>
                <i className={meta[i].icon} style={{ color: meta[i].iconColor }} />
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

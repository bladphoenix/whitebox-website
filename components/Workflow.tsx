'use client'

import { useLanguage } from '@/lib/i18n'

const delays = ['', ' reveal-d1', ' reveal-d2', ' reveal-d3']

export default function Workflow() {
  const { t, p, content } = useLanguage()

  return (
    <section id="alur">
      <div className="section-wrap">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-label">{t.workflow.label}</div>
          <h2 className="section-title">{t.workflow.title}</h2>
          <p className="section-sub">{t.workflow.sub}</p>
        </div>

        <div className="workflow-steps">
          {content.workflow.steps.map((s, i) => (
            <div className={`step-item reveal${delays[i % delays.length]}`} key={i}>
              {/* nomor urut ikut jumlah langkah, jadi menambah langkah ke-5
                  di panel tidak membuat nomornya kosong */}
              <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{p(s.title, s.titleEn)}</h3>
              <p>{p(s.desc, s.descEn)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useLanguage } from '@/lib/i18n'

const nums = ['01', '02', '03', '04']
const delays = ['', ' reveal-d1', ' reveal-d2', ' reveal-d3']

export default function Workflow() {
  const { t } = useLanguage()

  return (
    <section id="alur">
      <div className="section-wrap">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-label">{t.workflow.label}</div>
          <h2 className="section-title">{t.workflow.title}</h2>
          <p className="section-sub">{t.workflow.sub}</p>
        </div>

        <div className="workflow-steps">
          {t.workflow.steps.map((s, i) => (
            <div className={`step-item reveal${delays[i]}`} key={i}>
              <div className="step-num">{nums[i]}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

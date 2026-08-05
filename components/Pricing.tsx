'use client'

import { useLanguage } from '@/lib/i18n'
import { dwi, type PriceCard, type PriceFeature } from '@/lib/content'
import ElectricBorder from './ElectricBorder'

const delays = ['', ' reveal-d1', ' reveal-d2', ' reveal-d3']

function FeatureItem({ f, isEn }: { f: PriceFeature; isEn: boolean }) {
  return (
    <li className={f.cls || ''}>
      <i
        className={f.icon || 'fa-solid fa-check'}
        style={f.iconColor ? { color: f.iconColor } : undefined}
      />
      {dwi(isEn, f.text, f.textEn)}
    </li>
  )
}

function FeatureList({ card, isEn }: { card: PriceCard; isEn: boolean }) {
  if (card.featureColumns === 2) {
    const tengah = Math.ceil(card.features.length / 2)
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[card.features.slice(0, tengah), card.features.slice(tengah)].map((kolom, k) => (
          <ul className="price-features" key={k}>
            {kolom.map((f, i) => <FeatureItem key={i} f={f} isEn={isEn} />)}
          </ul>
        ))}
      </div>
    )
  }
  return (
    <ul className="price-features">
      {card.features.map((f, i) => <FeatureItem key={i} f={f} isEn={isEn} />)}
    </ul>
  )
}

function Amount({ card, isEn, inline }: { card: PriceCard; isEn: boolean; inline: boolean }) {
  const gaya: React.CSSProperties = {}
  if (card.amountColor) gaya.color = card.amountColor
  if (inline) {
    gaya.margin = 0
    if (card.amountSize) gaya.fontSize = card.amountSize
  }
  const akhiran = dwi(isEn, card.amountSuffix || '', card.amountSuffixEn)
  return (
    <div className="price-amount" style={gaya}>
      {dwi(isEn, card.amount, card.amountEn)}
      {akhiran ? <span>{akhiran}</span> : null}
    </div>
  )
}

function Tombol({ card, isEn }: { card: PriceCard; isEn: boolean }) {
  const solid = card.btnVariant === 'solid'
  let kelas = 'price-btn'
  let gaya: React.CSSProperties | undefined

  if (solid) {
    // Tanpa accent, pakai gaya solid bawaan tema (biru aksen situs).
    if (card.accent) gaya = { background: card.accent, color: '#fff' }
    else kelas += ' price-btn-solid'
  } else {
    kelas += ' price-btn-outline'
    if (card.accent) gaya = { borderColor: card.accent, color: card.accent }
  }

  return (
    <a href="#kontak" className={kelas} style={gaya}>
      {dwi(isEn, card.btnText, card.btnTextEn)}
    </a>
  )
}

function Kartu({ card, isEn, delay }: { card: PriceCard; isEn: boolean; delay: string }) {
  const nama = <div className="price-name">{dwi(isEn, card.name, card.nameEn)}</div>
  const desk = card.desc ? (
    <div className="price-desc">{dwi(isEn, card.desc, card.descEn)}</div>
  ) : null

  return (
    <div className={`price-card${card.featured ? ' featured' : ''} reveal${delay}`}>
      {card.featured && <ElectricBorder radius={24} />}
      {card.badge && <div className="price-badge">{dwi(isEn, card.badge, card.badgeEn)}</div>}

      {card.amountInline ? (
        <>
          {/* Harga sejajar nama. Kalau deskripsinya ikut di baris judul,
              perataannya ke atas supaya nama + deskripsi tetap satu blok. */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: card.descInHeader ? 'flex-start' : 'center',
              flexWrap: 'wrap',
              gap: card.descInHeader ? 12 : 10,
            }}
          >
            {card.descInHeader ? <div>{nama}{desk}</div> : nama}
            <Amount card={card} isEn={isEn} inline />
          </div>
          {!card.descInHeader && card.desc && (
            <div className="price-desc" style={{ marginTop: 6 }}>
              {dwi(isEn, card.desc, card.descEn)}
            </div>
          )}
        </>
      ) : (
        <>
          {nama}
          {desk}
          <Amount card={card} isEn={isEn} inline={false} />
        </>
      )}

      <div className="price-divider" />
      <FeatureList card={card} isEn={isEn} />
      <Tombol card={card} isEn={isEn} />
    </div>
  )
}

export default function Pricing() {
  const { t, isEn, content } = useLanguage()
  const { main, row2, creative } = content.pricing

  return (
    <section id="harga">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div className="section-label">{t.pricing.label}</div>
          <h2 className="section-title">{t.pricing.title}</h2>
          <p className="section-sub">{t.pricing.sub}</p>
        </div>

        <div className="pricing-grid">
          {main.map((c, i) => (
            <Kartu key={i} card={c} isEn={isEn} delay={delays[i % delays.length]} />
          ))}
        </div>

        {row2.length > 0 && (
          <div className="pricing-row2">
            {row2.map((c, i) => (
              <Kartu key={i} card={c} isEn={isEn} delay={delays[i % delays.length]} />
            ))}
          </div>
        )}

        {creative.length > 0 && (
          <>
            <div className="section-header reveal" style={{ marginTop: 80, marginBottom: 40 }}>
              <h3 className="section-title" style={{ fontSize: '2rem' }}>
                {t.pricing.creativeTitle}
              </h3>
            </div>

            <div className="pricing-grid">
              {creative.map((c, i) => (
                <Kartu key={i} card={c} isEn={isEn} delay={delays[i % delays.length]} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/i18n'

type Testimonial = {
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
}

const testimonials: Testimonial[] = [
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

/** "Rangga Prasetyo" -> "RP" */
function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

/** true jika pengguna mengaktifkan "reduce motion" di OS */
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="testi-stars" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <i key={i} className="fa-solid fa-star" />
        if (i === full && half) return <i key={i} className="fa-solid fa-star-half-stroke" />
        return <i key={i} className="fa-regular fa-star" />
      })}
    </span>
  )
}

export default function Testimonials() {
  const { t, lang } = useLanguage()
  const isEn = lang === 'en'
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [paused, setPaused] = useState(false)

  // ganti angka ini untuk mengubah kecepatan autoplay (ms). 0 = matikan autoplay.
  const AUTOPLAY_MS = 4500

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [])

  const scroll = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.testi-card')
    const step = card ? card.offsetWidth + 24 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // Autoplay: geser sendiri, jeda saat hover, balik ke awal setelah kartu terakhir
  useEffect(() => {
    if (!AUTOPLAY_MS || paused) return
    if (prefersReducedMotion()) return

    const id = window.setInterval(() => {
      const el = trackRef.current
      if (!el) return
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2
      if (atRight) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        const card = el.querySelector<HTMLElement>('.testi-card')
        const step = card ? card.offsetWidth + 24 : el.clientWidth
        el.scrollBy({ left: step, behavior: 'smooth' })
      }
    }, AUTOPLAY_MS)

    return () => window.clearInterval(id)
  }, [paused])

  return (
    <section id="testimoni">
      <div className="section-wrap">
        <div className="section-header reveal" style={{ textAlign: 'center' }}>
          <div className="section-label">{t.testimonials.label}</div>
          <h2 className="section-title">{t.testimonials.title}</h2>
          <p className="section-sub">{t.testimonials.sub}</p>
          <div className="testi-summary">
            <Stars rating={5} />
            <span className="testi-summary-text">
              <strong>{t.testimonials.summaryStrong}</strong> {t.testimonials.summaryText}
            </span>
          </div>
        </div>

        <div
          className="testi-slider reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <button
            type="button"
            className="testi-arrow testi-arrow-prev"
            onClick={() => { if (!atStart) scroll(-1) }}
            aria-disabled={atStart}
            aria-label={isEn ? 'Previous' : 'Sebelumnya'}
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <div className="testi-track" ref={trackRef} onScroll={updateArrows}>
            {testimonials.map((item, i) => (
              <div className="testi-card" key={i}>
                <div className="testi-top">
                  <Stars rating={item.rating} />
                  <span className="testi-quote-mark" aria-hidden="true">
                    &rdquo;
                  </span>
                </div>

                <p className="testi-quote">{isEn ? item.quoteEn : item.quote}</p>

                <div className="testi-foot">
                  <div
                    className="testi-avatar"
                    style={{ background: item.color }}
                    aria-hidden="true"
                  >
                    {initials(item.name)}
                  </div>
                  <div className="testi-meta">
                    <span className="testi-name">{item.name}</span>
                    <span className="testi-role">
                      {(isEn ? item.roleEn : item.role)} · {item.location}
                    </span>
                  </div>
                </div>

                <span
                  className="testi-tag"
                  style={{ ['--tag']: item.color } as React.CSSProperties}
                >
                  {isEn ? item.serviceEn : item.service}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="testi-arrow testi-arrow-next"
            onClick={() => { if (!atEnd) scroll(1) }}
            aria-disabled={atEnd}
            aria-label={isEn ? 'Next' : 'Berikutnya'}
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

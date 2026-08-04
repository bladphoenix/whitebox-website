/* Bentuk dokumen isi situs + nilai awalnya.
 *
 * Modul ini isomorfik: dipakai server (membaca/menulis JSON) maupun klien
 * (provider React dan panel admin). Tidak boleh menyentuh `fs` di sini —
 * itu urusan lib/content-store.ts. */

import { siteText, type SectionText, type SiteText } from './data/site-text'
import * as seed from './data/site-data'
import type {
  HeroStat,
  PriceCard,
  Project,
  ServiceCard,
  Testimonial,
  WorkflowStep,
} from './data/site-data'

export type {
  HeroStat,
  PriceCard,
  PriceFeature,
  Project,
  ServiceCard,
  Testimonial,
  WorkflowStep,
} from './data/site-data'
export type { SectionText, SiteText } from './data/site-text'

export type Content = {
  version: number
  updatedAt: string
  text: SiteText
  hero: { stats: HeroStat[]; image: string }
  services: ServiceCard[]
  projects: Project[]
  pricing: { main: PriceCard[]; row2: PriceCard[]; creative: PriceCard[] }
  workflow: { steps: WorkflowStep[] }
  testimonials: Testimonial[]
  contact: { whatsapp: string; telegram: string }
}

export const CONTENT_VERSION = 1

/** Salinan dalam, supaya nilai awal tidak pernah ikut termutasi. */
function salin<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export function defaultContent(): Content {
  return salin({
    version: CONTENT_VERSION,
    updatedAt: '',
    text: siteText,
    hero: { stats: seed.heroStats, image: seed.heroImage },
    services: seed.services,
    projects: seed.projects,
    pricing: {
      main: seed.pricingMain,
      row2: seed.pricingRow2,
      creative: seed.pricingCreative,
    },
    workflow: { steps: seed.workflowSteps },
    testimonials: seed.testimonials,
    contact: seed.contactLinks,
  })
}

function objek(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
}

/** Gabung `sumber` di atas `bawaan`: kunci yang tidak ada di sumber diambil
 *  dari bawaan. Array diambil utuh (tidak digabung per elemen) — kalau admin
 *  menghapus semua kartu harga, memang harus jadi kosong, bukan balik lagi. */
function gabung<T>(bawaan: T, sumber: unknown): T {
  const b = objek(bawaan)
  const s = objek(sumber)
  if (!b || !s) return (sumber === undefined ? bawaan : (sumber as T))

  const hasil: Record<string, unknown> = { ...b }
  for (const k of Object.keys(b)) {
    if (!(k in s)) continue
    const nilaiB = b[k]
    const nilaiS = s[k]
    if (Array.isArray(nilaiB)) {
      if (Array.isArray(nilaiS)) hasil[k] = nilaiS
    } else if (objek(nilaiB)) {
      hasil[k] = gabung(nilaiB, nilaiS)
    } else if (nilaiS !== undefined && nilaiS !== null) {
      hasil[k] = nilaiS
    }
  }
  return hasil as T
}

/** Terima JSON apa adanya dari disk atau dari panel, kembalikan dokumen yang
 *  pasti lengkap. Dipakai dua-duanya supaya kunci baru yang ditambahkan
 *  belakangan tidak membuat situs kosong pada JSON lama. */
export function normalizeContent(mentah: unknown): Content {
  const c = gabung(defaultContent(), mentah)
  c.version = CONTENT_VERSION
  return c
}

/* ── Pembantu bahasa ─────────────────────────────────────────────────
   Bidang bahasa Inggris opsional: kalau dikosongkan di panel, teks
   Indonesia yang dipakai. Lebih baik menampilkan bahasa yang salah
   daripada menampilkan kekosongan. */
export function dwi(isEn: boolean, id: string, en?: string): string {
  return isEn ? (en?.trim() ? en : id) : id
}

/* Host yang boleh lewat pengoptimal gambar Next (lihat next.config.mjs).
   URL dari host lain tetap tampil, tapi dengan `unoptimized` — jadi admin
   bebas menempel URL gambar dari mana saja tanpa harus mengubah konfigurasi,
   dan situs ini tidak berubah jadi proksi gambar terbuka untuk siapa pun. */
export const HOST_GAMBAR_DIOPTIMALKAN = [
  'images.unsplash.com',
  'plus.unsplash.com',
  'res.cloudinary.com',
]

export function bisaDioptimalkan(url: string): boolean {
  try {
    return HOST_GAMBAR_DIOPTIMALKAN.includes(new URL(url).hostname)
  } catch {
    return false
  }
}

export function waHref(nomor: string): string {
  return `https://wa.me/${nomor.replace(/[^0-9]/g, '')}`
}

export function tgHref(nilai: string): string {
  const v = nilai.trim().replace(/^@/, '')
  return `https://t.me/${v}`
}

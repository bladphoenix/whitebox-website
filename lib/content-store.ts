/* Penyimpanan isi situs: satu berkas JSON di disk, tanpa database.
 *
 * HANYA untuk sisi server — mengimpor modul ini dari komponen klien akan
 * menggagalkan build karena `node:fs`. Itu memang yang diinginkan.
 *
 * Letak berkas: <induk direktori app>/data/content.json
 *   lokal    → Desktop/whitebox.asia/data/content.json
 *   produksi → /var/www/whitebox.asia/data/content.json
 * Sengaja di luar direktori repo, supaya `git pull` dan `npm run build`
 * saat deploy tidak pernah bisa menyentuhnya. Bisa ditimpa lewat env DATA_DIR. */

import fs from 'node:fs'
import path from 'node:path'
import { normalizeContent, defaultContent, type Content } from './content'

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), '..', 'data')

const BERKAS = path.join(DATA_DIR, 'content.json')
const DIR_CADANGAN = path.join(DATA_DIR, 'backups')
const SIMPAN_CADANGAN = 30

let cache: { mtimeMs: number; data: Content } | null = null

function tulisBerkas(isi: Content) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  // Tulis ke berkas sementara lalu rename: rename di satu filesystem bersifat
  // atomik, jadi pembaca tidak pernah melihat JSON separuh jadi kalau proses
  // mati di tengah penulisan.
  const sementara = `${BERKAS}.tmp-${process.pid}`
  fs.writeFileSync(sementara, JSON.stringify(isi, null, 2), 'utf8')
  fs.renameSync(sementara, BERKAS)
  cache = null
}

function cadangkan() {
  if (!fs.existsSync(BERKAS)) return
  fs.mkdirSync(DIR_CADANGAN, { recursive: true })
  const cap = new Date().toISOString().replace(/[:.]/g, '-')
  fs.copyFileSync(BERKAS, path.join(DIR_CADANGAN, `content-${cap}.json`))

  const lama = fs
    .readdirSync(DIR_CADANGAN)
    .filter((f) => f.startsWith('content-') && f.endsWith('.json'))
    .sort()
  for (const f of lama.slice(0, Math.max(0, lama.length - SIMPAN_CADANGAN))) {
    try {
      fs.unlinkSync(path.join(DIR_CADANGAN, f))
    } catch {
      /* cadangan gagal dihapus bukan alasan menggagalkan penyimpanan */
    }
  }
}

/** Isi situs saat ini. Kalau berkasnya belum ada, dibuat dari nilai awal —
 *  jadi tidak ada langkah migrasi terpisah saat pertama kali deploy. */
export function readContent(): Content {
  try {
    const stat = fs.statSync(BERKAS)
    if (cache && cache.mtimeMs === stat.mtimeMs) return cache.data
    const data = normalizeContent(JSON.parse(fs.readFileSync(BERKAS, 'utf8')))
    cache = { mtimeMs: stat.mtimeMs, data }
    return data
  } catch (e: unknown) {
    const kode = (e as NodeJS.ErrnoException)?.code
    if (kode === 'ENOENT') {
      const awal = defaultContent()
      awal.updatedAt = new Date().toISOString()
      tulisBerkas(awal)
      return awal
    }
    // JSON rusak atau tidak bisa dibaca: jangan sampai situsnya ikut mati.
    // Tampilkan nilai awal, tapi teriak di log supaya ketahuan.
    console.error('[content-store] gagal membaca', BERKAS, e)
    return defaultContent()
  }
}

/** Simpan isi baru. Yang lama dicadangkan lebih dulu. */
export function writeContent(mentah: unknown): Content {
  const isi = normalizeContent(mentah)
  isi.updatedAt = new Date().toISOString()
  cadangkan()
  tulisBerkas(isi)
  return isi
}

export function infoPenyimpanan() {
  let ada = false
  let ukuran = 0
  try {
    const s = fs.statSync(BERKAS)
    ada = true
    ukuran = s.size
  } catch {
    /* belum ada */
  }
  let cadangan = 0
  try {
    cadangan = fs.readdirSync(DIR_CADANGAN).filter((f) => f.endsWith('.json')).length
  } catch {
    /* belum ada */
  }
  return { berkas: BERKAS, ada, ukuran, cadangan }
}

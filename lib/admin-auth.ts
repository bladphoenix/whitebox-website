/* Autentikasi panel admin — tanpa database, tanpa pustaka luar.
 *
 * Satu kata sandi disimpan sebagai hash scrypt di env, sesi dititipkan ke
 * cookie yang ditandatangani HMAC. Cukup untuk satu pemilik situs; kalau
 * suatu saat butuh banyak akun, ini titik yang harus diganti.
 *
 * Dua env yang wajib ada di .env.local (dibuat lewat
 * `node scripts/admin-password.mjs "<kata sandi>"`):
 *   ADMIN_PASSWORD_HASH=scrypt:<saltHex>:<hashHex>
 *   ADMIN_SESSION_SECRET=<64 hex acak>
 *
 * Pemisahnya titik dua, bukan dolar. Next memuat berkas .env lewat
 * dotenv-expand, yang membaca `$abc` sebagai rujukan variabel lain dan
 * menggantinya dengan string kosong — hash-nya ikut hilang tanpa pesan
 * kesalahan apa pun, dan yang terlihat cuma "kata sandi salah" terus.
 */

import crypto from 'node:crypto'

const NAMA_COOKIE = 'wb_admin'
const UMUR_SESI_MS = 8 * 60 * 60 * 1000 // 8 jam
const SCRYPT = { N: 16384, r: 8, p: 1, dkLen: 32 }

export const COOKIE_SESI = NAMA_COOKIE

export function adminSiap(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET)
}

export function buatHash(sandi: string, saltHex?: string): string {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : crypto.randomBytes(16)
  const kunci = crypto.scryptSync(sandi.normalize('NFKC'), salt, SCRYPT.dkLen, {
    N: SCRYPT.N,
    r: SCRYPT.r,
    p: SCRYPT.p,
  })
  return `scrypt:${salt.toString('hex')}:${kunci.toString('hex')}`
}

export function sandiBenar(sandi: string): boolean {
  const tersimpan = process.env.ADMIN_PASSWORD_HASH
  if (!tersimpan) return false
  const [algo, saltHex, hashHex] = tersimpan.split(':')
  if (algo !== 'scrypt' || !saltHex || !hashHex) return false

  let hitung: string
  try {
    hitung = buatHash(sandi, saltHex).split(':')[2]
  } catch {
    return false
  }
  const a = Buffer.from(hitung, 'hex')
  const b = Buffer.from(hashHex, 'hex')
  // Panjang harus sama sebelum timingSafeEqual, kalau tidak ia melempar.
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

function tandaTangan(pesan: string): string {
  return crypto
    .createHmac('sha256', process.env.ADMIN_SESSION_SECRET || '')
    .update(pesan)
    .digest('hex')
}

export function buatSesi(): { nilai: string; maxAge: number } {
  const kedaluwarsa = Date.now() + UMUR_SESI_MS
  const pesan = String(kedaluwarsa)
  return { nilai: `${pesan}.${tandaTangan(pesan)}`, maxAge: Math.floor(UMUR_SESI_MS / 1000) }
}

export function sesiSah(nilai: string | undefined): boolean {
  if (!nilai || !adminSiap()) return false
  const titik = nilai.lastIndexOf('.')
  if (titik < 1) return false

  const pesan = nilai.slice(0, titik)
  const tanda = nilai.slice(titik + 1)
  const benar = tandaTangan(pesan)
  const a = Buffer.from(tanda, 'hex')
  const b = Buffer.from(benar, 'hex')
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false

  const kedaluwarsa = Number(pesan)
  return Number.isFinite(kedaluwarsa) && kedaluwarsa > Date.now()
}

/* ── Pembatas percobaan login ─────────────────────────────────────────
   Disimpan di memori proses: hilang saat pm2 restart, dan tidak berlaku
   lintas instance. Untuk satu proses pm2 di satu VPS itu sudah cukup —
   tujuannya menahan tebak-tebakan otomatis, bukan menjadi WAF. */
type Jejak = { gagal: number; sampai: number }
const jejak = new Map<string, Jejak>()
const MAKS_GAGAL = 5
const KURUNG_MS = 15 * 60 * 1000

export function ipDari(req: Request): string {
  const h = req.headers
  const fwd = h.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return h.get('x-real-ip') || 'tanpa-ip'
}

export function terkunci(ip: string): number {
  const j = jejak.get(ip)
  if (!j) return 0
  if (j.sampai > Date.now()) return Math.ceil((j.sampai - Date.now()) / 1000)
  if (j.sampai) jejak.delete(ip)
  return 0
}

export function catatGagal(ip: string) {
  const j = jejak.get(ip) ?? { gagal: 0, sampai: 0 }
  j.gagal += 1
  if (j.gagal >= MAKS_GAGAL) {
    j.sampai = Date.now() + KURUNG_MS
    j.gagal = 0
  }
  jejak.set(ip, j)
}

export function catatBerhasil(ip: string) {
  jejak.delete(ip)
}

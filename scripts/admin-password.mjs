/* Membuat dua baris env untuk panel admin.
 *
 *   node scripts/admin-password.mjs "kata sandi kamu"
 *
 * Salin keluarannya ke .env.local di direktori aplikasi, lalu restart pm2.
 * Kata sandinya sendiri tidak pernah disimpan di mana pun — yang tersimpan
 * hanya hash scrypt-nya. Kalau lupa, jalankan lagi perintah ini. */

import crypto from 'node:crypto'

const sandi = process.argv[2]
if (!sandi) {
  console.error('Pakai: node scripts/admin-password.mjs "kata sandi kamu"')
  process.exit(1)
}
if (sandi.length < 10) {
  console.error(`Kata sandi cuma ${sandi.length} karakter. Minimal 10 — panel ini terbuka di internet.`)
  process.exit(1)
}

const salt = crypto.randomBytes(16)
const kunci = crypto.scryptSync(sandi.normalize('NFKC'), salt, 32, { N: 16384, r: 8, p: 1 })

console.log('')
console.log('# --- salin dua baris ini ke .env.local ---')
// Pemisah titik dua, bukan dolar: Next memuat .env lewat dotenv-expand yang
// akan membaca `$abc` sebagai rujukan variabel dan mengosongkannya diam-diam.
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString('hex')}:${kunci.toString('hex')}`)
console.log(`ADMIN_SESSION_SECRET=${crypto.randomBytes(32).toString('hex')}`)
console.log('# -----------------------------------------')
console.log('')
console.log('Catatan: ADMIN_SESSION_SECRET baru membuat semua sesi yang sedang')
console.log('berjalan langsung gugur. Kalau cuma ingin ganti kata sandi tanpa')
console.log('memutus sesi, biarkan baris SESSION_SECRET yang lama.')

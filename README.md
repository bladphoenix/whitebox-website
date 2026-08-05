# Whitebox.asia

Situs profil layanan Whitebox.asia — pengembangan web, manajemen server, SEO,
dan layanan kreatif. Satu halaman, dua bahasa (Indonesia/Inggris), tema gelap
dan terang.

Live: <https://whitebox.asia> · Panel isi situs: <https://whitebox.asia/admin>

## Teknologi

| Bagian | Yang dipakai |
| --- | --- |
| Framework | Next.js 14.2.5 (App Router) + React 18 + TypeScript |
| Styling | CSS biasa di `app/globals.css` — **tanpa** Tailwind atau pustaka UI |
| Ikon | Font Awesome 6.5.1 lewat CDN (`app/layout.tsx`) |
| Font | Inter & Playfair Display lewat `next/font/google` |
| Gambar | Cloudinary + Unsplash (lihat `next.config.mjs`) |
| Penyimpanan isi | Satu berkas JSON di disk — **tanpa database** |
| Produksi | Ubuntu, Node 22, pm2, Nginx reverse proxy |

Dependensi runtime-nya hanya `next`, `react`, dan `react-dom`. Semua animasi
(navbar pill, dinding testimoni, GridMotion, LetterGlitch) ditulis dengan CSS
dan `requestAnimationFrame`, tanpa GSAP maupun Framer Motion.

## Struktur

```
app/
  layout.tsx            membaca isi situs dari disk, membungkus LanguageProvider
  page.tsx              merangkai section (ISR, revalidate 300 detik)
  globals.css           seluruh gaya halaman depan
  admin/                panel penyunting isi (halaman + CSS-nya sendiri)
  api/admin/            login, logout, baca/tulis isi
components/             satu berkas per section
lib/
  content.ts            bentuk dokumen isi + nilai awal + penggabung
  content-store.ts      baca/tulis JSON ke disk (khusus server)
  content-default? →    lib/data/site-data.ts & site-text.ts  = nilai awal
  i18n.tsx              konteks bahasa + pembawa isi ke komponen
  admin-auth.ts         hash kata sandi, cookie sesi, pembatas login
scripts/
  admin-password.mjs    membuat baris env kata sandi admin
```

## Menjalankan di lokal

```bash
npm install
npm run dev          # http://localhost:3000
```

Saat pertama dijalankan, `data/content.json` dibuat otomatis di **direktori
induk** proyek (jadi `whitebox.asia/data/`, sejajar dengan `whitebox-nextjs/`).
Tidak ada langkah migrasi.

Untuk mencoba panel admin di lokal, buat dulu kata sandinya:

```bash
node scripts/admin-password.mjs "kata sandi kamu"
# salin dua baris keluarannya ke .env.local
```

## Isi situs

**Isi situs tidak lagi ditulis di dalam berkas komponen.** Semuanya —
teks Hero, kartu Layanan, daftar Portofolio, semua kartu Harga, langkah Alur
Kerja, Testimoni, dan nomor WhatsApp/Telegram — dibaca dari:

```
<induk direktori proyek>/data/content.json
```

- lokal → `whitebox.asia/data/content.json`
- produksi → `/var/www/whitebox.asia/data/content.json`
- bisa dipindah lewat env `DATA_DIR`

Letaknya sengaja **di luar direktori repo** supaya `git pull` dan `npm run build`
saat deploy tidak pernah bisa menyentuhnya. Nginx juga tidak menyajikannya —
hanya `/_next/static` dan `/public` yang di-alias, sisanya diteruskan ke Next.

Nilai di `lib/data/site-data.ts` dan `site-text.ts` **hanya dipakai kalau
`content.json` belum ada**. Menyunting teks di berkas `.tsx` tidak akan
mengubah apa pun begitu berkas JSON-nya sudah terbentuk — gunakan panel.

Setiap penyimpanan menulis lewat berkas sementara lalu `rename` (atomik) dan
menyalin versi sebelumnya ke `data/backups/`; 30 cadangan terakhir disimpan.

### Panel `/admin`

Tujuh tab: Hero, Layanan, Portofolio, Harga, Alur Kerja, Testimoni, Kontak.
Setiap teks punya kolom Indonesia dan Inggris bersebelahan — sisi Inggris boleh
dikosongkan, situs akan memakai teks Indonesia.

Daftar (layanan, proyek, kartu harga, langkah, testimoni) bisa ditambah,
diurutkan, dan dihapus. Testimoni bisa **disembunyikan** tanpa dihapus.

Halaman utama memakai ISR; panel memanggil `revalidatePath('/')` setiap
menyimpan, jadi perubahan langsung terlihat tanpa build ulang.

Keamanan: satu kata sandi (hash scrypt di env), sesi lewat cookie HttpOnly
bertanda tangan HMAC selama 8 jam, perbandingan `timingSafeEqual`, dan login
dikunci 15 menit setelah 5 kali gagal per IP.

## Variabel lingkungan

Ditaruh di `.env.local` (tidak masuk git, mode 600 di server):

| Nama | Wajib | Keterangan |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | ya, untuk panel | `scrypt:<salt>:<hash>` dari `scripts/admin-password.mjs` |
| `ADMIN_SESSION_SECRET` | ya, untuk panel | 64 karakter heksa acak |
| `DATA_DIR` | tidak | menimpa letak `content.json` |

Tanpa dua env pertama, situsnya tetap jalan normal; `/admin` yang menampilkan
"Panel belum disetel".

> **Pemisah di `ADMIN_PASSWORD_HASH` adalah titik dua, bukan dolar.** Next
> memuat berkas `.env` lewat dotenv-expand, yang membaca `$abc` sebagai rujukan
> variabel lain dan menggantinya dengan string kosong. Gejalanya cuma "kata
> sandi salah" yang tidak pernah bisa benar.

## Deploy

Produksi berjalan di `/var/www/whitebox.asia/whitebox-nextjs`, proses pm2
bernama `whitebox-app` di port 3000, di belakang Nginx.

```bash
ssh root@145.79.15.238
cd /var/www/whitebox.asia/whitebox-nextjs
cp -a .next /tmp/next-bak-$(date +%Y%m%d-%H%M%S)   # jaring pengaman
git pull --ff-only origin main
npm run build
pm2 restart whitebox-app --update-env
```

Verifikasi sesudahnya:

```bash
curl -o /dev/null -w "%{http_code}\n" https://whitebox.asia/
curl -o /dev/null -w "%{http_code}\n" https://whitebox.asia/admin
curl -o /dev/null -w "%{http_code}\n" https://filmoved.com/   # tetangga di VPS yang sama
```

Kalau memeriksa CSS benar-benar terbit, ingat halaman memuat **dua** berkas
`/_next/static/css/*.css` — mengambil yang pertama saja menipu.

### Yang tidak boleh terhapus di server

Berkas berikut hanya ada di server dan tidak terlihat oleh git:

- `.env.local` — kata sandi panel. Kalau hilang, panel harus disetel ulang.
- `../data/` — seluruh isi situs beserta cadangannya.
- `components/Portfolio.tsx` dan `components/Pricing-backup.tsx` — untracked,
  tidak diimpor oleh halaman mana pun, tapi sengaja dibiarkan.

Jangan pernah `git add -A`, `git checkout .`, `git reset --hard`, atau rsync
seluruh folder di direktori produksi.

### Rollback

```bash
rm -rf .next && cp -a /tmp/next-bak-<cap-waktu> .next
pm2 restart whitebox-app
```

Untuk mengembalikan **isi situs** saja, salin salah satu berkas di
`../data/backups/` menjadi `../data/content.json`, lalu restart pm2.

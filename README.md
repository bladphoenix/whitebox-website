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

Selengkapnya soal panel — termasuk cara mengganti kata sandi di produksi —
ada di [Panel admin](#panel-admin).

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

## Panel admin

Alamat: <https://whitebox.asia/admin> (lokal: `http://localhost:3000/admin`).
Halamannya ber-`noindex` dan tidak ditautkan dari mana pun di situs.

### Yang bisa disunting

Tujuh tab: **Hero · Layanan · Portofolio · Harga · Alur Kerja · Testimoni ·
Kontak** — termasuk judul dan subjudul tiap section.

- Setiap teks punya kolom Indonesia dan Inggris bersebelahan. Sisi Inggris
  boleh dikosongkan; situs akan memakai teks Indonesia.
- Daftar (layanan, proyek, kartu harga, langkah alur, testimoni) bisa
  ditambah, diurutkan naik/turun, dan dihapus.
- Testimoni bisa **disembunyikan** tanpa dihapus — tetap tersimpan di JSON.
- Kolom gambar (hero & portofolio) menerima URL tempel, dengan pratinjau
  langsung. URL dari host di luar `next.config.mjs` tetap tampil, hanya
  dilewatkan tanpa pengoptimalan gambar Next.

Tombol **Simpan** baru hidup kalau ada yang berubah, dan menutup tab dengan
perubahan yang belum disimpan akan dikonfirmasi dulu oleh browser.

Halaman utama memakai ISR; panel memanggil `revalidatePath('/')` setiap
menyimpan, jadi perubahan langsung terlihat tanpa build ulang.

### Menyetel kata sandi pertama kali

Panel tidak punya halaman pendaftaran — kata sandinya disetel dari baris
perintah. Selama env-nya belum ada, `/admin` hanya menampilkan
"Panel belum disetel" dan tidak bisa dimasuki siapa pun.

```bash
ssh root@145.79.15.238
cd /var/www/whitebox.asia/whitebox-nextjs

node scripts/admin-password.mjs "kata sandi kamu"
# keluarannya dua baris: ADMIN_PASSWORD_HASH dan ADMIN_SESSION_SECRET
# salin keduanya ke .env.local

chmod 600 .env.local
pm2 restart whitebox-app --update-env
```

Skrip menolak kata sandi di bawah 10 karakter. Yang tersimpan hanya hash
scrypt-nya — kata sandinya sendiri tidak pernah ditulis ke mana pun.

### Mengganti kata sandi

Sama persis dengan di atas: jalankan skripnya dengan kata sandi baru, lalu
timpa `.env.local`, lalu restart pm2. Yang perlu diputuskan cuma satu hal —
mau ikut memutus sesi yang sedang berjalan atau tidak:

| Yang disalin ke `.env.local` | Akibatnya |
| --- | --- |
| Hanya baris `ADMIN_PASSWORD_HASH` | Kata sandi berganti, sesi yang sedang aktif **tetap hidup** sampai 8 jam |
| Kedua barisnya | Kata sandi berganti dan **semua sesi langsung gugur** — pakai ini kalau curiga sandi lama bocor |

Perubahan baru berlaku setelah `pm2 restart whitebox-app --update-env`.
Tanpa `--update-env`, pm2 memakai env lama dan kata sandi baru akan terus
ditolak.

### Kalau lupa kata sandi

Tidak ada pemulihan, dan memang tidak perlu — cukup setel yang baru dengan
langkah di atas. Tidak ada data yang hilang: isi situs disimpan terpisah di
`data/content.json`, bukan di dalam `.env.local`.

Kalau salah memasukkan sandi 5 kali, login dari IP itu terkunci 15 menit.
Kuncinya disimpan di memori proses, jadi `pm2 restart whitebox-app`
langsung membukanya lagi.

### Keamanan

- Kata sandi disimpan sebagai hash **scrypt** (N=16384, r=8, p=1) dengan
  salt acak per pemasangan; perbandingannya memakai `timingSafeEqual`.
- Sesi berupa cookie **HttpOnly + SameSite=Lax** yang ditandatangani
  HMAC-SHA256, berumur 8 jam. Bendera `Secure` menyala di produksi (mati saat
  `npm run dev` supaya panel tetap bisa dipakai lewat `http://localhost`).
- Login dibatasi 5 percobaan per IP per 15 menit.
- Semua endpoint di `/api/admin/` menolak permintaan tanpa sesi yang sah
  dengan HTTP 401.

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

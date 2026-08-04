import { cookies } from 'next/headers'
import { COOKIE_SESI, adminSiap, sesiSah } from '@/lib/admin-auth'
import { readContent } from '@/lib/content-store'
import Editor from './Editor'
import Login from './Login'

/* Selalu dirender per permintaan — halaman ini bergantung pada cookie sesi
   dan harus selalu menampilkan isi terbaru dari disk, bukan versi cache. */
export const dynamic = 'force-dynamic'

export default function AdminPage() {
  if (!adminSiap()) {
    return (
      <div className="a-masuk">
        <div className="a-masuk-kotak">
          <h1>Panel belum disetel</h1>
          <p>
            Buat kata sandi lebih dulu di server, lalu restart aplikasinya:
          </p>
          <pre className="a-kode">
{`cd /var/www/whitebox.asia/whitebox-nextjs
node scripts/admin-password.mjs "kata sandi kamu"
# salin dua baris keluarannya ke .env.local
pm2 restart whitebox-app --update-env`}
          </pre>
        </div>
      </div>
    )
  }

  if (!sesiSah(cookies().get(COOKIE_SESI)?.value)) return <Login />

  return <Editor awal={readContent()} />
}

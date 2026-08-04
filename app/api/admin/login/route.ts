import { NextResponse } from 'next/server'
import {
  COOKIE_SESI,
  adminSiap,
  buatSesi,
  catatBerhasil,
  catatGagal,
  ipDari,
  sandiBenar,
  terkunci,
} from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!adminSiap()) {
    return NextResponse.json(
      { pesan: 'Panel belum disetel. ADMIN_PASSWORD_HASH dan ADMIN_SESSION_SECRET belum ada di .env.local.' },
      { status: 503 }
    )
  }

  const ip = ipDari(req)
  const sisa = terkunci(ip)
  if (sisa) {
    return NextResponse.json(
      { pesan: `Terlalu banyak percobaan. Coba lagi ${Math.ceil(sisa / 60)} menit lagi.` },
      { status: 429 }
    )
  }

  let sandi = ''
  try {
    const body = (await req.json()) as { password?: unknown }
    sandi = typeof body.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ pesan: 'Permintaan tidak terbaca.' }, { status: 400 })
  }

  if (!sandiBenar(sandi)) {
    catatGagal(ip)
    // Jeda kecil supaya menebak-nebak lewat skrip tidak murah.
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ pesan: 'Kata sandi salah.' }, { status: 401 })
  }

  catatBerhasil(ip)
  const sesi = buatSesi()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_SESI, sesi.nilai, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sesi.maxAge,
  })
  return res
}

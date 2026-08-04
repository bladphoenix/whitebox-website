import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { COOKIE_SESI, sesiSah } from '@/lib/admin-auth'
import { infoPenyimpanan, readContent, writeContent } from '@/lib/content-store'

export const dynamic = 'force-dynamic'

/** Batas ukuran kiriman. Isi situs saat ini ~35 KB; 2 MB memberi banyak ruang
 *  tumbuh tapi tetap menutup pengiriman berkas raksasa. */
const BATAS_BYTE = 2 * 1024 * 1024

function ditolak() {
  return NextResponse.json({ pesan: 'Sesi habis atau belum masuk.' }, { status: 401 })
}

export async function GET() {
  if (!sesiSah(cookies().get(COOKIE_SESI)?.value)) return ditolak()
  return NextResponse.json({ content: readContent(), penyimpanan: infoPenyimpanan() })
}

export async function PUT(req: Request) {
  if (!sesiSah(cookies().get(COOKIE_SESI)?.value)) return ditolak()

  const mentah = await req.text()
  if (mentah.length > BATAS_BYTE) {
    return NextResponse.json({ pesan: 'Kiriman terlalu besar.' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(mentah)
  } catch {
    return NextResponse.json({ pesan: 'JSON tidak terbaca.' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ pesan: 'Isi harus berupa objek.' }, { status: 400 })
  }

  let disimpan
  try {
    disimpan = writeContent(body)
  } catch (e) {
    console.error('[admin] gagal menyimpan isi', e)
    return NextResponse.json(
      { pesan: 'Gagal menulis ke disk. Cek izin folder data di server.' },
      { status: 500 }
    )
  }

  // Halaman utama memakai ISR; tanpa ini perubahan baru muncul setelah
  // jendela revalidate lewat. Kegagalannya sengaja dilaporkan, bukan didiamkan
  // — kalau tidak, panel akan bilang "tersimpan" padahal situs belum berubah.
  try {
    revalidatePath('/')
  } catch (e) {
    console.error('[admin] revalidatePath gagal', e)
    return NextResponse.json(
      {
        pesan: 'Tersimpan, tapi situs gagal disegarkan. Perubahan akan muncul paling lama 5 menit lagi.',
        updatedAt: disimpan.updatedAt,
        peringatan: true,
      },
      { status: 200 }
    )
  }

  return NextResponse.json({ ok: true, updatedAt: disimpan.updatedAt })
}

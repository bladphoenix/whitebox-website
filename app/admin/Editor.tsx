'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Content,
  HeroStat,
  PriceCard,
  Project,
  ServiceCard,
  Testimonial,
  WorkflowStep,
} from '@/lib/content'
import { Baris, Centang, Dwi, TambahBaris, Teks, Warna, geser } from './fields'
import Tema from './Tema'

type Tab = 'hero' | 'layanan' | 'portofolio' | 'harga' | 'alur' | 'testimoni' | 'kontak'

const TABS: { id: Tab; label: string; ikon: string }[] = [
  { id: 'hero', label: 'Hero', ikon: 'fa-house' },
  { id: 'layanan', label: 'Layanan', ikon: 'fa-screwdriver-wrench' },
  { id: 'portofolio', label: 'Portofolio', ikon: 'fa-images' },
  { id: 'harga', label: 'Harga', ikon: 'fa-tags' },
  { id: 'alur', label: 'Alur Kerja', ikon: 'fa-diagram-project' },
  { id: 'testimoni', label: 'Testimoni', ikon: 'fa-comment-dots' },
  { id: 'kontak', label: 'Kontak', ikon: 'fa-paper-plane' },
]

const salin = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T

export default function Editor({ awal }: { awal: Content }) {
  const [c, setC] = useState<Content>(awal)
  const [tab, setTab] = useState<Tab>('hero')
  const [kotor, setKotor] = useState(false)
  const [simpan, setSimpan] = useState(false)
  const [pesan, setPesan] = useState<{ teks: string; jenis: 'ok' | 'salah' } | null>(null)
  const tersimpan = useRef(JSON.stringify(awal))

  /** Semua perubahan lewat sini: menyalin dulu, baru diubah. */
  const ubah = useCallback((fn: (d: Content) => void) => {
    setC((prev) => {
      const d = salin(prev)
      fn(d)
      return d
    })
    setKotor(true)
    setPesan(null)
  }, [])

  // Jangan sampai satu jam mengetik hilang gara-gara tab ketutup.
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (!kotor) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [kotor])

  async function kirim() {
    setSimpan(true)
    setPesan(null)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(c),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setPesan({ teks: data.pesan || `Gagal menyimpan (HTTP ${res.status}).`, jenis: 'salah' })
      } else if (data.peringatan) {
        setPesan({ teks: data.pesan, jenis: 'salah' })
        setKotor(false)
        tersimpan.current = JSON.stringify(c)
      } else {
        setPesan({ teks: 'Tersimpan. Situs sudah diperbarui.', jenis: 'ok' })
        setKotor(false)
        tersimpan.current = JSON.stringify(c)
      }
    } catch {
      setPesan({ teks: 'Tidak bisa menghubungi server.', jenis: 'salah' })
    } finally {
      setSimpan(false)
    }
  }

  function batal() {
    if (!confirm('Buang semua perubahan yang belum disimpan?')) return
    setC(JSON.parse(tersimpan.current) as Content)
    setKotor(false)
    setPesan(null)
  }

  async function keluar() {
    if (kotor && !confirm('Masih ada perubahan yang belum disimpan. Tetap keluar?')) return
    await fetch('/api/admin/logout', { method: 'POST' })
    location.href = '/admin'
  }

  return (
    <div className="a-app">
      <header className="a-top">
        <div className="a-top-kiri">
          <strong>Panel Isi Situs</strong>
          <a href="/" target="_blank" rel="noreferrer" className="a-lihat">
            <i className="fa-solid fa-arrow-up-right-from-square" /> Lihat situs
          </a>
        </div>
        <div className="a-top-kanan">
          {pesan && <span className={`a-pesan ${pesan.jenis}`}>{pesan.teks}</span>}
          {kotor && !pesan && <span className="a-pesan">Ada perubahan belum disimpan</span>}
          <button type="button" className="a-btn" onClick={batal} disabled={!kotor || simpan}>
            Batalkan
          </button>
          <button type="button" className="a-btn utama" onClick={kirim} disabled={!kotor || simpan}>
            {simpan ? 'Menyimpan…' : 'Simpan'}
          </button>
          <Tema />
          <button type="button" className="a-btn" onClick={keluar}>
            Keluar
          </button>
        </div>
      </header>

      <nav className="a-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'aktif' : ''}
            onClick={() => setTab(t.id)}
          >
            <i className={`fa-solid ${t.ikon}`} /> {t.label}
          </button>
        ))}
      </nav>

      <main className="a-isi">
        {tab === 'hero' && <TabHero c={c} ubah={ubah} />}
        {tab === 'layanan' && <TabLayanan c={c} ubah={ubah} />}
        {tab === 'portofolio' && <TabPortofolio c={c} ubah={ubah} />}
        {tab === 'harga' && <TabHarga c={c} ubah={ubah} />}
        {tab === 'alur' && <TabAlur c={c} ubah={ubah} />}
        {tab === 'testimoni' && <TabTestimoni c={c} ubah={ubah} />}
        {tab === 'kontak' && <TabKontak c={c} ubah={ubah} />}
      </main>
    </div>
  )
}

type Props = { c: Content; ubah: (fn: (d: Content) => void) => void }

/* Judul + subjudul satu section, dipakai hampir semua tab. */
function KepalaSection({
  c,
  ubah,
  bagian,
  punyaLabel = true,
}: Props & { bagian: 'services' | 'projects' | 'pricing' | 'workflow' | 'testimonials' | 'contact'; punyaLabel?: boolean }) {
  return (
    <section className="a-kotak">
      <h2>Judul section</h2>
      {punyaLabel && (
        <Dwi
          label="Label kecil"
          id={c.text.id[bagian].label}
          en={c.text.en[bagian].label}
          onId={(v) => ubah((d) => { d.text.id[bagian].label = v })}
          onEn={(v) => ubah((d) => { d.text.en[bagian].label = v })}
        />
      )}
      {'title' in c.text.id[bagian] && (
        <Dwi
          label="Judul"
          id={(c.text.id[bagian] as { title: string }).title}
          en={(c.text.en[bagian] as { title: string }).title}
          onId={(v) => ubah((d) => { (d.text.id[bagian] as { title: string }).title = v })}
          onEn={(v) => ubah((d) => { (d.text.en[bagian] as { title: string }).title = v })}
        />
      )}
      {'sub' in c.text.id[bagian] && (
        <Dwi
          label="Subjudul"
          baris={2}
          id={(c.text.id[bagian] as { sub: string }).sub}
          en={(c.text.en[bagian] as { sub: string }).sub}
          onId={(v) => ubah((d) => { (d.text.id[bagian] as { sub: string }).sub = v })}
          onEn={(v) => ubah((d) => { (d.text.en[bagian] as { sub: string }).sub = v })}
        />
      )}
    </section>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */
function TabHero({ c, ubah }: Props) {
  const h = { id: c.text.id.hero, en: c.text.en.hero }
  const set = (k: keyof typeof h.id) => ({
    onId: (v: string) => ubah((d) => { d.text.id.hero[k] = v }),
    onEn: (v: string) => ubah((d) => { d.text.en.hero[k] = v }),
  })

  return (
    <>
      <section className="a-kotak">
        <h2>Teks utama</h2>
        <Dwi label="Badge" id={h.id.badge} en={h.en.badge} {...set('badge')} />
        <Dwi label="Judul baris 1" id={h.id.titleTop} en={h.en.titleTop} {...set('titleTop')} />
        <Dwi
          label="Judul baris 2 (bergradasi)"
          id={h.id.titleAccent}
          en={h.en.titleAccent}
          {...set('titleAccent')}
        />
        <Dwi label="Paragraf" baris={3} id={h.id.sub} en={h.en.sub} {...set('sub')} />
        <Dwi label="Tombol utama" id={h.id.btnPrimary} en={h.en.btnPrimary} {...set('btnPrimary')} />
        <Dwi label="Tombol kedua" id={h.id.btnGhost} en={h.en.btnGhost} {...set('btnGhost')} />
        <Dwi label="Kutipan di atas gambar" baris={2} id={h.id.quote} en={h.en.quote} {...set('quote')} />
      </section>

      <section className="a-kotak">
        <h2>Gambar hero</h2>
        <p className="a-catatan">
          Tampil sebagai korsel bertumpuk. Yang paling atas di daftar ini yang
          terlihat paling depan saat halaman dibuka. Kalau hanya diisi satu,
          korselnya berhenti jadi satu gambar diam.
        </p>
        {c.hero.images.map((url, i) => (
          <Baris
            key={i}
            judul={`Gambar ${i + 1}`}
            ringkas={url.replace(/^https?:\/\//, '').slice(0, 52)}
            atas={() => ubah((d) => { d.hero.images = geser(d.hero.images, i, i - 1) })}
            bawah={() => ubah((d) => { d.hero.images = geser(d.hero.images, i, i + 1) })}
            hapus={
              c.hero.images.length > 1
                ? () => ubah((d) => { d.hero.images.splice(i, 1) })
                : undefined
            }
          >
            <Teks
              label="URL gambar"
              value={url}
              onChange={(v) => ubah((d) => { d.hero.images[i] = v })}
              petunjuk="tempel URL gambar; boleh dari mana saja"
            />
            <Pratinjau url={url} />
          </Baris>
        ))}
        <TambahBaris
          label="Tambah gambar"
          onClick={() => ubah((d) => { d.hero.images.push('') })}
        />
      </section>

      <section className="a-kotak">
        <h2>Statistik</h2>
        {c.hero.stats.map((s, i) => (
          <Baris
            key={i}
            judul={`${s.num} — ${s.label}`}
            atas={() => ubah((d) => { d.hero.stats = geser(d.hero.stats, i, i - 1) })}
            bawah={() => ubah((d) => { d.hero.stats = geser(d.hero.stats, i, i + 1) })}
            hapus={() => ubah((d) => { d.hero.stats.splice(i, 1) })}
          >
            <Teks label="Angka" value={s.num} onChange={(v) => ubah((d) => { d.hero.stats[i].num = v })} />
            <Dwi
              label="Keterangan"
              id={s.label}
              en={s.labelEn}
              onId={(v) => ubah((d) => { d.hero.stats[i].label = v })}
              onEn={(v) => ubah((d) => { d.hero.stats[i].labelEn = v })}
            />
          </Baris>
        ))}
        <TambahBaris
          label="Tambah statistik"
          onClick={() =>
            ubah((d) => {
              const baru: HeroStat = { num: '0', label: 'Keterangan', labelEn: '' }
              d.hero.stats.push(baru)
            })
          }
        />
      </section>
    </>
  )
}

/* ── Layanan ──────────────────────────────────────────────────────── */
function TabLayanan({ c, ubah }: Props) {
  return (
    <>
      <KepalaSection c={c} ubah={ubah} bagian="services" />
      <section className="a-kotak">
        <h2>Kartu layanan</h2>
        {c.services.map((s, i) => (
          <Baris
            key={i}
            judul={s.title}
            ringkas={s.icon}
            atas={() => ubah((d) => { d.services = geser(d.services, i, i - 1) })}
            bawah={() => ubah((d) => { d.services = geser(d.services, i, i + 1) })}
            hapus={() => ubah((d) => { d.services.splice(i, 1) })}
          >
            <Dwi
              label="Judul"
              id={s.title}
              en={s.titleEn}
              onId={(v) => ubah((d) => { d.services[i].title = v })}
              onEn={(v) => ubah((d) => { d.services[i].titleEn = v })}
            />
            <Dwi
              label="Keterangan"
              baris={3}
              id={s.desc}
              en={s.descEn}
              onId={(v) => ubah((d) => { d.services[i].desc = v })}
              onEn={(v) => ubah((d) => { d.services[i].descEn = v })}
            />
            <div className="a-tiga">
              <Ikon
                value={s.icon}
                onChange={(v) => ubah((d) => { d.services[i].icon = v })}
                warna={s.iconColor}
              />
              <Warna
                label="Warna ikon"
                value={s.iconColor}
                onChange={(v) => ubah((d) => { d.services[i].iconColor = v })}
              />
              <Teks
                label="Latar ikon"
                value={s.iconBg}
                onChange={(v) => ubah((d) => { d.services[i].iconBg = v })}
                petunjuk="mis. rgba(37,99,235,0.1)"
              />
            </div>
          </Baris>
        ))}
        <TambahBaris
          label="Tambah layanan"
          onClick={() =>
            ubah((d) => {
              const baru: ServiceCard = {
                title: 'Layanan Baru',
                titleEn: '',
                desc: '',
                descEn: '',
                icon: 'fa-solid fa-star',
                iconColor: '#4f8bff',
                iconBg: 'rgba(79,139,255,0.1)',
              }
              d.services.push(baru)
            })
          }
        />
      </section>
    </>
  )
}

/* ── Portofolio ───────────────────────────────────────────────────── */
function TabPortofolio({ c, ubah }: Props) {
  return (
    <>
      <KepalaSection c={c} ubah={ubah} bagian="projects" />
      <section className="a-kotak">
        <h2>Teks tombol</h2>
        <Dwi
          label="Tombol pada kartu"
          id={c.text.id.projects.visit}
          en={c.text.en.projects.visit}
          onId={(v) => ubah((d) => { d.text.id.projects.visit = v })}
          onEn={(v) => ubah((d) => { d.text.en.projects.visit = v })}
        />
        <Dwi
          label="Tombol pada popup gambar"
          id={c.text.id.projects.visitSite}
          en={c.text.en.projects.visitSite}
          onId={(v) => ubah((d) => { d.text.id.projects.visitSite = v })}
          onEn={(v) => ubah((d) => { d.text.en.projects.visitSite = v })}
        />
      </section>

      <section className="a-kotak">
        <h2>Proyek</h2>
        <p className="a-catatan">
          Cuplikan layar di sini juga dipakai jadi latar bergerak di section Layanan.
        </p>
        {c.projects.map((p, i) => (
          <Baris
            key={i}
            judul={p.domain}
            ringkas={p.tag}
            atas={() => ubah((d) => { d.projects = geser(d.projects, i, i - 1) })}
            bawah={() => ubah((d) => { d.projects = geser(d.projects, i, i + 1) })}
            hapus={() => ubah((d) => { d.projects.splice(i, 1) })}
          >
            <Teks
              label="Domain"
              value={p.domain}
              onChange={(v) => ubah((d) => { d.projects[i].domain = v })}
              petunjuk="tanpa https://"
            />
            <Teks
              label="URL cuplikan layar"
              value={p.img}
              onChange={(v) => ubah((d) => { d.projects[i].img = v })}
            />
            <Pratinjau url={p.img} />
            <div className="a-dua">
              <Dwi
                label="Kategori"
                id={p.tag}
                en={p.tagEn}
                onId={(v) => ubah((d) => { d.projects[i].tag = v })}
                onEn={(v) => ubah((d) => { d.projects[i].tagEn = v })}
              />
              <Warna
                label="Warna kategori"
                value={p.color}
                onChange={(v) => ubah((d) => { d.projects[i].color = v })}
              />
            </div>
          </Baris>
        ))}
        <TambahBaris
          label="Tambah proyek"
          onClick={() =>
            ubah((d) => {
              const baru: Project = {
                domain: 'domain-baru.com',
                img: '',
                tag: 'Kategori',
                tagEn: '',
                color: '#4f8bff',
              }
              d.projects.push(baru)
            })
          }
        />
      </section>
    </>
  )
}

/* ── Harga ────────────────────────────────────────────────────────── */
const GRUP: { kunci: 'main' | 'row2' | 'creative'; judul: string; catatan: string }[] = [
  { kunci: 'main', judul: 'Paket utama', catatan: 'Kisi kartu di bagian atas section.' },
  { kunci: 'row2', judul: 'Baris kedua', catatan: 'Dua kartu lebar di bawah paket utama.' },
  { kunci: 'creative', judul: 'Layanan kreatif', catatan: 'Kisi kartu di bawah judul "Layanan Kreatif & Desain".' },
]

function TabHarga({ c, ubah }: Props) {
  return (
    <>
      <KepalaSection c={c} ubah={ubah} bagian="pricing" />
      <section className="a-kotak">
        <h2>Judul kelompok kreatif</h2>
        <Dwi
          label="Judul"
          id={c.text.id.pricing.creativeTitle}
          en={c.text.en.pricing.creativeTitle}
          onId={(v) => ubah((d) => { d.text.id.pricing.creativeTitle = v })}
          onEn={(v) => ubah((d) => { d.text.en.pricing.creativeTitle = v })}
        />
      </section>

      {GRUP.map((g) => (
        <section className="a-kotak" key={g.kunci}>
          <h2>{g.judul}</h2>
          <p className="a-catatan">{g.catatan}</p>
          {c.pricing[g.kunci].map((card, i) => (
            <Baris
              key={i}
              judul={card.name}
              ringkas={card.amount}
              atas={() => ubah((d) => { d.pricing[g.kunci] = geser(d.pricing[g.kunci], i, i - 1) })}
              bawah={() => ubah((d) => { d.pricing[g.kunci] = geser(d.pricing[g.kunci], i, i + 1) })}
              hapus={() => ubah((d) => { d.pricing[g.kunci].splice(i, 1) })}
            >
              <KartuHarga
                card={card}
                ubahKartu={(fn) => ubah((d) => fn(d.pricing[g.kunci][i]))}
              />
            </Baris>
          ))}
          <TambahBaris
            label="Tambah kartu"
            onClick={() =>
              ubah((d) => {
                const baru: PriceCard = {
                  name: 'Paket Baru',
                  nameEn: '',
                  desc: '',
                  descEn: '',
                  amount: 'IDR 0',
                  amountSuffix: '/proyek',
                  amountSuffixEn: '/project',
                  features: [],
                  btnText: 'Pesan Sekarang',
                  btnTextEn: '',
                  btnVariant: 'outline',
                }
                d.pricing[g.kunci].push(baru)
              })
            }
          />
        </section>
      ))}
    </>
  )
}

function KartuHarga({
  card,
  ubahKartu,
}: {
  card: PriceCard
  ubahKartu: (fn: (k: PriceCard) => void) => void
}) {
  return (
    <>
      <Dwi
        label="Nama paket"
        id={card.name}
        en={card.nameEn}
        onId={(v) => ubahKartu((k) => { k.name = v })}
        onEn={(v) => ubahKartu((k) => { k.nameEn = v })}
      />
      <Dwi
        label="Keterangan"
        baris={2}
        id={card.desc || ''}
        en={card.descEn || ''}
        onId={(v) => ubahKartu((k) => { k.desc = v })}
        onEn={(v) => ubahKartu((k) => { k.descEn = v })}
      />
      <div className="a-dua">
        <Dwi
          label="Harga"
          id={card.amount}
          en={card.amountEn || ''}
          onId={(v) => ubahKartu((k) => { k.amount = v })}
          onEn={(v) => ubahKartu((k) => { k.amountEn = v })}
        />
        <Dwi
          label="Satuan harga"
          id={card.amountSuffix || ''}
          en={card.amountSuffixEn || ''}
          onId={(v) => ubahKartu((k) => { k.amountSuffix = v })}
          onEn={(v) => ubahKartu((k) => { k.amountSuffixEn = v })}
        />
      </div>
      <div className="a-dua">
        <Warna
          label="Warna harga"
          value={card.amountColor || ''}
          onChange={(v) => ubahKartu((k) => { k.amountColor = v })}
        />
        <Warna
          label="Warna tombol"
          value={card.accent || ''}
          onChange={(v) => ubahKartu((k) => { k.accent = v })}
        />
      </div>
      <Dwi
        label="Teks tombol"
        id={card.btnText}
        en={card.btnTextEn}
        onId={(v) => ubahKartu((k) => { k.btnText = v })}
        onEn={(v) => ubahKartu((k) => { k.btnTextEn = v })}
      />
      <Dwi
        label="Label pojok (badge)"
        id={card.badge || ''}
        en={card.badgeEn || ''}
        onId={(v) => ubahKartu((k) => { k.badge = v })}
        onEn={(v) => ubahKartu((k) => { k.badgeEn = v })}
      />

      <div className="a-pilihan">
        <label className="a-field">
          <span className="a-label">Gaya tombol</span>
          <select
            value={card.btnVariant}
            onChange={(e) => ubahKartu((k) => { k.btnVariant = e.target.value as 'outline' | 'solid' })}
          >
            <option value="outline">Garis luar</option>
            <option value="solid">Terisi penuh</option>
          </select>
        </label>
        <Centang
          label="Sorot sebagai paket unggulan"
          checked={Boolean(card.featured)}
          onChange={(v) => ubahKartu((k) => { k.featured = v })}
        />
        <Centang
          label="Harga sejajar nama"
          checked={Boolean(card.amountInline)}
          onChange={(v) => ubahKartu((k) => { k.amountInline = v })}
        />
        <Centang
          label="Fitur dua kolom"
          checked={card.featureColumns === 2}
          onChange={(v) => ubahKartu((k) => { if (v) k.featureColumns = 2; else delete k.featureColumns })}
        />
      </div>

      <div className="a-fitur">
        <span className="a-label">Daftar fitur</span>
        {card.features.map((f, i) => (
          <div className="a-fitur-baris" key={i}>
            <input
              type="text"
              value={f.text}
              placeholder="Fitur (ID)"
              onChange={(e) => ubahKartu((k) => { k.features[i].text = e.target.value })}
            />
            <input
              type="text"
              value={f.textEn}
              placeholder="Fitur (EN, boleh kosong)"
              onChange={(e) => ubahKartu((k) => { k.features[i].textEn = e.target.value })}
            />
            <input
              type="text"
              value={f.iconColor || ''}
              placeholder="warna centang"
              onChange={(e) => ubahKartu((k) => { k.features[i].iconColor = e.target.value })}
            />
            <button
              type="button"
              className="a-hapus"
              aria-label="Hapus fitur"
              onClick={() => ubahKartu((k) => { k.features.splice(i, 1) })}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
        <TambahBaris
          label="Tambah fitur"
          onClick={() => ubahKartu((k) => { k.features.push({ text: '', textEn: '' }) })}
        />
      </div>
    </>
  )
}

/* ── Alur kerja ───────────────────────────────────────────────────── */
function TabAlur({ c, ubah }: Props) {
  return (
    <>
      <KepalaSection c={c} ubah={ubah} bagian="workflow" />
      <section className="a-kotak">
        <h2>Langkah</h2>
        <p className="a-catatan">Nomor urut mengikuti urutan di sini, jadi tidak perlu diketik.</p>
        {c.workflow.steps.map((s, i) => (
          <Baris
            key={i}
            judul={`${String(i + 1).padStart(2, '0')} · ${s.title}`}
            atas={() => ubah((d) => { d.workflow.steps = geser(d.workflow.steps, i, i - 1) })}
            bawah={() => ubah((d) => { d.workflow.steps = geser(d.workflow.steps, i, i + 1) })}
            hapus={() => ubah((d) => { d.workflow.steps.splice(i, 1) })}
          >
            <Dwi
              label="Judul"
              id={s.title}
              en={s.titleEn}
              onId={(v) => ubah((d) => { d.workflow.steps[i].title = v })}
              onEn={(v) => ubah((d) => { d.workflow.steps[i].titleEn = v })}
            />
            <Dwi
              label="Keterangan"
              baris={3}
              id={s.desc}
              en={s.descEn}
              onId={(v) => ubah((d) => { d.workflow.steps[i].desc = v })}
              onEn={(v) => ubah((d) => { d.workflow.steps[i].descEn = v })}
            />
          </Baris>
        ))}
        <TambahBaris
          label="Tambah langkah"
          onClick={() =>
            ubah((d) => {
              const baru: WorkflowStep = { title: 'Langkah Baru', titleEn: '', desc: '', descEn: '' }
              d.workflow.steps.push(baru)
            })
          }
        />
      </section>
    </>
  )
}

/* ── Testimoni ────────────────────────────────────────────────────── */
function TabTestimoni({ c, ubah }: Props) {
  const tampil = c.testimonials.filter((x) => !x.hidden).length
  return (
    <>
      <KepalaSection c={c} ubah={ubah} bagian="testimonials" />
      <section className="a-kotak">
        <h2>Ringkasan nilai</h2>
        <div className="a-dua">
          <Dwi
            label="Angka besar"
            id={c.text.id.testimonials.summaryStrong}
            en={c.text.en.testimonials.summaryStrong}
            onId={(v) => ubah((d) => { d.text.id.testimonials.summaryStrong = v })}
            onEn={(v) => ubah((d) => { d.text.en.testimonials.summaryStrong = v })}
          />
          <Dwi
            label="Teks di sebelahnya"
            id={c.text.id.testimonials.summaryText}
            en={c.text.en.testimonials.summaryText}
            onId={(v) => ubah((d) => { d.text.id.testimonials.summaryText = v })}
            onEn={(v) => ubah((d) => { d.text.en.testimonials.summaryText = v })}
          />
        </div>
      </section>

      <section className="a-kotak">
        <h2>Daftar testimoni</h2>
        <p className="a-catatan">
          {tampil} tampil di situs, {c.testimonials.length - tampil} disembunyikan. Yang
          disembunyikan tetap tersimpan dan bisa ditampilkan lagi kapan saja. Dindingnya
          dibagi tiga kolom mengikuti urutan di sini.
        </p>
        {c.testimonials.map((x, i) => (
          <Baris
            key={i}
            judul={x.name}
            ringkas={`${x.service} · ${x.location}${x.hidden ? ' · disembunyikan' : ''}`}
            atas={() => ubah((d) => { d.testimonials = geser(d.testimonials, i, i - 1) })}
            bawah={() => ubah((d) => { d.testimonials = geser(d.testimonials, i, i + 1) })}
            hapus={() => ubah((d) => { d.testimonials.splice(i, 1) })}
          >
            <Centang
              label="Sembunyikan dari situs"
              checked={Boolean(x.hidden)}
              onChange={(v) => ubah((d) => { d.testimonials[i].hidden = v })}
            />
            <div className="a-dua">
              <Teks
                label="Nama"
                value={x.name}
                onChange={(v) => ubah((d) => { d.testimonials[i].name = v })}
              />
              <Teks
                label="Kota"
                value={x.location}
                onChange={(v) => ubah((d) => { d.testimonials[i].location = v })}
              />
            </div>
            <Dwi
              label="Jabatan / usaha"
              id={x.role}
              en={x.roleEn}
              onId={(v) => ubah((d) => { d.testimonials[i].role = v })}
              onEn={(v) => ubah((d) => { d.testimonials[i].roleEn = v })}
            />
            <Dwi
              label="Kutipan"
              baris={5}
              id={x.quote}
              en={x.quoteEn}
              onId={(v) => ubah((d) => { d.testimonials[i].quote = v })}
              onEn={(v) => ubah((d) => { d.testimonials[i].quoteEn = v })}
            />
            <div className="a-tiga">
              <Dwi
                label="Label layanan"
                id={x.service}
                en={x.serviceEn}
                onId={(v) => ubah((d) => { d.testimonials[i].service = v })}
                onEn={(v) => ubah((d) => { d.testimonials[i].serviceEn = v })}
              />
              <Warna
                label="Warna label"
                value={x.color}
                onChange={(v) => ubah((d) => { d.testimonials[i].color = v })}
              />
              <label className="a-field">
                <span className="a-label">Bintang</span>
                <select
                  value={String(x.rating)}
                  onChange={(e) => ubah((d) => { d.testimonials[i].rating = Number(e.target.value) })}
                >
                  {['5', '4.5', '4', '3.5', '3'].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </label>
            </div>
          </Baris>
        ))}
        <TambahBaris
          label="Tambah testimoni"
          onClick={() =>
            ubah((d) => {
              const baru: Testimonial = {
                service: 'Web Design',
                serviceEn: '',
                color: '#4f8bff',
                name: 'Nama Klien',
                role: '',
                roleEn: '',
                location: '',
                quote: '',
                quoteEn: '',
                rating: 5,
              }
              d.testimonials.push(baru)
            })
          }
        />
      </section>
    </>
  )
}

/* ── Kontak ───────────────────────────────────────────────────────── */
function TabKontak({ c, ubah }: Props) {
  const wa = c.contact.whatsapp.replace(/[^0-9]/g, '')
  const tg = c.contact.telegram.trim().replace(/^@/, '')
  return (
    <>
      <section className="a-kotak">
        <h2>Nomor</h2>
        <Teks
          label="WhatsApp"
          value={c.contact.whatsapp}
          onChange={(v) => ubah((d) => { d.contact.whatsapp = v })}
          petunjuk="kode negara tanpa tanda +, mis. 62859191749378"
        />
        <p className="a-catatan">
          Tautan jadi: <code>https://wa.me/{wa || '…'}</code>
        </p>
        <Teks
          label="Telegram"
          value={c.contact.telegram}
          onChange={(v) => ubah((d) => { d.contact.telegram = v })}
          petunjuk="nomor (+62…) atau username"
        />
        <p className="a-catatan">
          Tautan jadi: <code>https://t.me/{tg || '…'}</code>
        </p>
      </section>

      <section className="a-kotak">
        <h2>Teks section</h2>
        <Dwi
          label="Label kecil"
          id={c.text.id.contact.label}
          en={c.text.en.contact.label}
          onId={(v) => ubah((d) => { d.text.id.contact.label = v })}
          onEn={(v) => ubah((d) => { d.text.en.contact.label = v })}
        />
        <Dwi
          label="Judul baris 1"
          id={c.text.id.contact.titleLine1}
          en={c.text.en.contact.titleLine1}
          onId={(v) => ubah((d) => { d.text.id.contact.titleLine1 = v })}
          onEn={(v) => ubah((d) => { d.text.en.contact.titleLine1 = v })}
        />
        <Dwi
          label="Judul baris 2"
          id={c.text.id.contact.titleLine2}
          en={c.text.en.contact.titleLine2}
          onId={(v) => ubah((d) => { d.text.id.contact.titleLine2 = v })}
          onEn={(v) => ubah((d) => { d.text.en.contact.titleLine2 = v })}
        />
        <Dwi
          label="Paragraf"
          baris={3}
          id={c.text.id.contact.sub}
          en={c.text.en.contact.sub}
          onId={(v) => ubah((d) => { d.text.id.contact.sub = v })}
          onEn={(v) => ubah((d) => { d.text.en.contact.sub = v })}
        />
        <Dwi
          label="Jam buka"
          id={c.text.id.contact.availability}
          en={c.text.en.contact.availability}
          onId={(v) => ubah((d) => { d.text.id.contact.availability = v })}
          onEn={(v) => ubah((d) => { d.text.en.contact.availability = v })}
        />
      </section>
    </>
  )
}

/* ── Bantu ────────────────────────────────────────────────────────── */
function Pratinjau({ url }: { url: string }) {
  if (!url.trim()) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="a-pratinjau" src={url} alt="" loading="lazy" />
}

function Ikon({
  value,
  onChange,
  warna,
}: {
  value: string
  onChange: (v: string) => void
  warna?: string
}) {
  return (
    <label className="a-field">
      <span className="a-label">
        Ikon <em>kelas Font Awesome</em>
      </span>
      <span className="a-ikon-row">
        <i className={value} style={{ color: warna }} aria-hidden="true" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      </span>
    </label>
  )
}

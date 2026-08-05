'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n'
import GooeyNav from './GooeyNav'

export default function Navbar() {
  const { t, lang, setLang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Load saved theme on mount
  useEffect(() => {
    const saved = (localStorage.getItem('mf-theme') as 'dark' | 'light') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  // Scroll listener — ambang bawah/atas dibedakan (histeresis) supaya pill
  // tidak berkedip bolak-balik saat scroll berhenti tepat di titik ambang.
  useEffect(() => {
    let frame = 0
    const handleScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        setScrolled((prev) => (prev ? y > 8 : y > 28))
      })
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('mf-theme', next)
  }

  const closeNav = () => setMenuOpen(false)

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <a href="#beranda" className="nav-logo">
            {/* Tinggi diatur lewat .nav-logo img di globals.css supaya bisa
                mengecil saat navbar berubah jadi pill — kalau ditulis inline,
                style-nya mengalahkan CSS dan logo tidak ikut menyusut. */}
            <Image
              src="https://res.cloudinary.com/dlzihbwqt/image/upload/v1777537735/whitebox-logo_1_qemvpq.png"
              alt="Whitebox Logo"
              width={58}
              height={58}
              style={{ width: 'auto', objectFit: 'contain' }}
            />
            <div className="nav-logo-text">
              Whitebox<span>.asia</span>
            </div>
          </a>

          <div className="nav-right">
            {/* Tombol CTA sengaja di luar daftar gooey: pil penandanya menandai
                "kamu sedang di bagian ini", sedangkan CTA adalah ajakan, bukan
                bagian halaman yang bisa sedang dibuka. */}
            <GooeyNav
              item={[
                { label: t.nav.home, href: '#beranda' },
                { label: t.nav.services, href: '#layanan' },
                { label: t.nav.portfolio, href: '#portofolio' },
                { label: t.nav.pricing, href: '#harga' },
                { label: t.nav.testimonials, href: '#testimoni' },
              ]}
              cta={<a href="#kontak" className="nav-cta">{t.nav.cta}</a>}
              akhir="#kontak"
            />

            <div className="lang-switch" role="group" aria-label="Language / Bahasa">
              <button
                className={lang === 'id' ? 'active' : ''}
                onClick={() => setLang('id')}
                aria-pressed={lang === 'id'}
              >
                ID
              </button>
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
            </div>

            <button
              className="theme-toggle"
              aria-label="Toggle Theme"
              onClick={toggleTheme}
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
            </button>

            <button
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`}>
        <a href="#beranda" onClick={closeNav}>{t.nav.home}</a>
        <a href="#layanan" onClick={closeNav}>{t.nav.services}</a>
        <a href="#portofolio" onClick={closeNav}>{t.nav.portfolio}</a>
        <a href="#harga" onClick={closeNav}>{t.nav.pricing}</a>
        <a href="#testimoni" onClick={closeNav}>{t.nav.testimonials}</a>
        <a href="#kontak" onClick={closeNav}>{t.nav.contact}</a>

        {/* Penukar bahasa khusus mobile (di navbar disembunyikan agar tidak sesak) */}
        <div className="lang-switch mobile-lang" role="group" aria-label="Language / Bahasa">
          <button
            className={lang === 'id' ? 'active' : ''}
            onClick={() => setLang('id')}
            aria-pressed={lang === 'id'}
          >
            ID
          </button>
          <button
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
        </div>
      </div>
    </>
  )
}

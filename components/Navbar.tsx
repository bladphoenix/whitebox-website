'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Load saved theme on mount
  useEffect(() => {
    const saved = (localStorage.getItem('mf-theme') as 'dark' | 'light') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
            <Image
              src="https://res.cloudinary.com/dlzihbwqt/image/upload/v1777537735/whitebox-logo_1_qemvpq.png"
              alt="Whitebox Logo"
              width={58}
              height={58}
              style={{ maxHeight: 58, width: 'auto', objectFit: 'contain' }}
            />
            <div className="nav-logo-text">
              Whitebox<span>.asia</span>
            </div>
          </a>

          <div className="nav-right">
            <ul className="nav-links">
              <li><a href="#beranda">Beranda</a></li>
              <li><a href="#layanan">Layanan</a></li>
              <li><a href="#portofolio">Portofolio</a></li>
              <li><a href="#harga">Harga</a></li>
              <li><a href="#kontak" className="nav-cta">Hubungi Saya</a></li>
            </ul>

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
        <a href="#beranda" onClick={closeNav}>Beranda</a>
        <a href="#layanan" onClick={closeNav}>Layanan</a>
        <a href="#portofolio" onClick={closeNav}>Portofolio</a>
        <a href="#harga" onClick={closeNav}>Harga</a>
        <a href="#kontak" onClick={closeNav}>Kontak</a>
      </div>
    </>
  )
}

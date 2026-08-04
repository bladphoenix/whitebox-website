'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { dwi, type Content, type SectionText } from './content'

export type Lang = 'id' | 'en'

type Ctx = {
  lang: Lang
  isEn: boolean
  setLang: (l: Lang) => void
  toggle: () => void
  /** teks section untuk bahasa yang sedang aktif */
  t: SectionText
  /** seluruh isi situs, apa adanya dari data/content.json */
  content: Content
  /** pilih teks id/en, jatuh ke id kalau versi en dikosongkan di panel */
  p: (id: string, en?: string) => string
}

const LanguageContext = createContext<Ctx | null>(null)

/* `content` dialirkan dari app/layout.tsx yang membacanya di sisi server.
   Isi situs tidak lagi ditulis di dalam berkas komponen — semuanya datang
   dari data/content.json yang disunting lewat /admin. */
export function LanguageProvider({
  content,
  children,
}: {
  content: Content
  children: React.ReactNode
}) {
  const [lang, setLangState] = useState<Lang>('id')

  useEffect(() => {
    const saved = localStorage.getItem('mf-lang') as Lang | null
    if (saved === 'id' || saved === 'en') {
      setLangState(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('mf-lang', l)
    document.documentElement.lang = l
  }

  const toggle = () => setLang(lang === 'id' ? 'en' : 'id')

  const isEn = lang === 'en'
  const t = content.text[lang]
  const p = (id: string, en?: string) => dwi(isEn, id, en)

  return (
    <LanguageContext.Provider value={{ lang, isEn, setLang, toggle, t, content, p }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

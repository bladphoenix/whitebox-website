import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n'
import { readContent } from '@/lib/content-store'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Whitebox.asia | Web Developer & Server Expert',
  description:
    'Spesialis yang fokus pada performa web, optimasi SEO, dan manajemen infrastruktur cloud yang aman dan skalabel.',
  icons: { icon: '/developer.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Dibaca di server tiap kali halaman dibangun ulang. Halaman utama memakai
  // ISR (lihat app/page.tsx) dan panel admin memanggil revalidatePath setiap
  // menyimpan, jadi perubahan langsung terlihat tanpa build ulang.
  const content = readContent()

  return (
    <html lang="id" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <LanguageProvider content={content}>{children}</LanguageProvider>
      </body>
    </html>
  )
}

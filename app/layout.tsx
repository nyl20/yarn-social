import './globals.css'
import SessionLayout from '@/components/SessionLayout'
import Navbar from '@/components/Navbar'

import { Playfair_Display, Nunito } from 'next/font/google'
const titleFont = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-title' })
const bodyFont = Nunito({ subsets: ['latin'], variable: '--font-body' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${titleFont.variable} ${bodyFont.variable}`} >
      <body className="font-body text-[#333]">
        <SessionLayout>
          <Navbar />
          <main className="p-6">{children}</main>
        </SessionLayout>
      </body>
    </html>
  )
}

import './globals.css'
import SessionLayout from '@/components/SessionLayout'
import Navbar from '@/components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F9E6D1]">
        <SessionLayout>
          <Navbar />
          <main className="p-6">{children}</main>
        </SessionLayout>
      </body>
    </html>
  )
}

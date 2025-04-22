import './globals.css'
import SessionLayout from '@/components/SessionLayout'
import Navbar from '@/components/Navbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionLayout>
          <Navbar />
          <main className="p-6">{children}</main>
        </SessionLayout>
      </body>
    </html>
  )
}

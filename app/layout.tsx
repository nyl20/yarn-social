// app/layout.tsx
import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-between items-center px-6 py-4 bg-gray-100">
          <Link href="/" className="text-xl font-bold">MyApp</Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline">Sign In</Link>
            <Link href="/auth/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}

'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">MyApp</Link>
      <div className="flex gap-4 items-center">
        {!session?.user ? (
          <>
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline">Sign In</Link>
            <Link href="/auth/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
          </>
        ) : (
          <button
            onClick={() => signOut()}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

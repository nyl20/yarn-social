'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-[#F9E6D1] flex justify-between items-center px-6 py-4">
      <Link href="/" className="text-xl font-bold">Crochet & Chill</Link>
      <div className="flex gap-4 items-center">
        {!session?.user ? (
          <>
            <Link href="/auth/sign-in" className="hover:underline">Sign In</Link>
            <Link href="/auth/sign-up" className="bg-white px-4 py-2 rounded hover:underline">Sign Up</Link>
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

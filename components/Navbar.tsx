'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-white shadow-sm font-sans">
      <div className="flex items-center gap-6 text-[#333] font-bold">
        <span className="text-2xl">🧶</span>
        <Link href="/" className="hover:text-[#4497B7] transition">Home</Link>
        <Link href="/posts" className="hover:text-[#4497B7] transition">Posts</Link>
        {session?.user && (
          <Link href="/profile" className="hover:text-[#4497B7] transition">Profile</Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {!session?.user ? (
          <>
            <Link href="/auth/sign-in" className="text-[#4497B7] hover:underline">Sign In</Link>
            <Link href="/auth/sign-up" className="bg-[#4497B7] text-white px-4 py-2 rounded hover:bg-black">Sign Up</Link>
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

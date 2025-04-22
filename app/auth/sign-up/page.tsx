'use client'

import { useState } from 'react'

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'individual',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) setSuccess(true)
    else setError('Sign up failed')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full border p-2"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full border p-2"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <select
        className="w-full border p-2"
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="individual">Individual</option>
        <option value="shop">Shop</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
        Sign Up
      </button>
      {success && <p className="text-green-600">Signed up successfully! ✅</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  )
}

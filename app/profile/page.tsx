'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    tag: '',
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setForm(prev => ({ ...prev, image: base64String }))
      setPreview(base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create post')
      return
    }

    setSuccess(true)
    setForm({ title: '', description: '', category: '', image: '', tag: '' })
    setPreview(null)
    setTimeout(() => {
      setSuccess(false)
      setShowModal(false)
      router.refresh()
    }, 2000)
  }

  return (
    <div className="mx-20 my-5 space-y-6 flex justify-between items-center">
      <h1 className="text-3xl font-semibold">
        Welcome, {session?.user?.name}
      </h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-[#4497B7] text-white px-4 py-2 rounded hover:bg-[#417e96]"
      >
        + Create A New Post
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
            <h2 className="my-4 text-xl">Create a New Post</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" required />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded h-24" />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select a category</option>
                <option value="Pattern">Pattern</option>
                <option value="Shop">Shop</option>
              </select>

              <select
                name="tag"
                value={form.tag}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select a tag</option>
                <option value="Decorations">Decorations</option>
                <option value="Clothes">Clothes</option>
                <option value="Toys">Toys</option>
              </select>
              <div className = "my-2">
                {/* Customize the image upload button */}
              <label
                htmlFor="imageUpload"
                className="w-full border border-black text-black px-2 py-2 rounded"
              >
                Upload Image
              </label>

              {/* Hide the original image upload button */}
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-50 h-50 rounded"
                />
              )}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm text-center">Post created!</p>
              )}

              <button type="submit" className="my-4 bg-[#4497B7] text-white px-4 py-2 rounded hover:bg-[#417e96] w-full">
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

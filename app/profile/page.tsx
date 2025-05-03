'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PostCardProfile from '@/components/PostCardProfile'
import { Pencil } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showEdit, setShowEdit] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    tag: '',
  })

  type Post = {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    tag: string[];
    updatedAt: Date;
    userName: string;
  };

  type Profile = {
    id: string;
    username: string;
    bio: string;
    completed: boolean;
    image: string;
    type: string;
    url: string;
  }

  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    url: '',
    image: '',
    type: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxImageSizeMB = 2.5
    const maxImageSizeBytes = maxImageSizeMB * 1024 * 1024

    setError('')

    if (file.size > maxImageSizeBytes) {
      setError(`Image size too large. Maximum size is ${maxImageSizeMB} MB.`)
      return
    }

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

  const fetchProfile = async () => {
    if (!session?.user?.id) return

    const res = await fetch(`/api/profiles?userId=${session.user.id}`)
    const data = await res.json()

    if (res.ok) {
      console.log('setting profile data')
      setProfile(data)
    } else {
      console.error(data.error || 'Failed to fetch posts')
    }
  }

  const fetchPosts = async () => {
    if (!session?.user?.id) return

    const res = await fetch(`/api/posts/user/${session.user.id}`)
    const data = await res.json()

    if (res.ok) {
      setPosts(data.posts)
    } else {
      console.error(data.error || 'Failed to fetch posts')
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchProfile()
    console.log(profile)
  }, [session])

  useEffect(() => {
    if (profile) {
      setEditForm({
        username: profile.username || '',
        bio: profile.bio || '',
        url: profile.url || '',
        image: profile.image || '',
        type: profile.type || '',
      });
    }
  }, [profile]);  

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEditForm(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleProfileEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveProfileChanges = async () => {
    if (!session?.user?.id) return;
  
    const res = await fetch('/api/profiles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, userId: session.user.id }),
    });
  
    if (res.ok) {
      setShowEdit(false);
      await fetchProfile();
    } else {
      alert('Failed to update profile');
    }
  };
  
  
  const handlePostDelete = (deletedPostId: string) => {
    // Update posts state to remove the deleted post
    setPosts(currentPosts => currentPosts.filter(post => post.id !== deletedPostId))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tag: form.tag ? [form.tag.trim()] : [],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create post')
      return
    }

    setSuccess(true)
    setForm({ title: '', description: '', category: '', image: '', tag: '' })
    setPreview(null)
    await fetchPosts()
    setTimeout(() => {
      setSuccess(false)
      setShowModal(false)
      router.refresh()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#4497B7] pb-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-5 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-white">
            Welcome, {session?.user?.name}
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="text-black font-semibold border-2 rounded-full px-4 py-2 bg-white shadow cursor-pointer"
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
                  <div className="my-2">
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

                  {!error && preview && (
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

        {/* User Profile Card with Dummy Data */}
        <div className="flex flex-col items-center text-center space-y-4 my-10 relative text-white">
          {/* Profile Image */}
          <img
            src={profile?.image || "/images/default_profile.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />

          {/* Username */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{profile?.username || session?.user?.name}</h2>

          {/* Identity badge (Show one of them*/}
          {
            profile?.type === 'shop' ? (
              <div className="flex items-center gap-2 text-sm font-medium bg-white text-[#4497B7] px-3 py-1 border-black border-2 rounded-full shadow-md">
                🏪 Shop
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium bg-white text-[#4497B7] px-3 py-1 border-black border-2 rounded-full shadow-md">
                🧵 Individual Crafter
              </div>
            )
          }

          {/* Bio */}
          <p className="text-sm sm:text-base text-gray-200 max-w-md">
            <span className="font-semibold text-white">Bio:</span> {profile?.bio || 'No bio written yet'}
          </p>

          {/* Website */}
          <a
            href={profile?.url || ''}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[F9E6D1] hover:text-cyan-300 text-sm underline"
          >
            {profile?.url || ''}
          </a>

          {/* Edit Button */}
          <div className="absolute top-0 right-0 sm:right-8">
            <button
              onClick={() => setShowEdit(prev => !prev)}
              className="p-2 hover:bg-white/10 rounded-full border-2 cursor-pointer"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>

            {showEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded shadow-lg relative">
                <button
                  onClick={() => setShowEdit(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                  ×
                </button>
                <h2 className="my-4 text-xl text-left text-black">Edit Your Profile</h2>
                
                <div className="space-y-4 text-left text-black">
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                name="username"
                value={editForm.username}
                onChange={handleProfileEditChange}
                placeholder="Enter your name"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Bio</label>
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleProfileEditChange}
                placeholder="Tell us about yourself"
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Website URL</label>
              <input
                name="url"
                value={editForm.url}
                onChange={handleProfileEditChange}
                placeholder="https://example.com"
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Account Type</label>
              <select
                name="type"
                value={editForm.type}
                onChange={handleProfileEditChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select type</option>
                <option value="individual">Individual</option>
                <option value="shop">Shop</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Profile Image</label>
              {editForm.image && (
                <img
                  src={editForm.image}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border mx-auto mt-4"
                />
              )}
              <br />
              <label
                htmlFor="profileImageUpload"
                className="w-full border border-black text-black px-2 py-2 rounded cursor-pointer block text-center"
              >
                Upload Profile Image
              </label>
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </div>

            <button
              onClick={saveProfileChanges}
              className="w-full bg-[#4497B7] text-white py-2 rounded hover:bg-[#417e96]"
            >
              Save Changes
            </button>
          </div>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-semibold py-5 text-white">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-white">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
              {posts.map(post => (
                <PostCardProfile
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  description={post.description || ''}
                  author={post.userName || ''}
                  date={post.updatedAt}
                  tags={post.tag || []}
                  image={post.image || ''}
                  onDelete={handlePostDelete}
                />
              ))}
            </div>)}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'

export default function PostPage() {
  const router = useRouter()

  const post = {
    id: '1',
    title: 'Crochet Teddy Bear',
    description:
      'In a cozy corner of a sunlit nursery sat a pink crochet teddy bear, its soft yarn body slightly lopsided but full of charm. With tiny black button eyes and a heart-shaped nose stitched in darker pink, it radiated warmth and whimsy. Each loop and stitch told a story of patience and love, crafted by gentle hands during quiet evenings. A small flower was tucked behind one ear, and its plump arms were forever open for hugs. Though it couldn’t speak, the teddy bear held a comforting magic, as if it whispered, “I’m here for you,” to anyone who held it close.',
    author: 'Tom Yarn',
    date: 'Apr 10, 2025',
    tags: ['pattern', 'toys'],
    image: '/images/teddy.jpg',
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold mb-2">{post.title}</h1>
        <button onClick={() => router.back()} className="bg-[#4497B7] text-white px-4 py-2 rounded shadow hover:opacity-90 mb-6">
          ← Back
        </button>
      </div>
      
      <p className="text-gray-400 mb-4">
        by <span className="text-white">{post.author}</span> · {post.date}
      </p>

      <div className="text-gray-300 mb-6 leading-relaxed">
        {post.description}
      </div>

      <div className="w-full max-w-2xl mx-auto mb-6">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-lg"
        />
      </div>


      <div className="mb-4 flex flex-wrap gap-2">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-cyan-900 text-cyan-200 text-xs px-3 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

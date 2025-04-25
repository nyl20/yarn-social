'use client'

import { useState } from 'react'
import PostCard from '@/components/PostCard'

// static data for patterns
const patterns = [
  { title: 'Cozy Winter Beanie', description: 'A warm beanie for chilly days.', author: 'Jane Doe', date: 'Apr 15, 2025', tags: ['pattern', 'clothes'], image: '/images/beanie.jpg', popularity: 20 },
  { title: 'Crochet Teddy Bear', description: 'Perfect for gifting little ones.', author: 'Tom Yarn', date: 'Apr 10, 2025', tags: ['pattern', 'toys'], image: '/images/teddy.jpg', popularity: 50 },
]

// static data for shops
const shops = [
  { title: 'Yarny Delights', description: 'Find colorful, soft yarns.', author: 'Yarn Boutique', date: 'Apr 5, 2025', tags: ['shop', 'decoration'], image: '/images/shop1.webp', popularity: 15 },
  { title: 'The Crochet Cave', description: 'Are you obsessive-compulsive? Then this is your paradise. We have everything you can think of.', author: 'YY', date: 'Apr 3, 2025', tags: ['shop'], image: '/images/shop2.webp', popularity: 35 },
]

const dummyPosts = Array(20).fill({
  image: '/images/teddy.jpg',
  title: 'Post Title',
  description: 'Sample text blablabla some random text to make it long. ',
  author: 'Jane Doe',
  date: 'Apr 20, 2025',
  tags: ['pattern', 'toys'],
})

const allPosts = [...patterns, ...shops, ...dummyPosts]


// Posts page
export default function Posts() {
  const [category, setCategory] = useState('All')
  const [style, setStyle] = useState('All')
  const [sortBy, setSortBy] = useState('Latest') // can change to Popular if we decide to use this feature
  const [search, setSearch] = useState('')

  const filteredPosts = allPosts
    .filter(post => {
      const matchesCategory = category === 'All' || post.tags.includes(category.toLowerCase())
      const matchesStyle = style === 'All' || post.tags.includes(style.toLowerCase())
      const matchesSearch =
        search === '' ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesStyle && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'Latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === 'Popular') {
        return (b.popularity || 0) - (a.popularity || 0)
      } else if (sortBy === 'Oldest'){
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-[#4497B7] pb-10">
      <div className="flex flex-wrap gap-4 px-6 py-6 items-center justify-start">
        <select
          className="border-2 rounded px-4 py-2 bg-white shadow"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">Category</option>
          <option value="pattern">Pattern</option>
          <option value="shop">Shop</option>
        </select>

        <select
          className="border-2 rounded px-4 py-2 bg-white shadow"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="All">Style</option>
          <option value="clothes">Clothes</option>
          <option value="toys">Toys</option>
          <option value="decoration">Decoration</option>
        </select>

        <select
          className="border-2 rounded px-4 py-2 bg-white shadow"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Latest">Sort by...</option>
          <option value="Popular">Popular</option>
          <option value="Latest">Latest</option>
          <option value='Oldest'>Oldest</option>
        </select>

        <input
          type="text"
          className="border-2 rounded px-3 py-2 ml-auto shadow bg-white"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
        {filteredPosts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  )
}

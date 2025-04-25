'use client'

import Image from 'next/image'
import PostCard from '@/components/PostCard'

// static data for patterns
const patterns = [
  { title: 'Cozy Winter Beanie', description: 'A warm beanie for chilly days.', author: 'Jane Doe', date: 'Apr 15, 2025', tags: ['pattern', 'clothes'], image: '/images/beanie.jpg' },
  { title: 'Crochet Teddy Bear', description: 'Perfect for gifting little ones.', author: 'Tom Yarn', date: 'Apr 10, 2025', tags: ['pattern', 'toy'], image: '/images/teddy.jpg' },
]

// static data for shops
const shops = [
  { title: 'Yarny Delights', description: 'Find colorful, soft yarns.', author: 'Yarn Boutique', date: 'Apr 5, 2025', tags: ['shop', 'decoration'], image: '/images/shop1.webp' },
  { title: 'The Crochet Cave', description: 'Are you obsessive-compulsive? Then this is your paradise. We have everything you can think of.', author: 'YY', date: 'Apr 3, 2025', tags: ['shop'], image: '/images/shop2.webp' },
]


export default function LandingPage() {
  return (
    <div>
      {/* Cover Section */}
      <div className="relative h-[90vh] w-full">
        <Image src="/images/cover.jpg" alt="Crochet Cover" fill className="object-cover"/>
        <div className="absolute inset-0 bg-black opacity-60" />
        <div className="absolute inset-0 flex items-center justify-start">
          <h1 className="text-white text-6xl font-title font-bold text-left px-10 animate-fadeIn leading-tight">
            STITCH STORIES TOGETHER<br />
            <span className="text-4xl">Share & Discover Crochet Wonders</span>
          </h1>
        </div>
      </div>

      {/* Patterns Section */}
      <section className="px-0 py-10">
        <h2 className="text-3xl font-title font-bold mb-4 px-6">PATTERNS</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6">
          {patterns.map((post, idx) => (
            <PostCard key={idx} {...post} />
          ))}
        </div>
      </section>

      {/* Shops Section */}
      <section className="px-0 py-10">
        <h2 className="text-3xl font-title font-bold mb-4 px-6">SHOPS</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 px-6">
          {shops.map((post, idx) => (
            <PostCard key={idx} {...post} />
          ))}
        </div>
      </section>
    </div>
  )
}

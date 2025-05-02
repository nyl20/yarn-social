'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

type Props = {
  id: string
  title: string
  description: string
  author: string
  date: Date
  tags: string[]
  image: string
  onDelete?: () => void
}

export default function PostCardProfile({
  id,
  title,
  description,
  author,
  date,
  tags,
  image,
  onDelete
}: Props) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative flex flex-row w-full bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition max-w-5xl mx-auto">
      <div className="relative w-[100px] sm:w-[140px] md:w-[180px] h-auto aspect-[4/3] sm:aspect-[5/4] md:aspect-[4/3] flex-shrink-0">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <Link
        href={`/${id}`}
        className="flex flex-col justify-between px-4 py-3 sm:p-6 text-left flex-1 cursor-pointer"
      >
        <div>
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-gray-900">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 line-clamp-2">{description}</p>
          <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
            {author} • {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>


      <div className="absolute top-2 right-2 z-40">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <MoreHorizontal className="text-gray-500" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 bg-white border-2 rounded shadow-lg z-50">
            <button
              onClick={() => {
                setShowMenu(false)
                onDelete?.()
              }}
              className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

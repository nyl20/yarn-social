'use client'

import Image from 'next/image'
import Link from 'next/link'

type Props = {
  id: string
  title: string
  description: string
  author: string
  date: Date
  tags: string[]
  image: string
}
export default function PostCard({ id, title, description, author, date, tags, image }: Props) {
  return (
    <Link href={`/posts/${id}`} className="block cursor-pointer">
      <div className="w-[300px] h-[300px] bg-white shadow rounded-xl overflow-hidden flex flex-col">
        <div className="relative w-full h-[250px]">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between text-left">
          <div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-700 mb-2 line-clamp-1">{description}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">
              {author} • {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            {/* <p className="text-xs text-gray-500 mb-2">
                {author} • {date}
              </p> */}
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag, i) => (
                <span key={i} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

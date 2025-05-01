import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
import { db } from '@/database/db'
// import { posts } from '@/database/schema/posts'


export async function GET() {
  try {
    const patternsData = await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts.category, 'pattern'),
      limit: 5,
      with: {
        user: {
          columns: {
            name: true,
            email: true
          }
        }
      },
      orderBy: (posts, { desc }) => [desc(posts.views)]
    })
    const shopsData = await db.query.posts.findMany({
      where: (posts, { eq }) => eq(posts.category, 'shop'),
      limit: 5,
      with: {
        user: {
          columns: {
            name: true,
            email: true
          }
        }
      },
      orderBy: (posts, { desc }) => [desc(posts.views)]
    })

    const postsData = { patterns: patternsData, shops: shopsData }

    return NextResponse.json(postsData)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
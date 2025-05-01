import { db } from '@/database/db'
import { posts } from '@/database/schema/posts'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // const url = new URL(req.url);
    // const pathParts = url.pathname.split('/');
    // const userId = pathParts[pathParts.length - 1];

    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        image: posts.image,
        category: posts.category,
        tag: posts.tag,
        updatedAt: posts.updatedAt,
        userName: users.name,
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, params.id))

    return NextResponse.json(post)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
} 
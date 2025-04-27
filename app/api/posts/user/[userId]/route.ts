import { db } from '@/database/db'
import { posts } from '@/database/schema/posts'
import { users } from "@/database/schema/auth"
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  try {
    const userPosts = await db
    .select({
        id: posts.id,
        title: posts.title,
        description: posts.description,
        image: posts.image,
        category: posts.category,
        tag: posts.tag,
        updatedAt: posts.updatedAt,
        userName: users.name,})
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.userId, context.params.userId))

    return NextResponse.json({ posts: userPosts })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

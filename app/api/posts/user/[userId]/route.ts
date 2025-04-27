import { db } from '@/database/db'
import { posts } from '@/database/schema/posts'
import { users } from "@/database/schema/auth"
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];

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
      .where(eq(posts.userId, userId))

    return NextResponse.json({ posts: userPosts })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

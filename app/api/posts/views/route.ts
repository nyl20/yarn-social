import { db } from "@/database/db"
import { posts } from "@/database/schema/posts"
import { eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("API route hit")
  try {
    const { postId } = await request.json()
    console.log("Updating views for post:", postId)

    await db.update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, postId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating views:", error)
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 })
  }
}
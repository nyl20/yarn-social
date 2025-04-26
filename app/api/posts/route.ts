import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { db } from '@/database/db'
import { posts } from '@/database/schema/posts'
import { insertPostSchema } from '@/database/schema/posts'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const parseResult = insertPostSchema.safeParse({
    ...body,
    userId: session.user.id,
  })

  if (!parseResult.success) {
    return NextResponse.json(
      { error: parseResult.error.errors[0]?.message || 'Validation failed' },
      { status: 400 }
    )
  }

  const postData = {
    ...parseResult.data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(posts).values(postData)

  return NextResponse.json({ success: true })
}

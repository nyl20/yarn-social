import { db } from '@/database/db'
import { users, accounts } from '@/database/schema'
import { v4 as uuidv4 } from 'uuid'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password, name, role } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const hashedPassword = await hash(password, 10)
  const userId = uuidv4()
  const now = new Date()

  await db.insert(users).values({
    id: userId,
    name,
    email,
    emailVerified: false,
    image: null,
    createdAt: now,
    updatedAt: now,
    role: role || 'individual',
    banned: false,
    banReason: null,
    banExpires: null,
  })

  await db.insert(accounts).values({
    id: uuidv4(),
    accountId: email,
    providerId: 'credentials',
    userId: userId,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  })

  return NextResponse.json({ success: true })
}

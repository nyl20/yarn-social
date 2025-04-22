import { db } from '@/database/db'
import { users, accounts } from '@/database/schema'
import { v4 as uuidv4 } from 'uuid'
import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
    try {
      const { email, password, name, role } = await req.json()
  
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 })
      }
  
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
  
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
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
        userId,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      })
  
      return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
      console.error(error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
  

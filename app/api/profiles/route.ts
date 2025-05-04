import { db } from '@/database/db'
import { profiles } from '@/database/schema/profiles'
import { users } from '@/database/schema/auth'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      with: {
        user: {
          columns: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, username, bio, url, image, type } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await db
      .update(profiles)
      .set({
        username,
        bio,
        url,
        image,
        type,
        updatedAt: new Date(),
        completed: true,
      })
      .where(eq(profiles.userId, userId));

    await db
      .update(users)
      .set({
        role: type,
        name: username,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
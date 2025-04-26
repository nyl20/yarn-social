import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/database/db'
import * as schema from '@/database/schema'
import { eq } from 'drizzle-orm'
import { compare } from 'bcryptjs'
import { JWT } from 'next-auth/jwt'
import { Session, User } from 'next-auth'

export const authOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt' as const,
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials!

        const [user] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))

        if (!user) return null

        const [account] = await db
          .select()
          .from(schema.accounts)
          .where(eq(schema.accounts.userId, user.id))

        if (!account || !account.password) return null

        const isValid = await compare(password, account.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          banned: user.banned ?? undefined,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role || null,
          banned: user.banned || false
        }
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.banned = token.banned
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  secret: process.env.NEXT_AUTH_SECRET,
}

const handler = NextAuth(authOptions)

export const GET = handler
export const POST = handler


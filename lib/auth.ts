import CredentialsProvider from 'next-auth/providers/credentials'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/database/db'
import * as schema from '@/database/schema'
import { eq } from 'drizzle-orm'
import { compare } from 'bcryptjs'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'
import { User } from 'next-auth'
import { AuthOptions } from 'next-auth'


export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: 'jwt',
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
        token.id = user.id
        token.role = user.role
        token.banned = user.banned
      }
      return token
    },
    async session({ session, token }: { token: JWT; session: Session }) {
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
  secret: process.env.NEXTAUTH_SECRET,
}
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: string | null
      banned?: boolean
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role?: string | null
    banned?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role?: string | null
    banned?: boolean
  }
}

import NextAuth, { DefaultSession } from "next-auth"
import { Role } from "./index"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: Role
            approved: boolean
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: Role
        approved: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: Role
        approved: boolean
    }
}

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credenciales",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await db.getUserByEmail(credentials.email);

                // NOTA: En producción, usar bcrypt para verificar hash.
                // Para DEMO, aceptamos cualquier contraseña si el usuario existe.
                // Opcional: Hardcodear passwords simples.

                if (!user) return null;

                // Verificación de password (demo - texto plano como pidió el usuario)
                if (user.password !== credentials.password) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    approved: user.approved
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.approved = user.approved;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.approved = token.approved;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login', // Página custom de login
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET || "secreto-super-seguro-dev"
}

import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const adminEmail = process.env.AUTH_EMAIL || "admin@admin.com";
const adminPassword = process.env.AUTH_PASSWORD || "12345";
const adminName = process.env.AUTH_NAME || "CRM Admin";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "crm-admin",
            email: adminEmail,
            name: adminName,
          };
        }

        return null;
      },
    }),
  ],
};

export function auth() {
  return getServerSession(authOptions);
}

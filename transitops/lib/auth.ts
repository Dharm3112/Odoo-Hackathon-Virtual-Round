/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { recordFailedAttempt, clearFailedAttempts, checkLockout } from "@/lib/lockout";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour default
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@transitops.in" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Check if account is locked
        const lockout = await checkLockout(credentials.email);
        if (lockout.locked) {
          const minsLeft = Math.ceil((lockout.lockedUntil!.getTime() - Date.now()) / 60000);
          throw new Error(`Account locked. Try again in ${minsLeft} minutes.`);
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true },
        });

        if (!user || !user.isActive) {
          await recordFailedAttempt(credentials.email);
          throw new Error("Invalid email or password");
        }

        // Verify role matches if provided
        if (credentials.role && user.role.name !== credentials.role) {
          await recordFailedAttempt(credentials.email);
          throw new Error("Invalid role for this user");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          await recordFailedAttempt(credentials.email);
          throw new Error("Invalid email or password");
        }

        // Clear failed attempts on successful login
        await clearFailedAttempts(credentials.email);

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        // Calculate session maxAge based on rememberMe
        const rememberMe = credentials.rememberMe === "true";
        const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60; // 7 days or 1 hour

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role.name,
          roleId: user.roleId,
          permissions: user.role.permissions,
          rememberMe,
          maxAge,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.role = u.role;
        token.roleId = u.roleId;
        token.permissions = u.permissions;
        token.rememberMe = u.rememberMe;
        token.maxAge = u.maxAge;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sUser = session.user as any;
        sUser.id = token.id;
        sUser.role = token.role;
        sUser.roleId = token.roleId;
        sUser.permissions = token.permissions;
        sUser.rememberMe = token.rememberMe;
        sUser.maxAge = token.maxAge;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
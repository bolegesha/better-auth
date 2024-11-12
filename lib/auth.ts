// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is not set");
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  secret: process.env.AUTH_SECRET,
  cookie: {
    name: 'better-auth.session_token',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }
});
import { env } from "@/env";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import { LRUCache } from "lru-cache";
import { InvalidCredentialsError, TooManyAttemptsError, ValidationError } from "./authErrors";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
    };
  }
}

const CredentialsSchema = z.object({
  name: z.string(),
  password: z.string(),
});

const loginAttempts = new LRUCache<string, number>({
  max: 100, // store up to 100 attempts
  ttl: 1000 * 60 * 60, // Expire after 1 hour
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = CredentialsSchema.safeParse({
          name: credentials.name,
          password: credentials.password,
        });

        if (!parsedCredentials.success) {
          throw new ValidationError();
        }

        const { name, password } = parsedCredentials.data;
        const key = `login:${name}`;

        if (loginAttempts.get(key) || 0 >= 5) {
          console.error("Too many attempts for user: ", name);
          throw new TooManyAttemptsError();
        }

        const admin = {
          name: env.ADMIN_NAME,
          password: env.ADMIN_PASSWORD,
        };

        if (admin.name === name && admin.password === password) {
          loginAttempts.delete(key); // Reset on successful login
          return admin;
        }

        loginAttempts.set(key, (loginAttempts.get(key) || 0) + 1);
        throw new InvalidCredentialsError();
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/signIn"
  }
});

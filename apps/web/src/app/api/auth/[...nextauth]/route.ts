import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ message: response.statusText }));
            throw new Error(
              errorData.error || errorData.message || "Login failed",
            );
          }

          const data = await response.json();

          if (data.success && data.data?.user) {
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              name:
                data.data.user.username ||
                `${data.data.user.firstName || ""} ${data.data.user.lastName || ""}`.trim(),
              image: data.data.user.avatar || null,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            };
          }

          throw new Error("Invalid response from server");
        } catch (error) {
          console.error("AuthContext: Login failed", {
            error: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              avatar: user.image,
            }),
          });

          if (!response.ok) {
            console.error("Failed to sync Google user with backend");
            return false;
          }

          const data = await response.json();
          if (data.success && data.data?.user) {
            user.id = data.data.user.id;
          }
        } catch (error) {
          console.error("Google signIn callback error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        if ((user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
        }
        if ((user as any).refreshToken) {
          token.refreshToken = (user as any).refreshToken;
        }
      }

      if (account?.provider === "google") {
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user?.email,
              name: user?.name,
              googleId: account.providerAccountId,
              avatar: user?.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.data?.user) {
              token.id = data.data.user.id;
              token.accessToken = data.data.accessToken;
              token.refreshToken = data.data.refreshToken;
            }
          }
        } catch (error) {
          console.error("Google jwt callback error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).accessToken = token.accessToken as string;
        (session.user as any).refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

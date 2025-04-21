import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import jwt from "jsonwebtoken";

// Extend session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    accessSecret?: string;
    supabaseAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    accessSecret?: string;
  }
}

if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing environment variables for Twitter authentication");
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY!,
      clientSecret: process.env.TWITTER_API_SECRET!,
      version: "1.0a",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      console.log("🔹 JWT Callback - Token Before:", token);
      if (token.sub) {
        token.id = token.sub; // Assign Twitter user ID
      }
      if (account) {
        token.accessToken = account.oauth_token as string;
        token.accessSecret = account.oauth_token_secret as string;
      }
      console.log("✅ JWT Callback - Token After:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("🔹 Session Callback - Token:", token);

      if (!session.user) {
        session.user = {
          id: "",
          name: null,
          email: null,
          image: null,
        };
      }
      session.user.id = token.id as string;
      session.accessToken = token.accessToken;
      session.accessSecret = token.accessSecret;

      // Generate Supabase JWT
      const signingSecret = process.env.SUPABASE_JWT_SECRET;
      if (signingSecret && token.id) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
          sub: token.id, // Twitter user ID
          email: session.user.email || null,
          role: "authenticated",
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }

      console.log("✅ Session Callback - Final Session:", session);
      return session;
    },
  },
};
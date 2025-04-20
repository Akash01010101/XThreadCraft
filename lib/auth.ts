import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

// Extend session and JWT types to include Twitter user ID
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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Twitter user ID
    accessToken?: string;
    accessSecret?: string;
  }
}

// Ensure required environment variables exist
if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing environment variables for Twitter authentication");
}

// ✅ OAuth 1.0a for Twitter
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
          image: null
        };
      }
      session.user.id = token.id as string; // Attach Twitter user ID
      session.accessToken = token.accessToken;
      session.accessSecret = token.accessSecret;

      console.log("✅ Session Callback - Final Session:", session);
      return session;
    },
  },
};

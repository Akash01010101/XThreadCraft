import type { Metadata } from "next";
import AuthProvider from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sparklog-twitter.vercel.app'),
  title: {
    default: "XThreadCraft - Twitter Thread Management Platform",
    template: "%s | XThreadCraft"
  },
  description: "Create, manage and schedule your Twitter threads with ease. XThreadCraft helps content creators optimize their social media presence with AI-powered tools and analytics.",
  keywords: ["Twitter", "thread", "social media", "content management", "scheduling", "automation", "AI writing", "analytics", "social media optimization"],
  authors: [{ name: "XThreadCraft Team", url: "https://sparklog-twitter.vercel.app/team" }],
  creator: "XThreadCraft",
  publisher: "XThreadCraft",
  applicationName: "XThreadCraft",
  category: "Social Media Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "P8IWXjZ_bvh4kVseV74s1XU_ADu4d7EN5162uEMxjOk",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sparklog-twitter.vercel.app",
    title: "XThreadCraft - Twitter Thread Management Platform",
    description: "Create, manage and schedule your Twitter threads with ease using AI-powered tools",
    siteName: "XThreadCraft",
    images: [{
      url: "https://sparklog-twitter.vercel.app/og-image.png",
      width: 1200,
      height: 630,
      alt: "Sparklog Preview"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "XThreadCraft - Twitter Thread Management Platform",
    description: "Create, manage and schedule your Twitter threads with ease using AI-powered tools",
    creator: "@xthreadcraft",
    site: "@xthreadcraft",
    images: ["https://sparklog-twitter.vercel.app/og-image.png"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main>
              {children}
              </main>
            <Footer />
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

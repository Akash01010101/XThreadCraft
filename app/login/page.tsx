"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
      <Card className="w-[400px] shadow-lg transform transition-all duration-300 hover:shadow-xl hover:bg-accent/5 group backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-6">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Twitter className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground">
              Sign in with Twitter to continue to XThreadCraft
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {session ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Image
                  src={session.user?.image || "/default-avatar.png"}
                  alt="User Avatar"
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-primary/10"
                />
                <div className="text-center">
                  <p className="font-medium text-lg">
                    {session.user?.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/thread")}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => signIn("twitter")}
              className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] flex items-center justify-center space-x-2"
            >
              <Twitter className="h-5 w-5" />
              <span>Sign in with Twitter</span>
            </Button>
          )}
        </CardContent>
      </Card>
      </main>
      <Footer />
    </div>
  );
}

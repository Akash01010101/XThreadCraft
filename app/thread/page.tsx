"use client";

import { ThreadComposer } from "./thread-composer";
import { SavedThreads } from "./saved-threads";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TurnstileWrapper } from "./turnstile-wrapper";
import { useState } from "react";
export default function ThreadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [turnstileActive, setTurnstileActive] = useState(false);
  

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }

  }
, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted dark:bg-background">
      <div
      onClick={() => setTurnstileActive(true)}
      className="w-full max-w-4xl mx-auto mb-6 p-4 mt-10 cursor-pointer"
    >{turnstileActive ? (
      <div className="w-full max-w-4xl mx-auto mb-6 p-4">
        <TurnstileWrapper>
          <iframe
            id="taskade-chat"
            src="https://www.taskade.com/a/01JN5HMQW32K268B8909VY4DK0"
            width="100%"
            height="400"
            frameBorder="0"
            className="rounded-lg shadow-lg bg-white border border-gray-200 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            allow="clipboard-read; clipboard-write"
            allowFullScreen
          />
        </TurnstileWrapper>
      </div>) : ( <div className="rounded-lg shadow-lg bg-white border border-gray-200 p-6 text-center text-black">
          Click to verify and load chat
        </div> )}</div>
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <ThreadComposer />
          
          <SavedThreads />
        </div>
      </main>
    </div>
  );
}

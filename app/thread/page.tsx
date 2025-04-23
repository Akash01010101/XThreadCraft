"use client";
import { ThreadComposer } from "@/components/thread-composer";
import { SavedThreads } from "@/components/saved-threads";
import Taskadechat from "@/components/taskade-chat";
import TweetDeleter from "@/components/tweet-deleter";
export default function ThreadPage() {

  return (
    <div className="min-h-screen bg-muted dark:bg-background">
     <Taskadechat/>
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Create Your Twitter Thread</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compose, schedule, and manage your Twitter threads effortlessly. Break down your ideas into engaging segments, add media, and preview how your thread will look on Twitter.
            </p>
          </div>
          <ThreadComposer />
          <SavedThreads />
        </div>
      </main>
    <TweetDeleter/>
    </div>
  );
}

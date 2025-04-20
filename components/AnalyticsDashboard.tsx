"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Tweet {
  id: string;
  text: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

interface AnalyticsDashboardProps {
  tweets: Tweet[];
}

export function AnalyticsDashboard({ tweets }: AnalyticsDashboardProps) {
  const [visibleTweets, setVisibleTweets] = useState<Tweet[]>(tweets.slice(0, 10));
  const [page, setPage] = useState(1);
  const tweetsPerPage = 10;

  const loadMore = () => {
    const nextPage = page + 1;
    const nextTweets = tweets.slice(0, nextPage * tweetsPerPage);
    setVisibleTweets(nextTweets);
    setPage(nextPage);
  };

  return (
    <div className="space-y-6 p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tweet</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Retweets</TableHead>
            <TableHead>Replies</TableHead>
            <TableHead>Quotes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleTweets.map((tweet) => (
            <TableRow key={tweet.id}>
              <TableCell className="max-w-[300px] truncate">{tweet.text}</TableCell>
              <TableCell>{tweet.public_metrics.like_count}</TableCell>
              <TableCell>{tweet.public_metrics.retweet_count}</TableCell>
              <TableCell>{tweet.public_metrics.reply_count}</TableCell>
              <TableCell>{tweet.public_metrics.quote_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {visibleTweets.length < tweets.length && (
        <div className="flex justify-center mt-4">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

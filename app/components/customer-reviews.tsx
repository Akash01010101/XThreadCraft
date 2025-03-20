'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const reviews = [
  {
      "name": "Tom Wilson",
      "handle": "@tomwrites",
      "avatar": "TW",
      "content": "Spent 72 hours watching productivity videos. Didn’t apply a single hack. Turns out watching a ‘How to Wake Up at 5 AM’ video at 2 AM isn’t peak efficiency. ThreadMastery got me actually *doing* things. 4/5, still working on waking up early.",
      "rating": 4
  },
  {
      "name": "Lisa Carter",
      "handle": "@lisaloops",
      "avatar": "LC",
      "content": "Used to consume so much self-improvement content I became a philosopher by accident. AI finally helped me escape the theory trap—now I *apply* what I learn instead of just quoting it at dinner parties. 4/5, my friends miss Socrates Lisa.",
      "rating": 4
  },
  {
      "name": "Brian Oakley",
      "handle": "@oakleybuilds",
      "avatar": "BO",
      "content": "I followed 387 productivity gurus. Knew every Pomodoro technique by heart but couldn’t finish a single to-do list. Turns out AI + action beats ‘hustle inspiration’ every time. 4/5, still unlearning my addiction to morning routine breakdowns.",
      "rating": 4
  },
  {
      "name": "Samantha Reed",
      "handle": "@samtracks",
      "avatar": "SR",
      "content": "Scrolled through 1000 ‘build in public’ posts, built absolutely nothing. AI forced me to start *before* perfecting my Notion dashboard. Now I actually create. 4/5, wish AI could also fix my commitment to new side projects.",
      "rating": 4
  },
  {
      "name": "Jake Thompson",
      "handle": "@jaketakes",
      "avatar": "JT",
      "content": "I studied social media growth strategies so much I forgot to actually post. AI made me stop overanalyzing and just start sharing. 4/5, still recovering from my ‘content batching paralysis’ era.",
      "rating": 4
  },
  {
      "name": "Nina Patel",
      "handle": "@ninathinks",
      "avatar": "NP",
      "content": "I used to hoard knowledge like a dragon with gold. AI finally made me *use* it instead of just admiring my collection. 4/5, still resisting the urge to take ‘one more course’ before starting.",
      "rating": 4
  }
];



export function CustomerReviews() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of content creators who trust XThreadCraft for their social media management
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.handle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-6 h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">{review.avatar}</span>
                      </div>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{review.name}</h3>
                      <p className="text-sm text-muted-foreground">{review.handle}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
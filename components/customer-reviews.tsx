'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const reviews = [
  {
      "name": "Alex Chen",
      "role": "Tech Lead @GoogleAI",
      "handle": "@alexbuilds",
      "avatar": "AC",
      "content": "As a tech lead, I need to share complex concepts clearly. This platform helped me grow my audience from 2K to 20K in 3 months through well-structured threads. The AI-powered suggestions are incredibly helpful for technical content.",
      "rating": 5
  },
  {
      "name": "Sarah Johnson",
      "role": "Content Creator",
      "handle": "@sarahcreates",
      "avatar": "SJ",
      "content": "Doubled my engagement rate within weeks! The thread scheduling feature lets me maintain consistent presence while focusing on creation. From 5K to 50K followers in 6 months - this tool is a game-changer.",
      "rating": 5
  },
  {
      "name": "Dr. Michael Rivera",
      "role": "AI Researcher",
      "handle": "@mikeai",
      "avatar": "MR",
      "content": "Perfect for academic content creators. I've simplified complex AI concepts into engaging threads that actually get read. My research reaches 10x more people now. The analytics help me understand what resonates.",
      "rating": 5
  },
  {
      "name": "Emily Zhang",
      "role": "Startup Founder",
      "handle": "@emilybuilds",
      "avatar": "EZ",
      "content": "This platform helped me build a community of 30K founders. The thread templates save hours of work, and the engagement analytics guide our content strategy. Worth every second invested!",
      "rating": 5
  },
  {
      "name": "David Kumar",
      "role": "Product Designer",
      "handle": "@daviddesigns",
      "avatar": "DK",
      "content": "The visual thread feature is a designer's dream. I can showcase my work process effectively, and my engagement has increased by 400%. Plus, the scheduling tools help maintain work-life balance.",
      "rating": 5
  },
  {
      "name": "Rachel Moore",
      "role": "Learning Expert",
      "handle": "@rachelteaches",
      "avatar": "RM",
      "content": "Transformed how I share educational content. My threads consistently go viral now, and I've built a paid community of 5000+ members. The analytics insights are pure gold for content strategy.",
      "rating": 5
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
          <h2 className="text-3xl font-bold mb-4">From Consumers to Creators</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have transformed their Twitter experience from mindless scrolling to meaningful creation
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
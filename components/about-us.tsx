'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function AboutUs() {
  return (
    <section className="py-24 px-6 md:px-8 lg:px-12 bg-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Our Story</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Sparklog was born from a simple observation: in today&apos;s digital age, we&apos;re
                constantly consuming content, but rarely taking the time to process and
                create meaningful insights from what we learn. As avid Twitter users and
                content creators ourselves, we saw the need for a tool that could bridge
                the gap between passive consumption and active creation.
              </p>
              <p>
                Our mission is to empower individuals to transform their knowledge into
                engaging Twitter threads that spark conversations and build communities.
                We believe that everyone has valuable insights to share, and with the
                right tools, they can become influential voices in their respective fields.
              </p>
              <p>
                Today, we&apos;re proud to serve a growing community of creators who use
                Sparklog to craft compelling threads, build their audience, and make a
                lasting impact. Our team remains committed to innovating and providing
                the best possible experience for content creators who want to share their
                knowledge effectively.
              </p>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <Image
              src="/team-photo.jpg"
              alt="Sparklog Team"
              width={500}
              height={500}
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
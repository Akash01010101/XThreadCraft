'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Sparkles,
  Clock,
  BarChart3,
  Users
} from "lucide-react";

import { AnimatedHero } from './components/animated-hero';
import { ThreadPreview } from './components/thread-preview';
import { CustomerReviews } from './components/customer-reviews';
import { FAQSection } from './components/faq-section';
import { motion } from 'framer-motion';


const features = [
  {
    icon: Sparkles,
    title: 'Smart Content Creation',
    description: 'Automatically split your long-form content into perfectly sized tweets',
    points: ['Optimize Copy for Threads with our AI', 'Distraction Free Editor', 'Add Images to Threads']
  },
  {
    icon: Clock,
    title: 'Schedule & Automate',
    description: 'Plan your content ahead with advanced scheduling features',
    points: ['Flexible scheduling options', 'Time zone optimization', 'Queue management']
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Track your thread performance with detailed analytics',
    points: ['Engagement metrics', 'Audience insights', 'Performance dashboard']
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with your team seamlessly',
    points: ['Real-time collaboration', 'Plan and Schedule Content in a single deep work session']
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedHero />

      {/* Thread Preview Section */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-muted/50">
        <div className="container mx-auto max-w-7xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-16"
          >
            Threads Preview
          </motion.h2>
          <ThreadPreview />
        </div>
      </section>
    {/* Navigation Cards Section */}
    
      {/* Features Grid */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-background">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to create engaging Twitter threads</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.points.map((point, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CustomerReviews />

      

      <FAQSection />

      {/* CTA Section */}
      <motion.section 
        className="py-24 px-6 md:px-8 lg:px-12 bg-muted/50 dark:bg-muted/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="container mx-auto max-w-7xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold mb-8">Ready to Start Creating?</h2>
          <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Best of all, it&apos;s free to use. Get started today and create your first thread in minutes.
          </p>
          <Link href="/thread">
            <Button size="lg" className="gap-3 text-lg px-8 py-6">
              Create Your First Thread
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>
      
    </div>
  );
}

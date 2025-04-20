'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageCircle, Clock, BarChart } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Thread Creation',
    description: 'Create engaging Twitter threads with our intuitive editor. Add images, format text, and preview your content in real-time.',
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    description: 'Schedule your threads for optimal engagement times. Our AI-powered system suggests the best posting times based on your audience.',
  },
  {
    icon: BarChart,
    title: 'Analytics & Insights',
    description: 'Track your thread performance with detailed analytics. Understand engagement patterns and optimize your content strategy.',
  },
];

export function SplitFeatures() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background via-background/50 to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Powerful Features for
                <span className="text-primary relative inline-block ml-2">
                  Thread Creation
                  <div className="absolute -z-10 inset-0 bg-primary/10 rounded-lg -rotate-2" />
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to create, schedule, and analyze your Twitter threads in one place.
              </p>
            </div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 border border-border/50">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-black/10" />
              <div className="relative space-y-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="p-4 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="h-2 w-24 bg-primary/20 rounded animate-pulse" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
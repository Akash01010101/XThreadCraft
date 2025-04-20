'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface AnimatedTextProps {
  text: string;
  startIndex?: number;
  className?: string;
}

export function AnimatedHero() {
  const { theme, setTheme } = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true, // Animation runs once when section is in view
    threshold: 0.1,    // Trigger when 10% of the section is visible
  });

  // Define animation variants for each word
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // 100ms delay per word
        duration: 0.4,  // Duration of each word's animation
        ease: 'easeOut',
      },
    }),
  };

  // Component to animate text by words with a starting index
  const AnimatedText: React.FC<AnimatedTextProps> = ({
    text,
    startIndex = 0,
    className = '',
  }) => {
    const words = text.trim().split(/\s+/); // Split text into words
    return (
      <>
        {words.map((word, index) => (
          <motion.span
            key={index}
            custom={startIndex + index} // Global index for delay
            variants={wordVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className={className}
          >
            {word}{' '} {/* Add space after each word */}
          </motion.span>
        ))}
      </>
    );
  };

  // Define text parts
  const headingPart1 = "Turn Consumption into ";
  const headingPart2 = "Creation";
  const subheading =
    "Transform your Twitter presence with AI-powered thread creation. Save time, boost engagement, and share knowledge effectively. Join 15,000+ creators who've increased their audience by 3x on average.";

  const socialProof = {
    users: "15,000+",
    avgGrowth: "3x",
    rating: "4.9/5",
    testimonial: "Game-changing platform for content creators - @techinfluencer"
  };

  // Calculate the number of words in each part for startIndex
  const headingPart1Words = headingPart1.trim().split(/\s+/).length;
  const headingPart2Words = headingPart2.trim().split(/\s+/).length;

  return (
    <section
      ref={ref}
      className="relative py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/50 overflow-hidden"
    >
      {/* Theme toggle and sign-out buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => signOut()}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <LogOut className="h-6 w-6 text-primary" />
        </button>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-6 w-6 text-primary" />
          ) : (
            <Moon className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          {/* Heading with animated words */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <AnimatedText text={headingPart1} startIndex={0} />
            <span className="text-primary relative inline-block">
              <AnimatedText text={headingPart2} startIndex={headingPart1Words} />
              <div className="absolute -z-10 inset-0 bg-primary/10 rounded-lg -rotate-2" />
            </span>
          </h1>

          {/* Subheading with animated words */}
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto">
            <AnimatedText
              text={subheading}
              startIndex={headingPart1Words + headingPart2Words}
            />
          </p>

          {/* Social Proof */}
          <motion.div 
            className="flex justify-center gap-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <p className="text-2xl font-bold text-primary">{socialProof.users}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{socialProof.avgGrowth}</p>
              <p className="text-sm text-muted-foreground">Avg Growth</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{socialProof.rating}</p>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
          </motion.div>

          {/* Quick Testimonial */}
          <motion.p 
            className="text-lg text-muted-foreground mb-8 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            &quot;{socialProof.testimonial}&quot;
          </motion.p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Link href="/thread">
              <motion.button 
                className="inline-flex items-center justify-center rounded-md text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Creating Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 h-5 w-5"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Twitter, Instagram, Facebook, Linkedin } from 'lucide-react';

const socialPlatforms = [
  {
    name: 'Twitter',
    icon: Twitter,
    description: 'Schedule and manage threads with ease',
    color: 'bg-[#1DA1F2]/10 text-[#1DA1F2]'
  },
  {
    name: 'Instagram',
    icon: Instagram,
    description: 'Cross-post your content seamlessly',
    color: 'bg-[#E4405F]/10 text-[#E4405F]'
  },
  {
    name: 'Facebook',
    icon: Facebook,
    description: 'Reach your Facebook audience',
    color: 'bg-[#1877F2]/10 text-[#1877F2]'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    description: 'Share professional content',
    color: 'bg-[#0A66C2]/10 text-[#0A66C2]'
  }
];

export function SocialIntegrations() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Connect Your Social Media</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Integrate with your favorite social platforms and manage all your content in one place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialPlatforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
                <div className={`p-4 rounded-full ${platform.color} mb-4`}>
                  <platform.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                <p className="text-muted-foreground">{platform.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageIcon, SaveIcon } from 'lucide-react';

export function ThreadPreview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Input
                type="text"
                placeholder="Thread Title"
                disabled
                className="w-full mb-4"
              />
              <Textarea
                placeholder="What's happening?"
                disabled
                className="w-full min-h-[100px] resize-none"
              />
            </motion.div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label
                  className="cursor-not-allowed p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </label>
              </div>
              <Button
                disabled
                className="ml-auto"
              >
                Add Tweet
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Thread Preview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">1/ Create engaging Twitter threads with ease! 🚀</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">2/ Write, schedule, and manage your Twitter threads all in one place 📝</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">3/ Join thousands of content creators who trust XThreadCraft! 🌟</p>
              </div>
            </div>
          </div>
        </Card>
        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            disabled
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button disabled>
            Post Thread
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
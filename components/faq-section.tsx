'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: 'What makes your platform different from other Twitter tools?',
    answer:
      'We focus specifically on helping you transform from a content consumer to a creator. Our AI-powered tools, distraction-free editor, and analytics are designed to make thread creation effortless while maximizing engagement. Plus, our core features are free forever.',
  },
  {
    question: 'Do I need a large following to start creating threads?',
    answer:
      'Not at all! Many of our users started with less than 100 followers and grew to 10K+ by consistently sharing valuable insights. Our analytics help you understand what resonates with your audience, allowing you to grow organically.',
  },
  {
    question: 'How does the AI-powered thread creation work?',
    answer:
      'Our AI analyzes your content, suggests optimal thread structure, and helps maintain engagement throughout. It can help break down complex topics, suggest engaging hooks, and even recommend the best posting times based on your audience.',
  },
  {
    question: 'What are the pricing plans?',
    answer:
      'Our core features are free forever, including thread creation, scheduling, and basic analytics. For power users, we offer a Pro plan at $7/month with advanced features like AI assistance, team collaboration, and detailed analytics. We also offer a 30-day money-back guarantee.',
  },
  {
    question: 'How secure is my content on your platform?',
    answer:
      'We take security seriously. Your content is encrypted, we never store your Twitter passwords, and we use secure OAuth for authentication. You maintain full control of your content and can export or delete it anytime.',
  },
  {
    question: 'Do you offer customer support?',
    answer:
      'Yes! We provide 24/7 email support for all users, with priority support for Pro members. Our help center is regularly updated with guides and best practices, and we host weekly workshops for our community.',
  },
  {
    question: 'Can I schedule threads in advance?',
    answer:
      'Absolutely! You can schedule threads for optimal posting times, manage your content calendar, and even set up automated posting sequences. Our analytics help you identify the best times to post for maximum engagement.',
  }
];

export function FAQSection() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about XThreadCraft and its features
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </motion.div>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
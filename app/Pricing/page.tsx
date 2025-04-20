'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefundPolicyCheckbox } from "@/components/refund-policy-checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { AnimatedSection, AnimatedList } from "@/components/animated-section";
import { motion } from "framer-motion";
import { Turnstile } from '@marsidev/react-turnstile';

export default function PricingPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isRefundPolicyAccepted, setIsRefundPolicyAccepted] = useState(false);

  const handleRefundPolicyChange = async (checked: boolean) => {
    setIsRefundPolicyAccepted(checked);
    if (checked) {
      try {
        const response = await fetch('/api/chat-usage/update-tos', {
          method: 'POST',
        });
        if (!response.ok) {
          console.error('Failed to update terms acceptance');
        }
      } catch (error) {
        console.error('Error updating terms acceptance:', error);
      }
    }
  };

  const handleVerificationSuccess = () => {
    window.location.href = 'https://payhip.com/order?link=13jzL';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedSection className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 justify-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Card className="h-full border-primary shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Free Plan</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/forever</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "2 Verifications per Day",
                      "Basic Content Editor",
                      "Thread Creation",
                      "Basic Analytics",
                      "Community Support"
                    ].map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary"
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Card className="h-full border-primary shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Lifetime Pro</CardTitle>
                  <CardDescription>One-time payment, lifetime access</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-muted-foreground">/lifetime</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Unlimited Verifications Forever",
                      "Premium Content Editor",
                      "Unlimited Thread Creation",
                      "Advanced Analytics Dashboard",
                      "Priority Support",
                      "Team Collaboration Features",
                      "Lifetime Access to All Features"
                    ].map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <div className="space-y-4 w-full">
                    <RefundPolicyCheckbox onCheckedChange={handleRefundPolicyChange} />
                    {isVerifying ? (
                      <div className="flex flex-col items-center space-y-2">
                        <Turnstile
                          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABAEkEFDDIn7oklG'}
                          onSuccess={handleVerificationSuccess}
                          onError={(error) => {
                            setVerificationError(error);
                            setIsVerifying(false);
                          }}
                        />
                        {verificationError && (
                          <p className="text-sm text-red-500">{verificationError}</p>
                        )}
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => setIsVerifying(true)}
                        disabled={!isRefundPolicyAccepted}
                      >
                        Get Lifetime Access
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.4} className="py-20 px-4 md:px-6 lg:px-8 bg-muted dark:bg-muted/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-12 text-foreground dark:text-foreground">Frequently Asked Questions</h2>
          <AnimatedList className="grid gap-6 text-left" staggerDelay={0.1}>
            {[
              {
                question: "What's included in the free plan?",
                answer: "The free plan includes 2 verifications per day, basic content editing features, thread creation, and basic analytics. It's perfect for casual users."
              },
              {
                question: "Is this really a one-time payment?",
                answer: "Yes! Pay once and get lifetime access to all Pro features. No recurring fees or hidden charges."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your purchase, we'll refund your payment."
              },
              {
                question: "What happens after I purchase?",
                answer: "After your payment is processed, you'll get immediate access to all Pro features forever. No additional payments required."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-2"
              >
                <h3 className="font-semibold text-lg">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </AnimatedList>
        </div>
      </AnimatedSection>
    </div>
  );
}

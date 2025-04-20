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

import { AnimatedHero } from '@/components/animated-hero';
import { ThreadPreview } from '@/components/thread-preview-landing';
import { CustomerReviews } from '@/components/customer-reviews';
import { FAQSection } from '@/components/faq-section';

import PricingPage from "./Pricing/page";
import { AboutUs } from '@/components/about-us';

const features = [
  {
    icon: Sparkles,
    title: 'Free Thread Creation',
    description: 'Create engaging threads without spending a dime',
    points: ['AI-powered thread splitting', 'No subscription required', 'Unlimited thread creation']
  },
  {
    icon: Clock,
    title: 'Time-Saving Automation',
    description: 'Eliminate hours of manual tweet management',
    points: ['Bulk tweet deletion', 'Automated scheduling', 'Quick content organization']
  },
  {
    icon: BarChart3,
    title: 'Stress-Free Management',
    description: 'Simplify your Twitter workflow with smart automation',
    points: ['One-click tweet cleanup', 'Automated content planning', 'Effortless thread creation']
  },
  {
    icon: Users,
    title: 'Cost-Effective Solution',
    description: 'Get premium features without the premium price',
    points: ['Free forever plan', 'No hidden fees', 'Professional-grade tools']
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedHero />

      {/* Problem Agitation Section */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-muted/50 animate-fadeIn">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 transform transition-all duration-700 hover:scale-105">Stop Wasting Time & Money</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Managing your Twitter presence shouldn&apos;t be a full-time job. See what you&apos;re missing with our free automation tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-background shadow-lg transform transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">Manual Tweet Management</h3>
              <p className="text-muted-foreground">Spending hours manually deleting tweets and organizing content? Our automated tools do it in seconds - completely free.</p>
            </div>
            <div className="p-6 rounded-lg bg-background shadow-lg transform transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">Expensive Tools</h3>
              <p className="text-muted-foreground">Why pay for multiple tools when you can get thread creation, scheduling, and tweet management in one free platform?</p>
            </div>
            <div className="p-6 rounded-lg bg-background shadow-lg transform transition-all duration-500 hover:scale-105">
              <h3 className="text-xl font-semibold mb-4">Time-Consuming Process</h3>
              <p className="text-muted-foreground">Transform hours of manual work into minutes with our AI-powered automation - saving both time and stress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thread Preview Section */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-background animate-fadeIn">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold mb-16 transform transition-all duration-700 hover:scale-105">
            Transform Your Learning Through Creation
          </h2>
          <ThreadPreview />
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* Features Grid */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-background animate-fadeIn">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 transform transition-all duration-700 hover:scale-105">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to create engaging Twitter threads</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="transform transition-all duration-500 hover:scale-105">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutUs />

      <PricingPage />

      <FAQSection />

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-8 lg:px-12 bg-muted/50 dark:bg-muted/10 animate-fadeIn">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold mb-8 transform transition-all duration-700 hover:scale-105">Ready to Start Creating?</h2>
          <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Best of all, it&apos;s free to use. Get started today and create your first thread in minutes.
          </p>
          <Link href="/thread">
            <Button size="lg" className="gap-3 text-lg px-8 py-6 transition-transform transform hover:scale-110">
              Create Your First Thread
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
      
    </div>
  );
}

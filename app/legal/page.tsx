
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database } from "lucide-react";
import { AnimatedSection, AnimatedList } from "@/components/animated-section";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedSection className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>
          <AnimatedList className="grid gap-8" staggerDelay={0.1}>
            {sections.map((section, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                        <section.icon className="h-5 w-5 text-primary" />
                      <div>
                        <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                        <p className="text-muted-foreground mb-4">{section.description}</p>
                        <div className="space-y-4">
                          {section.content.map((paragraph, idx) => (
                            <div
                              key={idx}
                            >
                              {paragraph.subtitle && (
                                <h3 className="font-medium text-lg mb-2">{paragraph.subtitle}</h3>
                              )}
                              <p className="text-muted-foreground">{paragraph.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
             
            ))}
          </AnimatedList>

          <AnimatedSection delay={0.4} className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              If you have any questions about our Privacy Policy, please{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact us
              </a>
              .
            </p>
          </AnimatedSection>
        </div>
      </AnimatedSection>
    </div>
  );
}
const sections = [
  {
    title: "Data Collection",
    description: "Information we collect and how we collect it",
    icon: Database,
    content: [
      {
        subtitle: "Personal Information",
        text: "We collect information that you provide directly to us, including your name, email address, and profile information when you register for an account.",
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect certain information about your device and how you interact with our services, including IP address, browser type, and usage patterns.",
      },
    ],
  },
  {
    title: "Data Usage",
    description: "How we use your information",
    icon: Eye,
    content: [
      {
        subtitle: "Service Provision",
        text: "We use your information to provide, maintain, and improve our services, as well as to develop new features and protect the security of our platform.",
      },
      {
        subtitle: "Communications",
        text: "We may use your email address to send you important updates about our services, newsletters, and marketing communications (which you can opt out of).",
      },
    ],
  },
  {
    title: "Data Protection",
    description: "How we protect your information",
    icon: Shield,
    content: [
      {
        subtitle: "Security Measures",
        text: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.",
      },
      {
        subtitle: "Data Retention",
        text: "We retain your information only for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy.",
      },
    ],
  },
  {
    title: "Your Rights",
    description: "Control over your information",
    icon: Lock,
    content: [
      {
        subtitle: "Access and Control",
        text: "You have the right to access, correct, or delete your personal information. You can also request a copy of your data or restrict its processing.",
      },
      {
        subtitle: "Cookie Preferences",
        text: "You can control your cookie preferences through your browser settings. Some features may not function properly if you disable certain cookies.",
      },
    ],
  },
];
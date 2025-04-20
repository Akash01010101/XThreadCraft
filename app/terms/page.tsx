
import { Card, CardContent } from "@/components/ui/card";
import { Scale, FileText, AlertCircle, UserCheck } from "lucide-react";
import { AnimatedSection, AnimatedList } from "@/components/animated-section";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimatedSection className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>

          <AnimatedList className="grid gap-8" staggerDelay={0.1}>
            {sections.map((section, index) => (
              <div
                key={index}
              >
                <Card className="transform transition-all duration-300 hover:shadow-lg hover:bg-accent/5 group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                        <p className="text-muted-foreground mb-4">{section.description}</p>
                        <div className="space-y-6">
                          {section.clauses.map((clause, idx) => (
                            <div key={idx} >
                              <h3 className="font-medium text-lg">{clause.title}</h3>
                              <p className="text-muted-foreground">{clause.content}</p>
                              {clause.subclauses && (
                                <ul className="list-disc list-inside space-y-2 mt-2 ml-4 text-muted-foreground">
                                  {clause.subclauses.map((subclause, subIdx) => (
                                    <li
                              className="transition-all duration-300 group-hover:text-primary/90"
                                      key={subIdx}
                                    >
                                      {subclause}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </AnimatedList>

          <AnimatedSection delay={0.4} className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              By using our services, you agree to these terms. For any questions, please{" "}
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

type Clause = {
  title: string;
  content: string;
  subclauses?: string[];
};

import { LucideIcon } from "lucide-react";

type Section = {
  title: string;
  description: string;
  icon: LucideIcon;
  clauses: Clause[];
};

const sections: Section[] = [
  {
    title: "User Agreement",
    description: "Terms of using our platform",
    icon: UserCheck,
    clauses: [
      {
        title: "Account Registration",
        content: "You must register for an account to use our services. You agree to provide accurate and complete information during registration.",
        subclauses: [
          "You must be at least 13 years old to use our services",
          "You are responsible for maintaining the security of your account",
          "You must notify us of any unauthorized use of your account",
        ],
      },
      {
        title: "User Conduct",
        content: "You agree to use our services in accordance with these terms and applicable laws.",
        subclauses: [
          "Do not engage in any unlawful or prohibited activities",
          "Respect the intellectual property rights of others",
          "Do not attempt to interfere with our services",
        ],
      },
    ],
  },
  {
    title: "Service Terms",
    description: "How our services operate",
    icon: FileText,
    clauses: [
      {
        title: "Service Availability",
        content: "We strive to provide uninterrupted service but may need to perform maintenance or updates.",
      },
      {
        title: "Modifications",
        content: "We reserve the right to modify or discontinue our services at any time.",
      },
    ],
  },
  {
    title: "Liability",
    description: "Limitations and disclaimers",
    icon: AlertCircle,
    clauses: [
      {
        title: "Disclaimer of Warranties",
        content: "Our services are provided 'as is' without any warranties, express or implied.",
      },
      {
        title: "Limitation of Liability",
        content: "We shall not be liable for any indirect, incidental, or consequential damages.",
      },
    ],
  },
  {
    title: "Legal Terms",
    description: "Governing law and jurisdiction",
    icon: Scale,
    clauses: [
      {
        title: "Governing Law",
        content: "These terms are governed by and construed in accordance with the laws of the jurisdiction where we operate.",
      },
      {
        title: "Dispute Resolution",
        content: "Any disputes shall be resolved through arbitration in accordance with applicable laws.",
      },
    ],
  },
];
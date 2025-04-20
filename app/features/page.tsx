// app/features/page.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit,
  Split,
  Save,
  Upload,
  Share2,
  Users,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-background to-muted animate-fadeIn">
        <div className="container mx-auto max-w-6xl text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-slideInUp">
            Powerful Features for Content Creators
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fadeIn delay-200">
            Everything you need to create, manage, and share your content effectively
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:bg-accent/5 group animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 rotate-on-hover">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.subtitle}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 transition-all duration-300">
                      <div className="rounded-full bg-primary/10 p-1 mt-1 group-hover:bg-primary/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted text-center animate-fadeIn">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start creating better content today with our powerful tools.
          </p>
          <Button size="lg" className="hover:scale-105 transition-transform duration-300">
            Try Chirr App Free
          </Button>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Distraction-free Editor",
    subtitle: "Focus on what matters most - your content",
    icon: Edit,
    points: [
      "Clean and minimal interface design",
      "Rich text formatting options",
      "Real-time preview mode",
      "Keyboard shortcuts for efficiency",
    ],
  },
  {
    title: "Auto-split Content",
    subtitle: "Repurpose blog content effortlessly",
    icon: Split,
    points: [
      "Intelligent content splitting algorithm",
      "Maintains context and readability",
      "Custom thread length options",
      "Preview and edit splits before posting",
    ],
  },
  {
    title: "Drafts & Sharing",
    subtitle: "Never lose your work",
    icon: Save,
    points: [
      "Auto-save functionality",
      "Cloud backup of all drafts",
      "Share drafts with team members",
      "Version history tracking",
    ],
  },
  {
    title: "Media Uploads",
    subtitle: "Enhance your content with rich media",
    icon: Upload,
    points: [
      "Support for images, videos, and GIFs",
      "Drag and drop functionality",
      "Automatic image optimization",
      "Media library management",
    ],
  },
  {
    title: "Cross-posting",
    subtitle: "Reach your audience everywhere",
    icon: Share2,
    points: [
      "Post to LinkedIn and Mastodon",
      "Platform-specific formatting",
      "Scheduled posting",
      "Analytics and engagement tracking",
    ],
  },
  {
    title: "Multiple Accounts",
    subtitle: "Manage all your presence in one place",
    icon: Users,
    points: [
      "Connect unlimited accounts",
      "Quick account switching",
      "Team collaboration features",
      "Role-based permissions",
    ],
  },
];

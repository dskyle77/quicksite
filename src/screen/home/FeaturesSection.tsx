// src/features/home/FeaturesSection.tsx
import { Sparkles, MessageCircle, MapPin, Smartphone } from "lucide-react";

const FEATURES = [
  {
    id: "01",
    icon: Sparkles,
    title: "AI-Powered Minisites",
    description:
      "Onboarding automatically creates your site, business info, and persuasive descriptions with AI — no skills needed.",
  },
  {
    id: "02",
    icon: MessageCircle,
    title: "WhatsApp Leads",
    description:
      "Turn visitors into customers instantly with a conversion engine built directly for WhatsApp business.",
  },
  {
    id: "03",
    icon: MapPin,
    title: "SEO & Google Discovery",
    description:
      "Your minisite is structured to appear on Google and other search engines, making your business easy to discover online.",
  },
  {
    id: "04",
    icon: Smartphone,
    title: "Mobile-First UI",
    description:
      "Optimized for low-end devices and Nigerian internet speeds. Fast, lightweight, and professional.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 border-t border-border/60 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center border border-border px-2.5 py-0.5 text-xs rounded-full mb-4 font-medium bg-muted/50">
            Why Quicksite
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
            Everything you need to{" "}
            <span className="text-primary">grow your brand.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ id, icon: Icon, title, description }) => (
            <div
              key={id}
              className="group relative rounded-2xl border border-border bg-card p-7 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
              <span className="absolute top-5 right-5 text-xs text-muted-foreground/30 font-bold">
                {id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

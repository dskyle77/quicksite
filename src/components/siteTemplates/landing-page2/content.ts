// ─── Starter Content ───────────────────────────────────────────────────────────

const getStarterContent = ({
  selectedTitle,
  whatsappNumber,
  defaultMessage,
}: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
}) => {
  const getWhatsappButtonLink = () => {
    if (!whatsappNumber) return {};
    return {
      type: "whatsapp",
      phone: whatsappNumber,
      message: typeof defaultMessage === "string" ? defaultMessage : "",
    };
  };

  return {
    navbar: {
      logo: "◈",
      title: selectedTitle || "LaunchPad",
      ctaButton: "Get Started",
      ctaButtonLink: getWhatsappButtonLink(),
    },
    hero: {
      badge: "🚀 Now in Public Beta",
      image1:
        "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
      image1PId: "",
      title: "The Fastest Way to Launch Your Product",
      desc: "Stop wasting time on boilerplate. LaunchPad gives you everything you need to go from idea to live product in days — not months.",
      primaryButton: "Start for Free",
      primaryButtonLink: getWhatsappButtonLink(),
      secondaryButton: "Watch Demo",
      secondaryButtonLink: {},
      trustBadge: "Trusted by 500+ teams worldwide",
    },
    logosHeading: "Trusted by teams at",
    logos: [
      { name: "Acme Corp" },
      { name: "Globex" },
      { name: "Initech" },
      { name: "Umbrella" },
      { name: "Hooli" },
    ],
    featuresHeading: "Everything You Need",
    featuresSubheading:
      "Purpose-built features that help you move faster and ship with confidence.",
    features: [
      {
        icon: "⚡",
        title: "Blazing Fast Setup",
        desc: "Get your project running in under 5 minutes with our one-click deploy and pre-configured environments.",
      },
      {
        icon: "🔒",
        title: "Enterprise Security",
        desc: "Bank-grade encryption, SOC 2 compliance, and role-based access control built in from day one.",
      },
      {
        icon: "📊",
        title: "Real-time Analytics",
        desc: "Understand your users with live dashboards, funnel analysis, and actionable insights.",
      },
      {
        icon: "🔄",
        title: "Seamless Integrations",
        desc: "Connect with 100+ tools your team already uses — Slack, Stripe, HubSpot, and more.",
      },
      {
        icon: "🤝",
        title: "Team Collaboration",
        desc: "Invite your team, set permissions, and work together in real time without friction.",
      },
      {
        icon: "🛠️",
        title: "Developer Friendly",
        desc: "Full API access, webhooks, and SDKs in every major language. Build exactly what you need.",
      },
    ],
    howItWorksHeading: "How It Works",
    howItWorksSubheading: "From sign-up to launch in three simple steps.",
    steps: [
      {
        number: "01",
        title: "Create Your Account",
        desc: "Sign up in seconds. No credit card required. Start with a generous free tier.",
      },
      {
        number: "02",
        title: "Configure Your Project",
        desc: "Use our guided setup wizard to customize everything to your needs in minutes.",
      },
      {
        number: "03",
        title: "Launch & Grow",
        desc: "Go live with one click. Monitor performance and scale effortlessly as you grow.",
      },
    ],
    pricingHeading: "Simple, Transparent Pricing",
    pricingSubheading: "No hidden fees. Cancel anytime.",
    plans: [
      {
        name: "Starter",
        price: "$0",
        period: "/ month",
        desc: "Perfect for solo projects and side hustles.",
        features: [
          "Up to 3 projects",
          "1,000 monthly users",
          "Basic analytics",
          "Email support",
        ],
        ctaLabel: "Start Free",
        highlighted: false,
      },
      {
        name: "Pro",
        price: "$29",
        period: "/ month",
        desc: "For growing teams that need more power.",
        features: [
          "Unlimited projects",
          "50,000 monthly users",
          "Advanced analytics",
          "Priority support",
          "Custom domain",
          "Team collaboration",
        ],
        ctaLabel: "Get Started",
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "/ month",
        desc: "For large-scale operations and enterprises.",
        features: [
          "Everything in Pro",
          "Unlimited users",
          "Dedicated support",
          "SLA guarantee",
          "SSO / SAML",
          "Custom integrations",
        ],
        ctaLabel: "Contact Us",
        highlighted: false,
      },
    ],
    testimonialsHeading: "Loved by Builders",
    testimonialsSubheading:
      "Don't take our word for it — hear from our customers.",
    testimonials: [
      {
        quote:
          "LaunchPad cut our time-to-market in half. We went from idea to paying customers in just two weeks. Absolutely incredible product.",
        name: "Priya Sharma",
        role: "CTO, Finova",
        avatar: "P",
      },
      {
        quote:
          "We evaluated 5 competitors before choosing LaunchPad. The developer experience and reliability are simply unmatched.",
        name: "Marcus Williams",
        role: "Founder, Stackify",
        avatar: "M",
      },
      {
        quote:
          "The analytics alone were worth the switch. We finally understand what our users actually need, and our retention is up 60%.",
        name: "Yuki Tanaka",
        role: "Head of Product, Nimbus",
        avatar: "Y",
      },
    ],
    faqHeading: "Frequently Asked Questions",
    faqSubheading: "Everything you need to know before getting started.",
    faqs: [
      {
        question: "Is there a free plan?",
        answer:
          "Yes! Our Starter plan is completely free forever. No credit card required to sign up and start building.",
      },
      {
        question: "Can I upgrade or downgrade at any time?",
        answer:
          "Absolutely. You can change your plan at any time from your account settings. Changes take effect immediately.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee on all paid plans, no questions asked.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes. We use AES-256 encryption at rest and TLS in transit. We are SOC 2 Type II certified and GDPR compliant.",
      },
      {
        question: "Do you have an API?",
        answer:
          "Yes, every plan includes full API access with detailed documentation, SDKs for major languages, and webhook support.",
      },
    ],
    cta: {
      title: "Ready to Build Something Great?",
      desc: "Join thousands of teams already building with LaunchPad. Start for free — no credit card needed.",
      primaryButton: "Get Started Free",
      primaryButtonLink: getWhatsappButtonLink(),
      secondaryButton: "Talk to Sales",
      secondaryButtonLink: getWhatsappButtonLink(),
    },
    footer: {
      brand: selectedTitle || "LaunchPad",
      tagline: "The fastest way to go from idea to product.",
      copyright: `© ${new Date().getFullYear()} All rights reserved.`,
      columns: [
        {
          heading: "Product",
          links: ["Features", "Pricing", "Changelog", "Roadmap"],
        },
        {
          heading: "Company",
          links: ["About", "Blog", "Careers", "Press"],
        },
        {
          heading: "Legal",
          links: ["Privacy", "Terms", "Security", "Cookies"],
        },
      ],
      socials: ["Twitter", "GitHub", "LinkedIn"],
    },
  };
};

// ─── AI Schema ────────────────────────────────────────────────────────────────

const getSchema = ({
  selectedTitle,
  whatsappNumber,
  defaultMessage,
  defaultImage
}: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  defaultImage?: string
}) => {
  const whatsappLink = whatsappNumber
    ? {
        type: "whatsapp",
        phone: whatsappNumber,
        message: typeof defaultMessage === "string" ? defaultMessage : "",
      }
    : {};

  return {
    navbar: {
      logo: "◈",
      title: selectedTitle || "",
      ctaButton: "",
      ctaButtonLink: whatsappLink,
    },
    hero: {
      badge: "",
      image1: defaultImage,
      image1PId: "",
      title: "",
      desc: "",
      primaryButton: "",
      primaryButtonLink: whatsappLink,
      secondaryButton: "",
      secondaryButtonLink: {},
      trustBadge: "",
    },
    logosHeading: "",
    logos: [{ name: "" }, { name: "" }, { name: "" }, { name: "" }],
    featuresHeading: "",
    featuresSubheading: "",
    features: [
      { icon: "", title: "", desc: "" },
      { icon: "", title: "", desc: "" },
      { icon: "", title: "", desc: "" },
      { icon: "", title: "", desc: "" },
    ],
    howItWorksHeading: "",
    howItWorksSubheading: "",
    steps: [
      { number: "01", title: "", desc: "" },
      { number: "02", title: "", desc: "" },
      { number: "03", title: "", desc: "" },
    ],
    pricingHeading: "",
    pricingSubheading: "",
    plans: [
      {
        name: "",
        price: "",
        period: "",
        desc: "",
        features: [],
        ctaLabel: "",
        highlighted: false,
      },
      {
        name: "",
        price: "",
        period: "",
        desc: "",
        features: [],
        ctaLabel: "",
        highlighted: true,
      },
      {
        name: "",
        price: "",
        period: "",
        desc: "",
        features: [],
        ctaLabel: "",
        highlighted: false,
      },
    ],
    testimonialsHeading: "",
    testimonialsSubheading: "",
    testimonials: [
      { quote: "", name: "", role: "", avatar: "" },
      { quote: "", name: "", role: "", avatar: "" },
      { quote: "", name: "", role: "", avatar: "" },
    ],
    faqHeading: "",
    faqSubheading: "",
    faqs: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
    cta: {
      title: "",
      desc: "",
      primaryButton: "",
      primaryButtonLink: whatsappLink,
      secondaryButton: "",
      secondaryButtonLink: whatsappLink,
    },
    footer: {
      brand: selectedTitle || "",
      tagline: "",
      copyright: `© ${new Date().getFullYear()} All rights reserved.`,
      columns: [
        { heading: "", links: ["", "", ""] },
        { heading: "", links: ["", "", ""] },
        { heading: "", links: ["", "", ""] },
      ],
      socials: ["Twitter", "GitHub", "LinkedIn"],
    },
  };
};

// ─── Meta & Config ────────────────────────────────────────────────────────────

const meta = {
  title: "Landing Page",
  image: "/ti/landing1.png",
  category: "Landing Page",
  description:
    "A clean, conversion-focused landing page template for SaaS products, startups, and businesses. Features hero, features, pricing, testimonials, and FAQ sections.",
};

const config = {
  type: "landing-page-1",
  theme: "light",
};

export const landingPage2Content = {
  meta,
  config,
  getSchema,
  getStarterContent,
};

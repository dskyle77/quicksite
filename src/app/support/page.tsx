import { Mail, MessageCircle, BookOpen, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Support",
  description:
    "Get help with your website. Contact our team or browse our guides.",
};

const supportOptions = [
  {
    title: "WhatsApp Support",
    description: "Get instant answers. Best for quick technical fixes.",
    icon: <MessageCircle className="h-6 w-6 text-green-500" />,
    action: "Chat with us",
    link: "https://wa.me/2348161592059",
    color: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Email Helpdesk",
    description: "For billing inquiries or detailed account issues.",
    icon: <Mail className="h-6 w-6 text-blue-500" />,
    action: "Send an email",
    link: "mailto:support@quicksiteio.app",
    color: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Help Center",
    description: "Self-service guides on how to build and launch.",
    icon: <BookOpen className="h-6 w-6 text-purple-500" />,
    action: "Read guides",
    link: "/docs",
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We’re here to help you get your Nigerian business online.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {supportOptions.map((option) => (
          <a
            key={option.title}
            href={option.link}
            target={option.link.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="group relative flex flex-col items-start p-8 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 bg-card"
          >
            <div className={`p-3 rounded-xl mb-4 ${option.color}`}>
              {option.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
            <p className="text-muted-foreground mb-6 grow">
              {option.description}
            </p>
            <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
              {option.action}
              <ExternalLink className="ml-1 h-3 w-3" />
            </span>
          </a>
        ))}
      </div>

      <div className="mt-20 p-8 rounded-3xl bg-primary text-white text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 mb-6">
          Can&apos;t find what you&apos;re looking for?
        </p>
        <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-slate-200 transition-colors">
          View all FAQs
        </button>
      </div>
    </div>
  );
}

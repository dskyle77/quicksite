"use client"
import { useState } from "react";
import {
  Mail,
  MessageCircle,
  BookOpen,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

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
    link: "#",
    color: "bg-purple-50 dark:bg-purple-900/20",
  },
];

const faqs = [
  {
    question: "What is Quicksite?",
    answer:
      "Quicksite helps Nigerian small businesses launch instant mini-sites that convert visitors into WhatsApp orders or bookings.",
  },
  {
    question: "Do I need coding skills?",
    answer:
      "No. You just fill in your business details and your site is generated automatically.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes. You can connect a custom domain or use a free Quicksite subdomain.",
  },
  {
    question: "How do customers place orders?",
    answer:
      "Customers place orders directly via WhatsApp or booking links integrated into your page.",
  },
  // {
  //   question: "Does Quicksite support payments?",
  //   answer:
  //     "Yes. You can integrate Paystack or Flutterwave for direct payments.",
  // },
];

export default function SupportScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We help you get your business online and selling fast.
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {supportOptions.map((option) => (
          <a
            key={option.title}
            href={option.link}
            target={option.link.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="group flex flex-col p-8 rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"
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

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-2xl bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-5 pb-5 text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 p-10 rounded-3xl bg-primary text-white text-center">
        <h2 className="text-2xl font-semibold mb-2">Still need help?</h2>
        <p className="text-slate-200 mb-6">
          Reach out on WhatsApp or check the docs for faster answers.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="https://wa.me/2348161592059"
            className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-slate-200 transition"
          >
            WhatsApp Support
          </a>

          <a
            href="#"
            className="border border-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition"
          >
            Open Docs
          </a>
        </div>
      </div>
    </div>
  );
}

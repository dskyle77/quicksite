// src/server/ai/generateWhatsappMessages.ts
// Generates contextual WhatsApp CTA messages using Groq AI
// Called during site creation to produce smart, relevant pre-filled messages

import "server-only";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface WhatsappMessageContext {
  businessName: string;
  businessType: string; // e.g. "restaurant", "event", "digital store", "portfolio"
  description: string;
  templateType: string; // e.g. "menu-one", "event-site", "digital-store", "portfolio-1"
}

export interface GeneratedWhatsappMessages {
  // Hero CTA
  heroPrimary: string;
  // Contact section
  contactPrimary: string;
  // Navbar CTA
  navbarCta: string;
  // Generic fallback
  default: string;
  // Item/product specific (for menus and stores)
  itemInquiry?: string;
  // Booking / ticket specific (for events)
  ticketInquiry?: string;
  // Project / hire inquiry (for portfolios)
  hireInquiry?: string;
}

/**
 * Generates AI-powered WhatsApp pre-filled messages based on business context.
 * Falls back to sensible defaults if AI fails.
 */
export async function generateWhatsappMessages(
  ctx: WhatsappMessageContext,
): Promise<GeneratedWhatsappMessages> {
  const fallback = buildFallbackMessages(ctx);

  try {
    const prompt = buildPrompt(ctx);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 600,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<GeneratedWhatsappMessages>;

    // Validate and merge with fallbacks
    return {
      heroPrimary: sanitize(parsed.heroPrimary) || fallback.heroPrimary,
      contactPrimary:
        sanitize(parsed.contactPrimary) || fallback.contactPrimary,
      navbarCta: sanitize(parsed.navbarCta) || fallback.navbarCta,
      default: sanitize(parsed.default) || fallback.default,
      itemInquiry: sanitize(parsed.itemInquiry) || fallback.itemInquiry,
      ticketInquiry: sanitize(parsed.ticketInquiry) || fallback.ticketInquiry,
      hireInquiry: sanitize(parsed.hireInquiry) || fallback.hireInquiry,
    };
  } catch (err) {
    console.error("[generateWhatsappMessages] AI failed, using fallback:", err);
    return fallback;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sanitize(msg: unknown): string {
  if (typeof msg !== "string") return "";
  // Remove any accidentally generated URL or phone in message
  return msg.trim().slice(0, 300);
}

function buildPrompt(ctx: WhatsappMessageContext): string {
  return `
You are a WhatsApp copywriter specializing in Nigerian small businesses.
Write natural, warm, conversational WhatsApp pre-filled messages for a business.

Business details:
- Name: "${ctx.businessName}"
- Type: "${ctx.businessType}"
- Template: "${ctx.templateType}"
- Description: "${ctx.description}"

Rules:
1. Messages must start with "Hi" or "Hello" and feel like a real customer sent them.
2. Mention the business name naturally in at least some messages.
3. Keep messages SHORT (1-3 sentences max). Under 200 characters preferred.
4. Write in natural Nigerian English — warm, direct, friendly.
5. Do NOT include phone numbers, URLs, or emojis in messages.
6. Return ONLY valid JSON. No markdown or code fences.

Return this exact JSON shape:
{
  "heroPrimary": "Message for the main hero CTA button (customer wants to take the primary action)",
  "contactPrimary": "Message for contact section (customer reaching out with a question or inquiry)",
  "navbarCta": "Message for navbar call-to-action button (short, action-oriented)",
  "default": "Generic fallback message for any WhatsApp link",
  "itemInquiry": "Message when customer clicks on a specific product or menu item (include 'I saw [item name]' pattern if relevant)",
  "ticketInquiry": "Message when customer wants to buy a ticket or attend an event",
  "hireInquiry": "Message when customer wants to hire or collaborate"
}

Tailor messages to the business type:
- Food/restaurant: focus on ordering, delivery, availability
- Events: focus on tickets, attendance, seat availability
- Digital store: focus on purchasing, payment, file delivery
- Portfolio: focus on hiring, project collaboration, rates

Be specific to "${ctx.businessName}" where possible.
  `.trim();
}

function buildFallbackMessages(
  ctx: WhatsappMessageContext,
): GeneratedWhatsappMessages {
  const name = ctx.businessName;

  const typeMap: Record<string, GeneratedWhatsappMessages> = {
    "menu-one": {
      heroPrimary: `Hi! I'd like to place an order at ${name}.`,
      contactPrimary: `Hi! I have a question about ${name}. Can you help?`,
      navbarCta: `Hi! I'd like to order from ${name}.`,
      default: `Hi! I'm interested in ${name}.`,
      itemInquiry: `Hi! I saw your menu and I'd like to order. What's available?`,
    },
    "event-site": {
      heroPrimary: `Hi! I'd like to get tickets for ${name}. Please send me details.`,
      contactPrimary: `Hi! I have a question about the ${name} event.`,
      navbarCta: `Hi! I want to attend ${name}. How do I get tickets?`,
      default: `Hi! I'm interested in ${name}.`,
      ticketInquiry: `Hi! I'd like to buy a ticket for ${name}. What options are available?`,
    },
    "digital-store": {
      heroPrimary: `Hi! I'd like to buy one of your digital products.`,
      contactPrimary: `Hi! I need help choosing the right product from ${name}.`,
      navbarCta: `Hi! I'd like to purchase from ${name}.`,
      default: `Hi! I'm interested in your digital products.`,
      itemInquiry: `Hi! I saw your product and I'd like to buy it. Please send payment details.`,
    },
    "portfolio-1": {
      heroPrimary: `Hi! I saw your portfolio and I'd like to discuss a project.`,
      contactPrimary: `Hi! I'd like to inquire about your services and rates.`,
      navbarCta: `Hi! I'd like to hire you for a project.`,
      default: `Hi! I came across your work and I'm interested in working together.`,
      hireInquiry: `Hi! I'd like to collaborate with you. Are you available for new projects?`,
    },
    "portfolio-2": {
      heroPrimary: `Hi! I saw your portfolio and I'd love to work with you.`,
      contactPrimary: `Hi! I have a project in mind and I think you'd be perfect for it.`,
      navbarCta: `Hi! I'd like to hire you.`,
      default: `Hi! I'm reaching out about a potential project.`,
      hireInquiry: `Hi! I'd like to discuss a project or collaboration. Are you available?`,
    },
  };

  return (
    typeMap[ctx.templateType] || {
      heroPrimary: `Hi! I'm interested in ${name}.`,
      contactPrimary: `Hi! I'd like to know more about ${name}.`,
      navbarCta: `Hi! I'd like to connect with ${name}.`,
      default: `Hi! I came across ${name} and I'm interested.`,
    }
  );
}

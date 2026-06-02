// src/server/ai/generateSiteContent.ts
// UPDATED — pre-flight validation on title/description before AI call;
//           AI now sets __refused__: true intentionally instead of burying text markers.

/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import Groq from "groq-sdk";
import { variantOptions } from "@/components/templateBuilder/contentBlocks";
import { getThemeOptionsForAI, isValidThemeId } from "@/lib/themes";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------------------------------------------------------------------------
// Pre-flight validation — runs BEFORE spending tokens on an AI call.
// ---------------------------------------------------------------------------

const BLOCKED_TERMS = [
  "escort",
  "erotic",
  "pornograph",
  "porn",
  "adult content",
  "onlyfans",
  "nude",
  "fetish",
  "sex service",
  "gambling",
  "casino",
  "slot machine",
  "drug dealer",
  "weapon",
  "illegal service",
  "hack",
];

function preflightCheck(title: string, description: string): void {
  const trimmedTitle = title.trim();

  if (!trimmedTitle || trimmedTitle.length < 2) {
    throw new Error("INVALID_INPUT: Business name is too short.");
  }
  if (trimmedTitle.length > 80) {
    throw new Error(
      "INVALID_INPUT: Business name must be 80 characters or fewer.",
    );
  }
  if (!description.trim()) {
    throw new Error("INVALID_INPUT: Please provide a business description.");
  }
  if (description.length > 2000) {
    throw new Error(
      "INVALID_INPUT: Description must be 2000 characters or fewer.",
    );
  }

  // Block obviously unsafe content before hitting the AI
  const combined = `${trimmedTitle} ${description}`.toLowerCase();
  const blockedHit = BLOCKED_TERMS.find((term) => combined.includes(term));
  if (blockedHit) {
    throw new Error("AI_REFUSAL");
  }
}

// ---------------------------------------------------------------------------
// Main generation function
// ---------------------------------------------------------------------------

export async function generateSiteContentWithAI({
  selectedTitle,
  description,
  schemaBase,
  defaultThemeId = "warm",
}: {
  selectedTitle: string;
  description: string;
  schemaBase: any;
  defaultThemeId?: string;
}) {
  // Run cheap pre-flight checks before spending tokens on the AI call
  preflightCheck(selectedTitle, description);

  const themeOptions = getThemeOptionsForAI();
  const systemPrompt = `
  You are QuickSite's AI copywriter. QuickSite helps Nigerian small businesses (restaurants, salons, vendors, creatives, professionals) launch a mobile-friendly website in minutes — often with WhatsApp as the main call-to-action.
  
  Generate complete website content for "${selectedTitle}".
  Business description from the owner: "${description}"
  
  
  OUTPUT RULES (non-negotiable):
  1. Return ONE JSON object based on this schema: ${JSON.stringify(schemaBase)}
     Also include these extra top-level keys:
     - "description": a 1–2 sentence SEO meta description for the business (under 160 chars, benefit-led, no hashtags)
     - "tags": an array of 5–8 lowercase keyword strings relevant to the business (e.g. ["restaurant", "lagos", "nigerian food", "delivery"])
     - "__refused__": false   ← always include this key; only set it to true when refusing (see SAFETY RULES)
  2. Do NOT add, remove, or rename top-level keys. Section content keys follow the pattern "{sectionId}{sectionType}" (e.g. "init-aboutabout") — keep those keys unchanged.
  3. Fill every empty string with specific, credible copy grounded in the business description — except "theme". Do not use lorem ipsum, generic filler, or placeholder names (John Doe, Jane Doe, John Smith, "A satisfied customer", etc.).which must be a theme id from the SITE THEME list below. Do not use lorem ipsum or generic filler.
  4. Keep all "image" and "imagePId" field values exactly as they appear in the schema — never modify image URLs or generate fake imagePId values.
  5. Return ONLY valid JSON. No markdown, no code fences, no commentary.
  6. For ALL whatsapp linkConfig objects (those with "type": "whatsapp"), keep the "phone" field exactly as it is in the schema. You may update the "message" field with a natural, conversational WhatsApp message relevant to the context. Messages must be short (under 200 chars), warm, and feel like a real customer sent them.
  
  SAFETY RULES (non-negotiable):
  - Never generate, describe, promote, or imply sexually explicit, pornographic, fetish, erotic, nude, adult, or age-restricted content.
  - Never generate content involving minors in romantic, sexual, suggestive, or adult contexts.
  - If the business title or description requests adult, erotic, escort, pornography, fetish, gambling, drugs, weapons, illegal services, or other unsafe content — DO NOT generate site content.
  - REFUSAL MECHANISM: When refusing, you MUST set the top-level "__refused__" key to true. This is the only refusal signal — do NOT bury refusal text inside content fields or use phrases like "not supported". Simply set "__refused__": true and fill the rest of the schema with empty strings or minimal placeholders to keep the JSON valid.
  - Example refusal response shape: { "__refused__": true, "theme": "warm", "description": "", "tags": [], ...all other schema keys with empty strings or empty arrays }
  - Never attempt to bypass, reframe, or disguise prohibited content.

  ARRAY EXPANSION (important):
  - Arrays in the schema are minimum templates showing the required object shape — not fixed-length constraints.
  - You MUST expand item arrays to the counts below. Every entry must follow the exact same object shape as the template (same keys, same value types).
  - Never return an array shorter than the template.
    | Array field context        | Min entries | Max entries |
    | projects / items / dishes  | 3           | 6           |
    | gallery items              | 4           | 8           |
    | features / services        | 3           | 6           |
    | skills                     | 4           | 8           |
    | testimonials               | 2           | 3           |
    | pricing plans              | 2           | 4           |
    | experience entries         | 2           | 4           |
    | faq entries                | 3           | 6           |
    | tags (per item)            | 2           | 4           |
    | navbar.links               | 3           | 5           |
  
  COPY & TONE:
  - Write for Nigerian customers: warm, clear, professional, and benefit-led — not stiff corporate English.
  - Headlines: short and punchy (under ~10 words). Body: scannable sentences; avoid walls of text.
  - CTAs should match WhatsApp-led businesses when links are WhatsApp: e.g. "Chat on WhatsApp", "Order Now", "Book an Appointment", "Get a Quote" — never "Submit" or "Click Here".
  - Use realistic details (services, prices in ₦ or $ where appropriate, cities like Lagos, Abuja, Ibadan only if they fit the description).
  - Navbar title and footer brand must be "${selectedTitle}".
  - Hero badge: a short status line (e.g. "Open for orders", "Accepting bookings", "Available for projects").
  - Skills "level" values must be number strings between "1" and "100".
  - Project/item titles must be specific to the business (dish names, product names, service names — not "Project 1").
  - Testimonials must use believable Nigerian full names and realistic roles/locations.
  - Testimonials: 2–3 entries. Never use placeholder names like "John Doe", "Jane Doe", "John Smith", or any obvious stand-in. Use culturally specific Nigerian full names (e.g. "Chisom Okafor", "Babatunde Adeyemi", "Ngozi Eze") and realistic roles tied to the business type (e.g. "Regular customer, Lekki", "Event planner, Abuja", "Freelance photographer, Lagos").
  - Contact location: a plausible city/area; keep email professional (hello@ or contact@ style using a slug derived from the business name).
  
  BUILDER CONFIG (layout):
  Allowed variants per block: ${JSON.stringify(variantOptions)}
  
  For builderConfig:
  - Set navbar, hero, and footer to exactly ONE value from the allowed lists above.
  - For each section in builderConfig.sections: pick variant from the list for that section type; set enabled true/false; set anchorName to a short lowercase slug (e.g. "about", "menu", "services", "gallery") unique across sections.
  - Do NOT change section "id" or "type" values — only variant, enabled, and anchorName.
  
  Choose layout by business type (disable irrelevant sections, do not delete them):
  | Business type                  | Enable                                                          | Disable                              |
  | Food / restaurant / catering   | about, text or features, projects (dishes/specials), testimonials, contact | skills, experience, pricing, faq, cta |
  | Salon / barbershop / beauty    | about, features or projects (services), pricing, testimonials, contact | skills, experience, faq          |
  | Retail / fashion / vendor      | about, projects (products), features, testimonials, contact     | skills, experience                   |
  | Freelancer / developer / creative | about, skills, projects, experience, testimonials, contact   | pricing, faq, cta                    |
  | Agency / studio                | about, features, projects, testimonials, contact               | skills, pricing                      |
  | Coach / consultant / professional | about, text, features, experience, testimonials, contact     | projects, skills                     |
  | SaaS / app / digital product   | features, pricing, faq, testimonials, cta, contact             | skills, projects, experience         |
  | Events                         | text, features, pricing, testimonials, faq, contact            | skills, experience                   |
  | Digital store                  | text, items (products), features, testimonials, faq, contact   | skills, experience                   |
  
  Variant hints:
  - hero: "split" or "centered" for visual brands (food, fashion); "minimalist" for consultants; "background" for general local businesses and events.
  - contact: "form" or "split" when booking/inquiries matter; "minimal" for simple WhatsApp-first pages.
  - projects: "card-grid" for visuals; "list" for services/menus.
  - gallery: "grid" or "masonry" for portfolios; "carousel" for highlights; "before-after" for transformations (e.g., cleaning, weight loss, renovation, beauty results). For "before-after", use "image" for the AFTER result and "image2" for the BEFORE state.
  
  SITE THEME (top-level "theme" string — must be exactly one id from this list):
  Available themes: ${JSON.stringify(themeOptions)}
  
  Pick the single best theme id for this business. Use only ids from that list — never invent a theme name.
  - Food / restaurant / catering       → warm, coral, sunset, espresso, paper
  - Salon / barbershop / beauty        → coral, luxury, warm, mint
  - Retail / fashion / vendor          → coral, luxury, mono, warm, sunset
  - Freelancer / developer / creative  → midnight, dark, nord, dracula, slate, mono
  - Agency / studio                    → ocean, slate, luxury, light, forest
  - Coach / consultant / professional  → light, paper, ocean, slate, warm
  - SaaS / app / digital product       → ocean, midnight, light, mint, nord
  - Eco / wellness / health            → forest, mint, ocean
  - High-end / luxury services         → luxury, mono, dark, espresso
  - Playful / bold creative brands     → cyberpunk, vaporwave, brutalist, coral
  - Events                             → midnight, sunset, luxury, vaporwave, cyberpunk
  - Digital store / info products      → dark, ocean, midnight, slate
  - Default local SMB when unsure      → warm or light
  
  NAVBAR:
  - navbar.links must only point to enabled sections (type "anchor", anchor = that section's anchorName, href "").
  - Keep only 3–5 useful links; remove irrelevant defaults (e.g. GitHub links).
  - navbar.ctaButton: one strong WhatsApp-oriented label matching the business.
  
  WHATSAPP MESSAGES (important):
  - For every linkConfig with "type": "whatsapp" in the output, write a natural, specific message in the "message" field.
  - Messages should feel like a real customer typed them. Keep them under 200 characters.
  - Use the business name and context. E.g. for a food business: "Hi! I saw your jollof rice and I'd like to place an order."
  - For event tickets: "Hi! I'd like to buy a ticket for [event name]. What options are available?"
  - For digital products: "Hi! I'd like to purchase [product name]. Please send payment details."
  - For portfolios: "Hi! I saw your portfolio and I'd love to discuss a project."
  - Never use generic messages like "Hello" or "I am interested" alone.
  
  Every enabled section must read as one cohesive site for "${selectedTitle}" — not disconnected templates. Hero, about, section headings, pricing, FAQ, and CTAs must all reflect the same business voice and offering.
  `;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: systemPrompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const rawContent = response.choices[0].message.content || "{}";
  const aiContent = JSON.parse(rawContent);

  // Check the intentional refusal flag FIRST — the AI sets this explicitly
  // when it determines the requested content is unsafe/prohibited.
  if (aiContent.__refused__ === true) {
    throw new Error("AI_REFUSAL");
  }

  // Validate that all expected schema keys are present
  const schemaKeys = Object.keys(schemaBase);
  const isValid = schemaKeys.every((key) => Object.hasOwn(aiContent, key));

  if (!isValid) {
    throw new Error("Failed to generate with AI.");
  }

  const {
    theme,
    description: siteDescription,
    tags,
    ...siteContent
  } = aiContent;

  const themeId =
    typeof theme === "string" && isValidThemeId(theme) ? theme : defaultThemeId;

  return {
    content: siteContent,
    themeId,
    description: siteDescription ?? "",
    tags: Array.isArray(tags) ? tags : [],
  };
}

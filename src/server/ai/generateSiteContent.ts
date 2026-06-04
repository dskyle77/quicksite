// src/server/ai/generateSiteContent.ts
// UPDATED — pre-flight validation on title/description before AI call;
//           AI now sets __refused__: true intentionally instead of burying text markers.

/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";
import Groq from "groq-sdk";
import { variantOptions } from "@/components/templateBuilder/contentBlocks";
import { getThemeOptionsForAI, isValidThemeId } from "@/lib/themes";
import { injectImageLinks, getAvailableImageNames } from "@/lib/imageLinks";

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

  const availableImageNames = getAvailableImageNames();
  const themeOptions = getThemeOptionsForAI();
const systemPrompt = `
You are QuickSite's AI copywriter for Nigerian small businesses.

Generate complete website content for "${selectedTitle}".
Owner description: "${description}"

## OUTPUT RULES
1. Return ONE valid JSON object matching this schema: ${JSON.stringify(schemaBase)}
   Extra top-level keys required:
   - "description": 1–2 sentence SEO meta description (≤160 chars, benefit-led, no hashtags)
   - "tags": 5–8 lowercase keyword strings (e.g. ["restaurant","lagos","nigerian food"])
   - "__refused__": false (set true ONLY when refusing unsafe content — see Safety)
2. No added/removed/renamed top-level keys.
3. Fill every string with specific copy grounded in the description. No lorem ipsum, no placeholder names.
4. "theme" must be an id from: ${JSON.stringify(themeOptions)}
5. All image fields must use names from AVAILABLE IMAGES below. Pick names that match the business type and what is being shown. Never use real URLs.
6. Return ONLY valid JSON. No markdown, no code fences, no commentary.
7. For all linkConfig with "type":"whatsapp": keep "phone" as-is; write a natural customer message in "message" (≤200 chars, warm, specific to business).

## SAFETY
Refuse adult/erotic/escort/gambling/drugs/weapons/illegal content: set "__refused__": true, fill remaining keys with empty strings/arrays.

## ARRAYS (min → max)
items/dishes: 3–6 | menu: 3–6 | gallery: 4–8 | features/services: 3–6
skills: 4–8 | testimonials: 2–3 | pricing: 2–4 | experience: 2–4 | faq: 3–6
tags per item: 2–4 | navbar.links: 3–5

## BUILDER CONFIG
Allowed variants: ${JSON.stringify(variantOptions)}
- Each section "id" must match its JSON key (type "about" → id "about" → key "about")
- Only modify: variant, enabled, anchorName. Never change id or type.
- navbar.links: only anchor to enabled sections; 3–5 links max

## SECTION ENABLE/DISABLE RULES (SMART GUIDELINES)

The goal is a clean, focused, high-converting website. 
**Enable sections that help the customer understand and take action.** 
**Only disable sections that are genuinely irrelevant or would confuse visitors.**

### Core sections that should almost always stay enabled:
- about, contact, testimonials, navbar, hero, footer

### Decision logic (use this thinking process):
1. Does this section help the customer make a decision or take action? → Enable it.
2. Would a typical customer for this business type expect or benefit from seeing it? → Enable it.
3. Does it feel forced or irrelevant for this specific business? → Disable it.

### Recommended sections by business type (guidelines, not strict rules):

- **Food / Restaurant / Cafe**: about, features, menu/items, testimonials, contact, gallery (optional)
- **Salon / Beauty / Spa**: about, features/services, pricing, gallery, testimonials, contact
- **Retail / Vendor / Shop**: about, items, features, testimonials, contact, gallery
- **Freelancer / Creative / Photographer**: about, skills, items/portfolio, experience, testimonials, contact
- **Agency / Studio**: about, features, items/case studies, testimonials, contact
- **Coach / Consultant / Trainer**: about, features, experience, testimonials, contact, pricing (if applicable)
- **SaaS / App / Digital Product**: features, pricing, faq, testimonials, contact, cta
- **Events / Planner**: about, features, pricing, testimonials, faq, contact
- **Digital Store / Online Shop**: about/text, items, features, testimonials, faq, contact

### Rules for disabling:
- **Only disable** when the section clearly does not fit the business.
  - Never enable "menu" or "dishes" for non-food businesses.
  - Never enable "skills" or "experience" for pure product/retail/salon businesses.
  - Disable "pricing" if the business does not sell packages or has no clear pricing tiers.
  - Disable "gallery" if there are no visual works to show.
  - Disable "faq" unless there are common questions customers ask.
- Do **NOT** disable sections just because they are not in the list above. 
- Do **NOT** disable useful sections to make the site "minimal". 
- When in doubt, **keep the section enabled** — better to have useful content than a half-empty site.

## THEME GUIDE
Food → warm/coral/sunset | Salon → coral/luxury/mint | Retail → coral/luxury/mono
Freelancer → midnight/dark/nord | Agency → ocean/slate/luxury | Coach → light/paper/ocean
SaaS → ocean/midnight/mint | Eco → forest/mint | Luxury → luxury/mono/espresso
Playful → cyberpunk/vaporwave/brutalist | Events → midnight/sunset/vaporwave
Digital store → dark/ocean/midnight | Default → warm or light
Themes available: ${JSON.stringify(themeOptions)}

## COPY & TONE
- Warm, clear Nigerian English. Headlines ≤10 words. Scannable body.
- CTAs: "Chat on WhatsApp", "Order Now", "Book an Appointment", "Get a Quote"
- Prices in ₦ or $ where fitting. Nigerian cities only if they fit the description.
- Navbar title and footer brand: "${selectedTitle}"
- Hero badge: short status line (e.g. "Open for orders", "Accepting bookings")
- Skills "level": number string "1"–"100"
- Testimonials: believable Nigerian full names (e.g. "Chisom Okafor"), realistic roles (e.g. "Regular customer, Lekki")
- Contact email: professional (hello@/contact@/info@ + business slug)

## AVAILABLE IMAGES
Use ONLY names from this list. Pick based on business type and context — match image names to what is actually being shown (e.g. dish images for food, hair images for salons, portfolio images for creatives). Never invent names or use URLs.
${JSON.stringify(availableImageNames)}
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __refused__,
    ...siteContent
  } = aiContent;

  // Inject actual image links to replace placeholder names
  const contentWithImages = injectImageLinks(siteContent);

  const themeId =
    typeof theme === "string" && isValidThemeId(theme) ? theme : defaultThemeId;

  return {
    content: contentWithImages,
    themeId,
    description: siteDescription ?? "",
    tags: Array.isArray(tags) ? tags : [],
  };
}

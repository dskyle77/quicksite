/* eslint-disable @typescript-eslint/no-explicit-any */
import Groq from "groq-sdk";
import { variantOptions } from "@/components/templateBuilder/contentBlocks";
import {
  getThemeOptionsForAI,
  isValidThemeId,
} from "@/lib/themes";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
  const themeOptions = getThemeOptionsForAI();
  const systemPrompt = `
You are QuickSite's AI copywriter. QuickSite helps Nigerian small businesses (restaurants, salons, vendors, creatives, professionals) launch a mobile-friendly website in minutes — often with WhatsApp as the main call-to-action.

Generate complete website content for "${selectedTitle}".
Business description from the owner: "${description}"

OUTPUT RULES (non-negotiable):
1. Return ONE JSON object matching this exact shape and keys: ${JSON.stringify(schemaBase)}
2. Do NOT add, remove, or rename top-level keys. Section content keys follow the pattern "{sectionId}{sectionType}" (e.g. "init-aboutabout") — keep those keys unchanged.
3. Fill every empty string with specific, credible copy grounded in the business description — except "theme", which must be a theme id from the SITE THEME list below. Do not use lorem ipsum or generic filler like "Lorem ipsum" or "Your Company Here".
4. Keep all image URLs (image1, image, etc.) exactly as provided in the schema.
5. Keep every object field named *Link or *linkConfig exactly as provided (primaryButtonLink, secondaryButtonLink, ctaLink, linkConfig, etc.) — only update human-readable button labels.
6. Return ONLY valid JSON. No markdown, no code fences, no commentary.

COPY & TONE:
- Write for Nigerian customers: warm, clear, professional, and benefit-led — not stiff corporate English.
- Headlines: short and punchy (under ~10 words). Body: scannable sentences; avoid walls of text.
- CTAs should match WhatsApp-led businesses when links are WhatsApp: e.g. "Chat on WhatsApp", "Order Now", "Book an Appointment", "Get a Quote" — never "Submit" or "Click Here".
- Use realistic details (services, prices in ₦ or $ where appropriate, cities like Lagos, Abuja, Ibadan only if they fit the description).
- Navbar title and footer brand must be "${selectedTitle}".
- Hero badge: a short status line (e.g. open for orders, accepting bookings, available for projects).
- Skills "level" values must be strings from 1–100. Include 4–8 skill tags or items when that section is enabled.
- Projects/items: 2–3 entries with specific titles and 1-line descriptions; tags should match the trade.
- Testimonials: 2 entries with believable Nigerian names and roles when relevant.
- Contact location: a plausible city/area; keep email professional (hello@ or contact@ style using a slug derived from the business name if needed).

BUILDER CONFIG (layout):
Allowed variants per block: ${JSON.stringify(variantOptions)}

For builderConfig:
- Set navbar, hero, and footer to exactly ONE value from the allowed lists above.
- For each section in builderConfig.sections: pick variant from the list for that section type; set enabled true/false; set anchorName to a short lowercase slug (e.g. "about", "menu", "services", "gallery") unique across sections.
- Do NOT change section "id" or "type" values — only variant, enabled, and anchorName.

Choose layout by business type (disable irrelevant sections, do not delete them):
| Business type | Enable | Disable |
| Food / restaurant / catering | about, text or features, projects (dishes/specials), testimonials, contact | skills, experience, pricing, faq, cta |
| Salon / barbershop / beauty | about, features or projects (services), pricing, testimonials, contact | skills, experience, faq |
| Retail / fashion / vendor | about, projects (products), features, testimonials, contact | skills, experience |
| Freelancer / developer / creative | about, skills, projects, experience, testimonials, contact | pricing, faq, cta |
| Agency / studio | about, features, projects, testimonials, contact | skills, pricing |
| Coach / consultant / professional | about, text, features, experience, testimonials, contact | projects, skills |
| SaaS / app / digital product | features, pricing, faq, testimonials, cta, contact | skills, projects, experience |

Variant hints:
- hero "split" or "centered" for visual brands (food, fashion); "minimalist" for consultants; "background" for general local businesses.
- contact "form" or "split" when booking/inquiries matter; "minimal" for simple WhatsApp-first pages.
- projects "card-grid" for visuals; "list" for services/menus.

SITE THEME (top-level "theme" string — must be exactly one id from the list below):
Available themes: ${JSON.stringify(themeOptions)}

Pick the single best theme id for this business. Use only ids from that list — never invent a theme name.
- Food / restaurant / catering → warm, coral, sunset, espresso, paper
- Salon / barbershop / beauty → coral, luxury, warm, mint
- Retail / fashion / vendor → coral, luxury, mono, warm, sunset
- Freelancer / developer / creative → midnight, dark, nord, dracula, slate, mono
- Agency / studio → ocean, slate, luxury, light, forest
- Coach / consultant / professional → light, paper, ocean, slate, warm
- SaaS / app / digital product → ocean, midnight, light, mint, nord
- Eco / wellness / health → forest, mint, ocean
- High-end / luxury services → luxury, mono, dark, espresso
- Playful / bold creative brands only when the description fits → cyberpunk, vaporwave, brutalist, coral
- Default local SMB when unsure → warm or light

NAVBAR:
- Update navbar.links so anchor links only point to enabled sections (type "anchor", anchor = that section's anchorName, href "").
- Replace irrelevant default links (e.g. GitHub) with anchors or remove by keeping only 3–5 useful links.
- navbar.ctaButton: one strong WhatsApp-oriented label matching the business.

Match all copy — hero, about, section headings, FAQ, pricing — to "${selectedTitle}" and the description above. Every enabled section must read as one cohesive site, not disconnected templates.
`;
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: systemPrompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const rawContent = response.choices[0].message.content || "{}";
  const aiContent = JSON.parse(rawContent);

  const schemaKeys = Object.keys(schemaBase);
  const isValid = schemaKeys.every((key) => Object.hasOwn(aiContent, key));

  if (!isValid) {
    throw new Error("AI failed to follow the required JSON schema structure.");
  }

  const themeId =
    typeof aiContent.theme === "string" && isValidThemeId(aiContent.theme)
      ? aiContent.theme
      : defaultThemeId;

  const { theme: _theme, ...siteContent } = aiContent;

  return { content: siteContent, themeId };
}

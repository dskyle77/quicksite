/* eslint-disable @typescript-eslint/no-explicit-any */
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateSiteContentWithAI({
  selectedTitle,
  description,
  schemaBase,
}: {
  selectedTitle: string;
  description: string;
  schemaBase: any;
}) {
  const systemPrompt = `
  You are a professional web designer and copywriter.
  Return a JSON object for a website named "${selectedTitle}".
  Business Description: "${description}"
  
  STRICT INSTRUCTIONS:
  1. Use this exact JSON structure: ${JSON.stringify(schemaBase)}
  2. Do NOT change the structure or keys.
  3. Fill empty strings with high-converting, creative copy tailored to the business description.
  4. For fields containing variant options, pick exactly ONE value from the allowed list.
  5. Keep all "primaryButtonLink", "secondaryButtonLink", and "ctaLink" fields exactly as provided.
  6. Return ONLY valid JSON — no markdown, no backticks, no explanation.
  
  BUILDCONFIG RULES — read carefully:
  
  The "builderConfig" object controls the entire layout. Choose variants that best match the business type:
  
  GENERAL SECTION GUIDELINES:
  - Only include sections relevant to the business.
  - Set "enabled: false" for optional sections instead of removing them.
  - Each section must have a unique "id" (e.g. "about", "projects", "features-1").
  - Portfolios → Use: about, skills, projects, experience, testimonials, contact
  - SaaS / Landing Pages → Use: features, pricing, testimonials, faq, cta
  - Agencies / Studios → Use: about, features, projects, testimonials, contact
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

  return aiContent;
}

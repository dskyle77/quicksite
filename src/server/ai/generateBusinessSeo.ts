import "server-only";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateBusinessSeo({
  name,
  category,
  description,
  city,
  state,
}: {
  name: string;
  category: string;
  description?: string;
  city?: string;
  state?: string;
}) {
  const prompt = `
You are an SEO expert for Nigerian small businesses.

Generate SEO metadata for this business.

Business name: ${name}
Category: ${category}
Description: ${description || "N/A"}
City: ${city || "Nigeria"}
State: ${state || ""}

RULES:
- Return ONLY valid JSON
- title under 60 chars
- description under 160 chars
- keywords should be an array of 8-10 lowercase keywords, AND must explicitly include the business name (lowercased) as one of the keywords
- make it local and trustworthy
- no hashtags

Return format:
{
  "title": "",
  "description": "",
  "keywords": []
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || "{}";

  const parsed = JSON.parse(raw);

  return {
    title: parsed.title || "",
    description: parsed.description || "",
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
  };
}

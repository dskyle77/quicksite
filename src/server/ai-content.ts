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
  You are a professional web copywriter. 
  Return a JSON object for a website named "${selectedTitle}".
  Business Description: "${description}"

  STRICT INSTRUCTIONS:
  1. Use this exact JSON structure: ${JSON.stringify(schemaBase)}
  2. Do NOT change the structure or keys.
  3. Fill empty strings with high-converting, creative copy based on the description.
  4. Keep "primaryButtonLink" and "secondaryButtonLink" exactly as they are provided in the structure.
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

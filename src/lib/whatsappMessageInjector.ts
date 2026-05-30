// src/lib/whatsappMessageInjector.ts
// Walks site content and replaces whatsapp link messages with AI-generated ones.
// Safe — never removes links, only updates the message text inside them.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { GeneratedWhatsappMessages } from "@/server/ai/generateWhatsappMessages";

/**
 * Builds a WhatsApp href from a phone number and message.
 */
function buildWaLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, "");
  if (!clean) return "#";
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/**
 * Determines the best AI message for a given field key context.
 */
function resolveMessage(
  fieldKey: string,
  messages: GeneratedWhatsappMessages,
): string | null {
  const k = fieldKey.toLowerCase();

  if (k.includes("hero") && k.includes("primary")) return messages.heroPrimary;
  if (k.includes("navbar") || k.includes("ctabutton"))
    return messages.navbarCta;
  if (k.includes("contact") && k.includes("primary"))
    return messages.contactPrimary;
  if (k.includes("ticket"))
    return messages.ticketInquiry || messages.heroPrimary;
  if (k.includes("hire") || k.includes("project"))
    return messages.hireInquiry || messages.heroPrimary;
  if (
    k.includes("item") ||
    k.includes("menu") ||
    k.includes("product") ||
    k.includes("btn")
  ) {
    return messages.itemInquiry || messages.default;
  }

  return null; // Don't override
}

/**
 * Recursively walks the content object.
 * When it finds a linkConfig with type "whatsapp", it updates the message.
 */
function walk(
  obj: any,
  keyPath: string,
  messages: GeneratedWhatsappMessages,
  phone: string,
): any {
  if (!obj || typeof obj !== "object") return obj;

  // Array
  if (Array.isArray(obj)) {
    return obj.map((item, i) => walk(item, `${keyPath}.${i}`, messages, phone));
  }

  const result: any = {};

  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const fullKey = keyPath ? `${keyPath}.${key}` : key;

    // Detect a whatsapp linkConfig object
    if (
      val &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      val.type === "whatsapp" &&
      typeof val.phone === "string"
    ) {
      const aiMessage = resolveMessage(fullKey, messages);
      if (aiMessage) {
        result[key] = {
          ...val,
          message: aiMessage,
        };
      } else {
        result[key] = val;
      }
    } else if (val && typeof val === "object") {
      result[key] = walk(val, fullKey, messages, phone);
    } else {
      result[key] = val;
    }
  }

  return result;
}

/**
 * Main export: injects AI-generated messages into all whatsapp linkConfigs in content.
 * Also patches the default whatsapp helper format (object with type/phone/message).
 */
export function injectWhatsappMessages(
  content: Record<string, any>,
  messages: GeneratedWhatsappMessages,
  phone: string,
): Record<string, any> {
  try {
    return walk(content, "", messages, phone);
  } catch (err) {
    console.error("[injectWhatsappMessages] Failed, returning original:", err);
    return content;
  }
}

/**
 * Build a complete whatsapp linkConfig from phone + AI message key.
 */
export function waLink(
  phone: string,
  message: string,
): { type: "whatsapp"; phone: string; message: string } {
  return {
    type: "whatsapp",
    phone,
    message,
  };
}

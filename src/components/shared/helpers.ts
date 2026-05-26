export const makeWhatsappLink = (phone: string, message: string = "") =>
  phone && phone.trim() !== "" ? { type: "whatsapp", phone, message } : {};

// Accepts args for any link type, returns the correct config object for EditableLink
export function makeCtaLink(
  params:
    | { type: "whatsapp"; phone?: string; message?: string }
    | { type: "anchor"; anchorId?: string }
    | { type: "url"; url?: string },
) {
  if (params.type === "whatsapp") {
    const { phone, message } = params;
    return phone && phone.trim() !== ""
      ? { type: "whatsapp", phone, message }
      : {};
  }
  if (params.type === "anchor") {
    const { anchorId } = params;
    return anchorId ? { type: "anchor", anchorId } : {};
  }
  if (params.type === "url") {
    const { url } = params;
    return url ? { type: "url", url } : {};
  }
  return {};
}

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg";

export const img = (override?: string) => override ?? DEFAULT_IMAGE;
export const year = () => new Date().getFullYear();

import "server-only"

import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { getUserPlan } from "./serverFirestore";
import { canUseFeature, type Plan } from "@/lib/plans";

/**
 * MessageRecord type as returned to clients.
 */
export type MessageRecord = {
  id: string;
  ownerId: string;
  siteSlug: string;
  siteName?: string;
  messageType?: "contact" | "form";
  formTitle?: string;
  fields?: MessageField[];
  name?: string;
  email?: string;
  subject?: string;
  anchorName?: string;
  body: string;
  createdAt: string;
};

export type MessageField = {
  id?: string;
  label: string;
  value: string | string[];
  type?: string;
};

function serializeTimestamp(value: unknown): string {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

export async function submitMessage(input: {
  siteSlug: string;
  messageType?: "contact" | "form";
  formTitle?: string;
  fields?: MessageField[];
  name?: string;
  email?: string;
  subject?: string;
  anchorName?: string;
  body: string;
}): Promise<{ id: string }> {
  const siteSlug = input.siteSlug.trim().toLowerCase();
  const body = input.body?.trim();
  const anchorName = input.anchorName?.trim() || null;

  if (!siteSlug) throw new Error("An Error occured.");
  if (!body) throw new Error("Message is required.");

  const siteDoc = await adminDb.collection("sites").doc(siteSlug).get();
  if (!siteDoc.exists) throw new Error("Site not found.");

  const siteData = siteDoc.data();
  if (siteData?.status !== "published") {
    throw new Error("This site is not accepting messages.");
  }

  const ownerId = siteData?.uid as string | undefined;
  if (!ownerId) throw new Error("Site owner not found.");

  const plan = (await getUserPlan(ownerId)) as Plan;
  if (!canUseFeature(plan, "messages")) {
    throw new Error("Contact forms are not available on this site.");
  }

  const ref = adminDb.collection("messages").doc();
  await ref.set({
    ownerId,
    siteSlug,
    siteName: siteData?.name ?? siteSlug,
    messageType: input.messageType ?? "contact",
    formTitle: input.formTitle?.trim() || null,
    fields: input.fields ?? null,
    name: input.name?.trim() || null,
    email: input.email?.trim() || null,
    subject: input.subject?.trim() || null,
    anchorName,
    body,
    createdAt: FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
}

export async function getMessagesForUser(
  uid: string,
): Promise<MessageRecord[]> {
  const plan = (await getUserPlan(uid)) as Plan;
  if (!canUseFeature(plan, "messages")) {
    return [];
  }

  const snap = await adminDb
    .collection("messages")
    .where("ownerId", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ownerId: data.ownerId,
      siteSlug: data.siteSlug,
      siteName: data.siteName,
      messageType: data.messageType ?? "contact",
      formTitle: data.formTitle ?? undefined,
      fields: Array.isArray(data.fields) ? data.fields : undefined,
      name: data.name ?? undefined,
      email: data.email ?? undefined,
      subject: data.subject ?? undefined,
      anchorName: data.anchorName,
      body: data.body,
      createdAt: serializeTimestamp(data.createdAt),
    };
  });
}

/**
 * Delete a message if it belongs to the specified user.
 *
 * @param uid User ID (must match message owner)
 * @param messageId Message ID to delete
 * @throws If not found, or not authorized
 */
export async function serverDeleteMessage(
  uid: string,
  messageId: string,
): Promise<void> {
  const msgRef = adminDb.collection("messages").doc(messageId);
  const msgSnap = await msgRef.get();

  if (!msgSnap.exists) {
    throw new Error("Message not found.");
  }

  const data = msgSnap.data();
  if (!data || data.ownerId !== uid) {
    throw new Error("Not authorized to delete this message.");
  }

  await msgRef.delete();
}

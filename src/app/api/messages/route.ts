import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import {
  getMessagesForUser,
  submitMessage,
  serverDeleteMessage,
} from "@/server/messages";
import { rateLimits, withRateLimit } from "@/server/rateLimit";
import { getClientIP } from "@/server/ip";

export async function GET() {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { success, reset } = await withRateLimit(
      rateLimits.features.messages,
      user.uid,
    );
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Reset": reset?.toString?.() ?? "" },
        },
      );
    }

    const messages = await getMessagesForUser(user.uid);
    return NextResponse.json({
      messages: messages.map((msg) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        body: msg.body,
        messageType: msg.messageType ?? "contact",
        formTitle: msg.formTitle,
        fields: msg.fields,
        anchorName: msg.anchorName,
        createdAt: msg.createdAt,
        site: msg.siteName ?? msg.siteSlug,
      })),
    });
  } catch (err) {
    console.error("[GET /api/messages]", err);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const ip = await getClientIP();

  const { success, reset } = await withRateLimit(
    rateLimits.features.messages,
    ip,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "X-RateLimit-Reset": reset?.toString?.() ?? "" },
      },
    );
  }
  try {
    const body = await req.json();
    const {
      siteSlug,
      slug,
      name,
      email,
      subject,
      body: messageBody,
      message,
      messageType,
      formTitle,
      fields,
      anchorName,
    } = body;

    const resolvedSlug = (siteSlug ?? slug) as string | undefined;
    const normalizedType = messageType === "form" ? "form" : "contact";
    const normalizedFields =
      normalizedType === "form" && Array.isArray(fields)
        ? fields
            .slice(0, 50)
            .map((field) => {
              const label =
                typeof field?.label === "string" ? field.label.trim() : "";
              const rawValue = field?.value;
              const value = Array.isArray(rawValue)
                ? rawValue
                    .filter((v) => typeof v === "string")
                    .map((v) => v.trim())
                    .filter(Boolean)
                : typeof rawValue === "string"
                  ? rawValue.trim()
                  : "";

              return {
                id: typeof field?.id === "string" ? field.id.slice(0, 80) : "",
                label: label.slice(0, 160),
                value,
                type:
                  typeof field?.type === "string" ? field.type.slice(0, 40) : "",
              };
            })
            .filter((field) => {
              const hasValue = Array.isArray(field.value)
                ? field.value.length > 0
                : field.value.length > 0;
              return field.label && hasValue;
            })
        : undefined;
    const generatedFormBody =
      normalizedFields && normalizedFields.length > 0
        ? normalizedFields
            .map((field) => {
              const value = Array.isArray(field.value)
                ? field.value.join(", ")
                : field.value;
              return `${field.label}: ${value}`;
            })
            .join("\n")
        : undefined;
    const resolvedBody = (messageBody ??
      message ??
      generatedFormBody) as string | undefined;

    // Limit for message length
    const MESSAGE_MAX_LENGTH = 2000;

    if (normalizedType === "form" && !normalizedFields?.length) {
      return NextResponse.json(
        { error: "At least one form answer is required." },
        { status: 400 },
      );
    }
    if (!resolvedBody || typeof resolvedBody !== "string" || resolvedBody.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }
    if (resolvedBody.length > MESSAGE_MAX_LENGTH) {
      return NextResponse.json(
        {
          error: `Message must be no more than ${MESSAGE_MAX_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    const result = await submitMessage({
      siteSlug: resolvedSlug ?? "",
      messageType: normalizedType,
      formTitle: typeof formTitle === "string" ? formTitle : undefined,
      fields: normalizedFields,
      name,
      email,
      subject,
      anchorName,
      body: resolvedBody,
    });

    return NextResponse.json({ success: true, id: result.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";
    const status =
      message === "Site not found."
        ? 404
        : message === "This site is not accepting messages." ||
            message === "Contact forms are not available on this site." ||
            message === "Site is required." ||
            message === "Message is required." ||
            message.startsWith("Message must be no more than ")
          ? 400
          : 500;

    if (status === 500) {
      console.error("[POST /api/messages]", err);
    }

    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required." },
        { status: 400 },
      );
    }

    await serverDeleteMessage(user.uid, id);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";
    const status =
      message === "Not authorized to delete this message."
        ? 403
        : message === "Message not found."
          ? 404
          : 500;

    if (status === 500) {
      console.error("[DELETE /api/messages]", err);
    }

    return NextResponse.json({ error: message }, { status });
  }
}

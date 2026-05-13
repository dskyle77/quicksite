// src/app/api/sites/route.ts
import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { serverCreateSite, getUserPlan } from "@/server/firestore";
import { getTemplateContentByType } from "@/lib/templatesContent";
import { generateSiteContentWithAI } from "@/server/ai-content";

import { aiRateLimiter } from "@/lib/rateLimit";
import type { Plan } from "@/lib/plans";

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      type,
      defaultMessage,
      whatsappNumber,
      description,
      generateWithAI,
    } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: "name, slug, and type are required." },
        { status: 400 },
      );
    }
    if (!description && generateWithAI) {
      return NextResponse.json(
        { error: "Description is required to generate with AI." },
        { status: 400 },
      );
    }

    const normalizedName = (name as string).trim();
    const normalizedSlug = (slug as string).trim();

    const templateEntry = getTemplateContentByType(type);
    if (!templateEntry) {
      return NextResponse.json(
        { error: "Invalid template type." },
        { status: 400 },
      );
    }

    const plan = await getUserPlan(user.uid);

    const defaultImage =
      "https://image-source-sk.vercel.app/projects/default-image.jpg";

    let finalContent = null;
    const schemaBase = templateEntry.getSchema({
      selectedTitle: normalizedName,
      defaultMessage,
      whatsappNumber,
      defaultImage,
    });

    // 1. Try to generate with AI if requested
    if (generateWithAI === true && description && plan !== "free") {
      const { success, reset } = await aiRateLimiter.limit(user.uid);

      if (!success) {
        return NextResponse.json(
          { error: "AI Generation limit reached. Try again in an hour." },
          {
            status: 429,
            headers: { "X-RateLimit-Reset": reset.toString() },
          },
        );
      }
      try {
        finalContent = await generateSiteContentWithAI({
          selectedTitle: normalizedName,
          description,
          schemaBase,
        });
      } catch (error) {
        console.error("AI Generation failed, falling back to default:", error);
        finalContent = null;
      }
    }

    // 2. Fallback: If AI failed or wasn't requested, use the standard template starter
    if (!finalContent) {
      finalContent = templateEntry.getStarterContent({
        selectedTitle: normalizedName,
        defaultMessage,
        whatsappNumber,
      });
    }

    // 3. Create the site in Firestore
    const siteId = await serverCreateSite(
      user.uid,
      (user.plan ?? "free") as Plan,
      {
        slug: normalizedSlug,
        type,
        name: normalizedName,
        theme: templateEntry.config.theme,
        status: "draft",
        content: finalContent, // Use the final merged content
      },
    );

    return NextResponse.json({
      success: true,
      id: siteId,
      slug: normalizedSlug,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";

    // Check for known plan error indicator
    const isPlanError =
      typeof message === "string" &&
      (message.toLowerCase().includes("plan limit") ||
        message.toLowerCase().includes("plan upgrade") ||
        message.toLowerCase().includes("upgrade your plan"));

    return NextResponse.json(
      {
        error: isPlanError
          ? "You've reached your plan limit. Please upgrade your plan to create more sites."
          : message,
      },
      { status: isPlanError ? 403 : 500 },
    );
  }
}

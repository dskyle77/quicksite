// src/app/api/sites/route.ts
// UPDATED — AI-generated WhatsApp messages injected into site content on creation
//           AI_REFUSAL and INVALID_INPUT errors surface as 400s instead of 500s

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import {
  serverCreateSite,
  getUserPlan,
  isSlugTaken,
} from "@/server/serverFirestore";
import { generateSiteContentWithAI } from "@/server/ai/generateSiteContent";
import { generateWhatsappMessages } from "@/server/ai/generateWhatsappMessages";
import {
  isPremiumTemplate,
  getTemplateByType,
  buildSchema,
  buildStarterContent,
} from "@/lib/templates";
import { uploadOgImage } from "@/server/cloudinary";
import { AI_DAILY_LIMITS } from "@/lib/plans";
import {
  AI_HOURLY_LIMITS,
  withRateLimit,
  rateLimits,
} from "@/server/rateLimit";
import { canUseFeature, type Plan } from "@/lib/plans";
import { injectWhatsappMessages } from "@/lib/whatsappMessageInjector";

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseFormFields(formData: FormData) {
  const getString = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : undefined;
  };

  const generateWithAI = (() => {
    const val = formData.get("generateWithAI");
    if (val === "on" || val === "true") return true;
    if (val === "false" || val === null) return false;
    return Boolean(val);
  })();

  return {
    name: getString("name"),
    slug: getString("slug"),
    type: getString("type"),
    whatsappNumber: getString("whatsappNumber"),
    description: getString("description"),
    generateWithAI,
    image: formData.get("image") as File | null,
  };
}

async function checkAiRateLimits(plan: Plan, uid: string) {
  const dailyResult = await withRateLimit(rateLimits.ai.daily[plan], uid);
  if (!dailyResult.success) {
    return {
      allowed: false,
      error: `Daily AI limit reached (${AI_DAILY_LIMITS[plan]}/day). Try again tomorrow.`,
      reset: dailyResult.reset,
    };
  }

  const hourlyResult = await withRateLimit(rateLimits.ai.hourly[plan], uid);
  if (!hourlyResult.success) {
    return {
      allowed: false,
      error: `Hourly AI limit reached (${AI_HOURLY_LIMITS[plan]}/hour). Try again later.`,
      reset: hourlyResult.reset,
    };
  }

  return { allowed: true };
}

async function resolveContent(
  generateWithAI: boolean,
  description: string | undefined,
  plan: Plan,
  uid: string,
  templateEntry: ReturnType<typeof getTemplateByType>,
  normalizedName: string,
  whatsappNumber: string | undefined,
  templateType: string,
) {
  const defaultTheme = templateEntry!.config.theme ?? "warm";
  const schemaBase = buildSchema(templateEntry!.contentConfig, {
    selectedTitle: normalizedName,
    whatsappNumber,
    defaultImage:
      "https://image-source-sk.vercel.app/projects/default-image.jpg",
  });

  // Generate AI WhatsApp messages (always, regardless of AI content toggle)
  let waMessages = null;
  try {
    waMessages = await generateWhatsappMessages({
      businessName: normalizedName,
      businessType: description || templateType,
      description: description || normalizedName,
      templateType,
    });
  } catch (err) {
    console.warn("[sites/route] WhatsApp message generation failed:", err);
  }

  if (generateWithAI && description) {
    if (!canUseFeature(plan, "ai")) {
      return {
        error: "AI content generation is available on Growth and Pro plans.",
        status: 403 as const,
      };
    }

    const rateCheck = await checkAiRateLimits(plan, uid);
    if (!rateCheck.allowed) {
      return {
        error: rateCheck.error!,
        status: 429 as const,
        reset: rateCheck.reset,
      };
    }

    try {
      const aiResult = await generateSiteContentWithAI({
        selectedTitle: normalizedName,
        description,
        schemaBase,
        defaultThemeId: defaultTheme,
      });

      // Inject AI-generated WhatsApp messages into the content
      const contentWithMessages = waMessages
        ? injectWhatsappMessages(
            aiResult.content,
            waMessages,
            whatsappNumber || "",
          )
        : aiResult.content;

      return {
        content: contentWithMessages,
        themeId: aiResult.themeId,
        description: aiResult.description,
        tags: aiResult.tags,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage === "AI_REFUSAL" ||
        errorMessage.startsWith("INVALID_INPUT:")
      ) {
        // Safety refusal or bad input — re-throw so the outer handler returns
        // a proper 400. Do NOT silently fall back to starter content.
        throw error;
      }

      // Any other AI error (timeout, parse failure, etc.) — fall back gracefully
      console.error(
        "[sites/route] AI generation failed, falling back to default:",
        error,
      );
    }
  }

  // Fallback to starter content (generic safe content)
  const starterContent = templateEntry?.starterContent
    ? templateEntry.starterContent({
        selectedTitle: normalizedName,
        whatsappNumber,
      })
    : buildStarterContent(templateEntry!.contentConfig, {
        selectedTitle: normalizedName,
        whatsappNumber,
      });

  // Inject AI WhatsApp messages into starter content too
  const contentWithMessages = waMessages
    ? injectWhatsappMessages(starterContent, waMessages, whatsappNumber || "")
    : starterContent;

  return {
    content: contentWithMessages,
    themeId: defaultTheme,
    description,
    tags: [],
  };
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();
    const {
      name,
      slug,
      type,
      whatsappNumber,
      description,
      generateWithAI,
      image,
    } = parseFormFields(formData);

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

    const templateEntry = getTemplateByType(type);
    if (!templateEntry) {
      return NextResponse.json(
        { error: "Invalid template type." },
        { status: 400 },
      );
    }

    const plan = (await getUserPlan(user.uid)) as Plan;

    if (isPremiumTemplate(type) && !(plan === "growth" || plan === "pro")) {
      return NextResponse.json(
        {
          error:
            "This template is available only on Growth and Pro plans. Please upgrade to use it.",
        },
        { status: 403 },
      );
    }

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim();

    const imageUrl = image
      ? await uploadOgImage(image, user.uid, normalizedSlug)
      : undefined;

    const contentResult = await resolveContent(
      generateWithAI,
      description,
      plan,
      user.uid,
      templateEntry,
      normalizedName,
      whatsappNumber,
      type,
    );

    if ("error" in contentResult) {
      return NextResponse.json(
        { error: contentResult.error },
        {
          status: contentResult.status,
          headers: contentResult.reset
            ? { "X-RateLimit-Reset": contentResult.reset.toString() }
            : undefined,
        },
      );
    }

    const siteId = await serverCreateSite(
      user.uid,
      (user.plan ?? "free") as Plan,
      {
        slug: normalizedSlug,
        type,
        name: normalizedName,
        theme: contentResult.themeId,
        description: contentResult.description,
        tags: contentResult.tags,
        whatsappNumber,
        status: "draft",
        content: contentResult.content,
        ogImage: imageUrl,
      },
    );

    return NextResponse.json({
      success: true,
      id: siteId,
      slug: normalizedSlug,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";

    // Safety refusal from preflightCheck or AI __refused__ flag
    if (message === "AI_REFUSAL") {
      return NextResponse.json(
        { error: "This type of business is not supported." },
        { status: 400 },
      );
    }

    // Input validation errors from preflightCheck
    if (message.startsWith("INVALID_INPUT:")) {
      return NextResponse.json(
        { error: message.replace("INVALID_INPUT: ", "") },
        { status: 400 },
      );
    }

    const isPlanError =
      message.toLowerCase().includes("plan limit") ||
      message.toLowerCase().includes("plan upgrade") ||
      message.toLowerCase().includes("upgrade your plan");

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

export async function GET(req: Request) {
  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Slug is required." }, { status: 400 });
  }

  const isAvailable = await isSlugTaken(slug, user.uid);
  return NextResponse.json({ available: !isAvailable });
}

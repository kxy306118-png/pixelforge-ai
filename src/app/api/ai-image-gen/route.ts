import { NextRequest, NextResponse } from "next/server";
import { checkAndReserveUsage, finalizeUsage, refundUsage, usageErrorResponse, usageErrorStatus } from "@/lib/usage";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { moderateContent } from "@/lib/moderation";
import { runReplicateModel } from "@/lib/replicate";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, RATE_LIMITS.ai);
    if (limited) return limited;

    const usage = await checkAndReserveUsage();
    if (!usage.allowed) {
      const err = usageErrorResponse(usage);
      return NextResponse.json(err, { status: usageErrorStatus(usage) });
    }

    const { prompt, style } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "Please provide a prompt." }, { status: 400 });
    }
    if (prompt.length > 1000) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "Prompt too long (max 1000 characters)." }, { status: 400 });
    }

    const moderation = await moderateContent(prompt, "text_to_image");
    if (!moderation.allowed) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: moderation.reason || "Content policy violation." }, { status: 403 });
    }

    const modelId = style === "anime" ? "stability-ai/sdxl" : "black-forest-labs/flux-schnell";

    const result = await runReplicateModel(modelId, {
      prompt: prompt.trim(),
      num_outputs: 1,
    });

    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    if (!imageUrl) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "No image was generated." }, { status: 500 });
    }

    await finalizeUsage(usage.userId || "anonymous", "ai-image-gen", "AI Image Generation");
    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Generation failed";
    console.error("AI Image Gen error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

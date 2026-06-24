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

    const { prompt, duration } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "Please provide a prompt." }, { status: 400 });
    }

    const moderation = await moderateContent(prompt, "text_to_video");
    if (!moderation.allowed) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: moderation.reason || "Content policy violation." }, { status: 403 });
    }

    const result = await runReplicateModel("minimax/video-01", { prompt: prompt.trim() });
    const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    await finalizeUsage(usage.userId || "anonymous", "text-to-video", "Text to Video");
    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error("TTV error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Video generation failed" }, { status: 500 });
  }
}

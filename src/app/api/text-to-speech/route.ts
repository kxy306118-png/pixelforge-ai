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

    const { text, voice } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "Please provide text." }, { status: 400 });
    }

    const moderation = await moderateContent(text, "text");
    if (!moderation.allowed) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: moderation.reason || "Content policy violation." }, { status: 403 });
    }

    const result = await runReplicateModel("suno-ai/bark", { text: text.trim() });
    const audioUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    await finalizeUsage(usage.userId || "anonymous", "text-to-speech", "Text to Speech");
    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "TTS failed" }, { status: 500 });
  }
}

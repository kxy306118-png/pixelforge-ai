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

    const usage = await checkAndReserveUsage("ai-writer");
    if (!usage.allowed) {
      const err = usageErrorResponse(usage);
      return NextResponse.json(err, { status: usageErrorStatus(usage) });
    }

    const { prompt, tone, language } = await req.json();
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      await refundUsage(usage.userId, usage.creditsCharged);
      return NextResponse.json({ error: "Please provide a prompt." }, { status: 400 });
    }

    const moderation = await moderateContent(prompt, "text");
    if (!moderation.allowed) {
      await refundUsage(usage.userId, usage.creditsCharged);
      return NextResponse.json({ error: moderation.reason || "Content policy violation." }, { status: 403 });
    }

    const toneInstruction = tone === "professional" ? "Write in a professional tone."
      : tone === "creative" ? "Write in a creative and engaging tone."
      : "Write in a clear and concise tone.";
    const langInstruction = language === "zh" ? "Respond in Chinese (Simplified)."
      : language === "es" ? "Respond in Spanish."
      : "Respond in English.";

    const result = await runReplicateModel("meta/llama-3.1-8b-instruct", {
      prompt: `${toneInstruction}\n${langInstruction}\n\n${prompt}`,
      max_tokens: 1024,
    });

    const text = Array.isArray(result.output) ? result.output.join("") : result.output || "";

    await finalizeUsage(usage.userId || "anonymous", "ai-writer", "AI Writer");

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI writing failed";
    console.error("AI Writer error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

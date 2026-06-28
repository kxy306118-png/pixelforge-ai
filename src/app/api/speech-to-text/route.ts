import { NextRequest, NextResponse } from "next/server";
import { checkAndReserveUsage, finalizeUsage, refundUsage, usageErrorResponse, usageErrorStatus } from "@/lib/usage";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { runReplicateModel } from "@/lib/replicate";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, RATE_LIMITS.ai);
    if (limited) return limited;

    const usage = await checkAndReserveUsage("speech-to-text");
    if (!usage.allowed) {
      const err = usageErrorResponse(usage);
      return NextResponse.json(err, { status: usageErrorStatus(usage) });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    if (!audioFile) {
      await refundUsage(usage.userId, usage.creditsCharged);
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
    }

    const bytes = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${audioFile.type};base64,${base64Audio}`;

    const result = await runReplicateModel("openai/whisper", { audio: dataUri });
    const text = result.output?.text || (typeof result.output === "string" ? result.output : JSON.stringify(result.output));

    await finalizeUsage(usage.userId || "anonymous", "speech-to-text", "Speech to Text");
    return NextResponse.json({ text });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Transcription failed" }, { status: 500 });
  }
}

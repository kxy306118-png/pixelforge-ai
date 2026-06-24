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

    const usage = await checkAndReserveUsage();
    if (!usage.allowed) {
      const err = usageErrorResponse(usage);
      return NextResponse.json(err, { status: usageErrorStatus(usage) });
    }

    const formData = await req.formData();
    const videoFile = formData.get("video") as File | null;
    const language = (formData.get("language") as string) || "en";

    if (!videoFile) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "No video file provided." }, { status: 400 });
    }

    const bytes = await videoFile.arrayBuffer();
    const base64Video = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${videoFile.type};base64,${base64Video}`;

    // Use Whisper for transcription (subtitle generation)
    const result = await runReplicateModel("openai/whisper", { audio: dataUri });
    const subtitles = typeof result.output === "string" ? result.output : JSON.stringify(result.output);

    await finalizeUsage(usage.userId || "anonymous", "video-subtitle", "Video Subtitle");
    return NextResponse.json({ subtitles });
  } catch (error) {
    console.error("Video subtitle error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Subtitle generation failed" }, { status: 500 });
  }
}

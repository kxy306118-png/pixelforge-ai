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
    const imageFile = formData.get("image") as File | null;
    if (!imageFile) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64Image}`;

    const result = await runReplicateModel("stability-ai/stable-video-diffusion", { frame: dataUri });
    const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    await finalizeUsage(usage.userId || "anonymous", "image-to-video", "Image to Video");
    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error("ITV error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Video generation failed" }, { status: 500 });
  }
}

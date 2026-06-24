import { NextRequest, NextResponse } from "next/server";
import { checkAndReserveUsage, finalizeUsage, refundUsage, usageErrorResponse, usageErrorStatus } from "@/lib/usage";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
    const buffer = Buffer.from(bytes);

    if (buffer.length > MAX_FILE_SIZE) {
      await refundUsage(usage.userId);
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    // Enhance using sharp: sharpen + increase brightness/saturation
    const sharp = (await import("sharp")).default;
    const metadata = await sharp(buffer).metadata();
    const targetWidth = metadata.width || 1920;

    const resultBuffer = await sharp(buffer)
      .resize(targetWidth, null, { withoutEnlargement: true })
      .sharpen({ sigma: 1.5, m1: 1, m2: 0.5 })
      .modulate({ brightness: 1.05, saturation: 1.1 })
      .jpeg({ quality: 95 })
      .toBuffer();

    await finalizeUsage(usage.userId || "anonymous", "enhance", "Image Enhance");

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": 'attachment; filename="enhanced.jpg"',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Enhancement failed";
    console.error("Enhance error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

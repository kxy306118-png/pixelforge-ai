import { NextRequest, NextResponse } from "next/server";
import { checkAndReserveUsage, finalizeUsage, refundUsage, usageErrorResponse, usageErrorStatus } from "@/lib/usage";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const IMAGE_MAGIC_BYTES: Record<string, number[]> = {
  png: [0x89, 0x50, 0x4e, 0x47],
  jpeg: [0xff, 0xd8, 0xff],
  webp: [0x52, 0x49, 0x46, 0x46],
  gif: [0x47, 0x49, 0x46, 0x38],
};

function isValidImage(buffer: Buffer): boolean {
  for (const magic of Object.values(IMAGE_MAGIC_BYTES)) {
    if (buffer.length >= magic.length && magic.every((byte, i) => buffer[i] === byte)) {
      if (magic === IMAGE_MAGIC_BYTES.webp) {
        return buffer.length >= 12 && buffer.slice(8, 12).toString("ascii") === "WEBP";
      }
      return true;
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  let reserved = false;
  let userId: string | undefined;
  try {
    // Rate limit
    const limited = rateLimit(req, RATE_LIMITS.ai);
    if (limited) return limited;

    // Atomic check-and-reserve
    const usageCheck = await checkAndReserveUsage();
    if (!usageCheck.allowed) {
      return NextResponse.json(usageErrorResponse(usageCheck), { status: usageErrorStatus(usageCheck) });
    }
    reserved = true;
    userId = usageCheck.userId;

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      await refundUsage(userId!);
      return NextResponse.json({ error: "Invalid request. Please upload a file." }, { status: 400 });
    }

    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const scale = (formData.get("scale") as string) || "2";

    if (!imageFile) {
      await refundUsage(userId!);
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }
    if (!imageFile.type.startsWith("image/")) {
      await refundUsage(userId!);
      return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
    }
    if (imageFile.size > MAX_FILE_SIZE) {
      await refundUsage(userId!);
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    const scaleNum = parseInt(scale);
    if (Number.isNaN(scaleNum) || ![2, 3, 4].includes(scaleNum)) {
      await refundUsage(userId!);
      return NextResponse.json({ error: "Scale must be 2, 3, or 4." }, { status: 400 });
    }

    // Validate magic bytes
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!isValidImage(buffer)) {
      await refundUsage(userId!);
      return NextResponse.json({ error: "Invalid image file." }, { status: 400 });
    }

    // Validate dimensions
    try {
      const metadata = await sharp(buffer, { limitInputPixels: 100000000 }).metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error("Invalid image");
      }
    } catch {
      await refundUsage(userId!);
      return NextResponse.json({ error: "The uploaded file is not a valid image." }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      await refundUsage(userId!);
      return NextResponse.json({ error: "AI service not configured." }, { status: 503 });
    }

    const Replicate = (await import("replicate")).default;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const base64 = buffer.toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64}`;

    const output = await replicate.run(
      "nightmareai/real-esrgan:b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8",
      { input: { image: dataUri, scale: scaleNum, face_enhance: true } }
    );

    let resultUrl: string;
    if (Array.isArray(output)) {
      resultUrl = output[0] as string;
    } else if (typeof output === "string") {
      resultUrl = output;
    } else if (typeof output === "object" && output !== null && "url" in output) {
      resultUrl = (output as { url: string }).url;
    } else {
      throw new Error("Unexpected output format");
    }

    const resultResp = await fetch(resultUrl);
    if (!resultResp.ok) throw new Error("Failed to download processed image");
    const resultBuffer = await resultResp.arrayBuffer();

    if (resultBuffer.byteLength > MAX_FILE_SIZE * 2) {
      throw new Error("Result image too large");
    }

    await finalizeUsage(userId!, "upscale", "AI Image Upscale");

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="upscaled-${scale}x.png"`,
        "X-Original-Size": imageFile.size.toString(),
        "X-Result-Size": resultBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    if (reserved && userId) {
      await refundUsage(userId);
    }
    const message = error instanceof Error ? error.message : "Failed to upscale image";
    console.error("Upscale error:", error);
    if (message.includes("401") || message.includes("Unauthorized")) {
      return NextResponse.json({ error: "AI service unavailable." }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

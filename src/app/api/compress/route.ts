import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const quality = parseInt((formData.get("quality") as string) || "80");

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided. Please upload an image file." }, { status: 400 });
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 });
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    if (quality < 1 || quality > 100) {
      return NextResponse.json({ error: "Quality must be between 1 and 100." }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify it's a valid image by getting metadata
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      return NextResponse.json({ error: "Could not read image dimensions. File may be corrupted." }, { status: 400 });
    }

    const resultBuffer = await sharp(buffer)
      .webp({ quality, effort: 6 })
      .toBuffer();

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": 'attachment; filename="compressed.webp"',
        "X-Original-Size": bytes.byteLength.toString(),
        "X-Result-Size": resultBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to compress image";
    console.error("Compress error:", error);

    if (message.includes("unsupported image format") || message.includes("Input buffer contains unsupported image format")) {
      return NextResponse.json({ error: "Unsupported image format. Please use PNG, JPG, or WebP." }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

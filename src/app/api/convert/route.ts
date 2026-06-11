import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const outputFormats: Record<string, { format: string; contentType: string; ext: string }> = {
  png: { format: "png", contentType: "image/png", ext: "png" },
  jpeg: { format: "jpeg", contentType: "image/jpeg", ext: "jpg" },
  webp: { format: "webp", contentType: "image/webp", ext: "webp" },
  avif: { format: "avif", contentType: "image/avif", ext: "avif" },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const targetFormat = ((formData.get("format") as string) || "png").toLowerCase();

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided. Please upload an image file." }, { status: 400 });
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 });
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const fmt = outputFormats[targetFormat];
    if (!fmt) {
      return NextResponse.json(
        { error: `Unsupported format: ${targetFormat}. Supported: png, jpeg, webp, avif` },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify input is valid image
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format) {
      return NextResponse.json({ error: "Could not read image. File may be corrupted." }, { status: 400 });
    }

    let pipeline = sharp(buffer);
    switch (fmt.format) {
      case "jpeg":
        pipeline = pipeline.jpeg({ quality: 90 });
        break;
      case "png":
        pipeline = pipeline.png({ compressionLevel: 6 });
        break;
      case "webp":
        pipeline = pipeline.webp({ quality: 90 });
        break;
      case "avif":
        pipeline = pipeline.avif({ quality: 80 });
        break;
    }

    const resultBuffer = await pipeline.toBuffer();

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": fmt.contentType,
        "Content-Disposition": `attachment; filename="converted.${fmt.ext}"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to convert image";
    console.error("Convert error:", error);

    if (message.includes("unsupported image format") || message.includes("Input buffer contains unsupported image format")) {
      return NextResponse.json({ error: "Unsupported image format. Please use PNG, JPG, or WebP." }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

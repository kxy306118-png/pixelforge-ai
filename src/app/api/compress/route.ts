import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const quality = parseInt((formData.get("quality") as string) || "80");

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine output format — always convert to WebP for best compression
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

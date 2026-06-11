import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_DIMENSION = 10000;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const width = formData.get("width") as string;
    const height = formData.get("height") as string;
    const fit = (formData.get("fit") as string) || "cover";

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided. Please upload an image file." }, { status: 400 });
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 });
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    if (!width && !height) {
      return NextResponse.json(
        { error: "Provide at least a width or height value." },
        { status: 400 }
      );
    }

    const w = width ? parseInt(width) : undefined;
    const h = height ? parseInt(height) : undefined;

    if (w && (w < 1 || w > MAX_DIMENSION)) {
      return NextResponse.json({ error: `Width must be between 1 and ${MAX_DIMENSION}.` }, { status: 400 });
    }
    if (h && (h < 1 || h > MAX_DIMENSION)) {
      return NextResponse.json({ error: `Height must be between 1 and ${MAX_DIMENSION}.` }, { status: 400 });
    }

    const validFits = ["cover", "contain", "fill", "inside", "outside"];
    if (!validFits.includes(fit)) {
      return NextResponse.json({ error: `Invalid fit mode: ${fit}. Use: ${validFits.join(", ")}` }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resizeOptions: sharp.ResizeOptions = {
      width: w,
      height: h,
      fit: fit as keyof sharp.FitEnum,
      withoutEnlargement: true,
    };

    const resultBuffer = await sharp(buffer)
      .resize(resizeOptions)
      .webp({ quality: 90 })
      .toBuffer();

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": 'attachment; filename="resized.webp"',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to resize image";
    console.error("Resize error:", error);

    if (message.includes("unsupported image format") || message.includes("Input buffer contains unsupported image format")) {
      return NextResponse.json({ error: "Unsupported image format. Please use PNG, JPG, or WebP." }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

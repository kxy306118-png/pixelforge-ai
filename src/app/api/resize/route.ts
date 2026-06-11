import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const width = formData.get("width") as string;
    const height = formData.get("height") as string;
    const fit = (formData.get("fit") as string) || "cover";

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!width && !height) {
      return NextResponse.json(
        { error: "Provide at least width or height" },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resizeOptions: sharp.ResizeOptions = {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

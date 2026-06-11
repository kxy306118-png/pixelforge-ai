import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const scale = formData.get("scale") as string || "2";

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided. Please upload an image file." }, { status: 400 });
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image (PNG, JPG, or WebP)." }, { status: 400 });
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const scaleNum = parseInt(scale);
    if (![2, 3, 4].includes(scaleNum)) {
      return NextResponse.json({ error: "Invalid scale. Must be 2, 3, or 4." }, { status: 400 });
    }

    const Replicate = (await import("replicate")).default;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64}`;

    const output = await replicate.run(
      "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      {
        input: {
          image: dataUri,
          scale: scaleNum,
          face_enhance: true,
        },
      }
    );

    // Handle different output formats
    let resultUrl: string;
    if (Array.isArray(output)) {
      resultUrl = output[0] as string;
    } else if (typeof output === "string") {
      resultUrl = output;
    } else if (typeof output === "object" && output !== null && "url" in output) {
      resultUrl = (output as { url: string }).url;
    } else {
      throw new Error("Unexpected output format from AI model");
    }

    const resultResp = await fetch(resultUrl);
    if (!resultResp.ok) {
      throw new Error("Failed to download processed image");
    }
    const resultBuffer = await resultResp.arrayBuffer();

    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="upscaled-${scale}x.png"`,
        "X-Original-Size": imageFile.size.toString(),
        "X-Result-Size": resultBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upscale image";
    console.error("Upscale error:", error);

    if (message.includes("401") || message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "AI service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

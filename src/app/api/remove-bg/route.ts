import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided. Please upload an image file." }, { status: 400 });
    }

    // Validate file type
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Please upload an image (PNG, JPG, or WebP)." }, { status: 400 });
    }

    // Validate file size
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    const Replicate = (await import("replicate")).default;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    // Convert file to data URI for Replicate
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64}`;

    const output = await replicate.run(
      "cjwbw/rembg:fb8cfc3924c8f0e1c6a6d7c5e4d3b2a109876543210fedcba0987654321abcde",
      { input: { image: dataUri } }
    );

    // Handle different output formats (URL string or array of URLs)
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
        "Content-Disposition": 'attachment; filename="removed-bg.png"',
        "X-Original-Size": imageFile.size.toString(),
        "X-Result-Size": resultBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to remove background";
    console.error("Remove BG error:", error);

    // Give user-friendly error messages
    if (message.includes("401") || message.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "AI service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

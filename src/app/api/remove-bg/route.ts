import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const Replicate = (await import("replicate")).default;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    // Convert file to data URI
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64}`;

    const output = await replicate.run(
      "lucataco/remove-bg:bfa685a6cb7e0a9c2ebb5eafb6de88d49d7d3e1a77f6b8d5b71d6a7b2c8d0e4f",
      {
        input: { image: dataUri },
      }
    );

    // output is a URL string
    const resultUrl = output as unknown as string;

    // Fetch the result and proxy it
    const resultResp = await fetch(resultUrl);
    const resultBuffer = await resultResp.arrayBuffer();

    return new NextResponse(resultBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="removed-bg.png"',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to remove background";
    console.error("Remove BG error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const scale = formData.get("scale") as string || "2";

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const Replicate = (await import("replicate")).default;
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64}`;

    const output = await replicate.run(
      "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      {
        input: {
          image: dataUri,
          scale: parseInt(scale),
          face_enhance: true,
        },
      }
    );

    const resultUrl = output as unknown as string;
    const resultResp = await fetch(resultUrl);
    const resultBuffer = await resultResp.arrayBuffer();

    return new NextResponse(resultBuffer, {
      headers: {
        "Content-Type": imageFile.type || "image/png",
        "Content-Disposition": `attachment; filename="upscaled-${scale}x.png"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upscale image";
    console.error("Upscale error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

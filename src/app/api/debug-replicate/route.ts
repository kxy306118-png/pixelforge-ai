import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return NextResponse.json({ error: "no token" });

  const replicate = new Replicate({ auth: token });

  // Test 1: Try replicate.run with model name
  try {
    const result = await replicate.run(
      "meta/meta-llama-3.1-8b-instruct" as any,
      { input: { prompt: "Say hello" } }
    );
    return NextResponse.json({ test: "run()", success: true, result: String(result).substring(0, 200) });
  } catch (e: any) {
    // Test 2: Try predictions.create with version
    try {
      const prediction = await replicate.predictions.create({
        version: "meta/meta-llama-3.1-8b-instruct" as any,
        input: { prompt: "Say hello" },
      });
      return NextResponse.json({
        test: "run()",
        error: e.message?.substring(0, 200),
        test2: "predictions.create()",
        prediction: { status: prediction.status, id: prediction.id }
      });
    } catch (e2: any) {
      return NextResponse.json({
        test1_error: e.message?.substring(0, 200),
        test2_error: e2.message?.substring(0, 200),
      });
    }
  }
}

import { NextResponse } from "next/server";
import Replicate from "replicate";

export const dynamic = "force-dynamic";

export async function GET() {
  return POST();
}

export async function POST() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return NextResponse.json({ error: "no token" });

  const replicate = new Replicate({ auth: token });

  // Test 1: Try replicate.run
  try {
    const result = await replicate.run(
      "meta/meta-llama-3.1-8b-instruct" as any,
      { input: { prompt: "Say hello" } }
    );
    return NextResponse.json({ success: true, method: "run()", result: String(result).substring(0, 200) });
  } catch (e: any) {
    // Test 2: Get model versions to find correct hash
    try {
      const model = await replicate.models.get("meta", "meta-llama-3.1-8b-instruct");
      const versions = await model.versions();
      const latestVersion = versions.results?.[0]?.id;

      // Try with version
      if (latestVersion) {
        const pred = await replicate.predictions.create({
          version: `${model.id}/${latestVersion}` as any,
          input: { prompt: "Say hello" },
        });
        return NextResponse.json({
          run_error: e.message?.substring(0, 100),
          model_id: model.id,
          version: latestVersion?.substring(0, 20),
          prediction_status: pred.status,
          prediction_id: pred.id,
        });
      }
      return NextResponse.json({
        run_error: e.message?.substring(0, 100),
        model_data: JSON.stringify(model).substring(0, 200),
      });
    } catch (e2: any) {
      return NextResponse.json({
        run_error: e.message?.substring(0, 100),
        model_error: e2.message?.substring(0, 100),
      });
    }
  }
}

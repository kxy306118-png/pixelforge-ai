/**
 * Replicate API helper — uses raw fetch for maximum compatibility.
 * No dependency on the replicate npm SDK (avoids version issues).
 */

export interface ReplicateResult {
  output: any;
  status: string;
  error?: string;
}

const REPLICATE_BASE = "https://api.replicate.com/v1";

/**
 * Run a Replicate model and wait for the result.
 * Uses the model-specific predictions endpoint with polling.
 *
 * @param modelId - e.g. "meta/llama-3.1-8b-instruct" (owner/name format)
 * @param input - model input parameters
 * @param timeoutMs - max time to wait (default 120s)
 */
export async function runReplicateModel(
  modelId: string,
  input: Record<string, any>,
  timeoutMs: number = 120000
): Promise<ReplicateResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("AI service is not configured. Please try again later.");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Prefer: "wait",
  };

  // Create prediction via model-specific endpoint
  const startResp = await fetch(
    `${REPLICATE_BASE}/models/${modelId}/predictions`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ input }),
    }
  );

  if (!startResp.ok) {
    const errText = await startResp.text().catch(() => "");
    console.error(`[replicate] ${modelId} start error:`, startResp.status, errText);

    if (startResp.status === 402) {
      throw new Error("AI service credits are temporarily unavailable. Please try again later.");
    }
    if (startResp.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }
    if (startResp.status === 404) {
      throw new Error(`AI model not found (${modelId}). Please contact support.`);
    }
    throw new Error(`AI request failed (${startResp.status}). Please try again.`);
  }

  let prediction = await startResp.json();

  // Handle immediate completion (Prefer: wait)
  if (prediction.status === "succeeded" || prediction.status === "failed" || prediction.status === "canceled") {
    if (prediction.status !== "succeeded") {
      throw new Error("AI processing failed. Please try again with different input.");
    }
    return { output: prediction.output, status: prediction.status };
  }

  // Poll for result
  const getResultUrl = prediction.urls?.get || `${REPLICATE_BASE}/predictions/${prediction.id}`;
  const startTime = Date.now();

  while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error("AI processing timed out. Please try again.");
    }

    await new Promise((r) => setTimeout(r, 2000));

    const pollResp = await fetch(getResultUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (pollResp.ok) {
      prediction = await pollResp.json();
    }
  }

  if (prediction.status === "failed") {
    throw new Error("AI processing failed. Please try again with different input.");
  }

  return { output: prediction.output, status: prediction.status };
}

/**
 * Replicate API helper.
 * Uses model-specific endpoint for correct API format.
 */

const REPLICATE_BASE = "https://api.replicate.com/v1";

export interface ReplicateResult {
  output: any;
  status: string;
  error?: string;
}

/**
 * Run a Replicate model and wait for the result.
 * Uses the model-specific predictions endpoint.
 *
 * @param modelId - e.g. "black-forest-labs/flux-schnell"
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
  };

  // Try with Prefer: wait for sync response (up to ~60s)
  headers["Prefer"] = "wait";

  // Use the model-specific predictions endpoint
  const startResp = await fetch(
    `${REPLICATE_BASE}/models/${modelId}/predictions`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ input }),
    }
  );

  // If model-specific endpoint fails, try the generic predictions endpoint
  if (!startResp.ok && startResp.status === 500) {
    console.log(`[replicate] Retrying with generic predictions endpoint for ${modelId}`);
    const retryResp = await fetch(`${REPLICATE_BASE}/predictions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ model: modelId, input }),
    });

    if (retryResp.ok) {
      const prediction = await retryResp.json();
      if (prediction.status === "succeeded") {
        return { output: prediction.output, status: prediction.status };
      }
      // Fall through to polling
      const getResultUrl = prediction.urls?.get || `${REPLICATE_BASE}/predictions/${prediction.id}`;
      const startTime = Date.now();
      let p = prediction;
      while (p.status !== "succeeded" && p.status !== "failed" && p.status !== "canceled") {
        if (Date.now() - startTime > timeoutMs) throw new Error("AI processing timed out.");
        await new Promise((r) => setTimeout(r, 2000));
        const pollResp = await fetch(getResultUrl, { headers: { Authorization: `Bearer ${token}` } });
        if (pollResp.ok) p = await pollResp.json();
      }
      if (p.status === "failed") throw new Error("AI processing failed.");
      return { output: p.output, status: p.status };
    }
  }

  if (!startResp.ok) {
    const errText = await startResp.text().catch(() => "");
    console.error(`[replicate] ${modelId} start error:`, startResp.status, errText);

    // User-friendly error messages
    if (startResp.status === 402) {
      throw new Error("AI service credits are temporarily unavailable. Please try again later.");
    }
    if (startResp.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }
    throw new Error(`AI request failed (${startResp.status}). Please try again.`);
  }

  let prediction = await startResp.json();

  // If we got a completed response via Prefer: wait, return immediately
  if (prediction.status === "succeeded" || prediction.status === "failed" || prediction.status === "canceled") {
    if (prediction.status === "failed") {
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

    if (!pollResp.ok) {
      console.error(`[replicate] poll error:`, pollResp.status);
      continue;
    }

    prediction = await pollResp.json();
  }

  if (prediction.status === "failed") {
    throw new Error("AI processing failed. Please try again with different input.");
  }

  return { output: prediction.output, status: prediction.status };
}

/**
 * Replicate API helper.
 * Uses the official replicate npm package with version hashes for reliability.
 */

import Replicate from "replicate";

export interface ReplicateResult {
  output: any;
  status: string;
  error?: string;
}

let _replicate: Replicate | null = null;

function getClient(): Replicate {
  if (_replicate) return _replicate;
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("AI service is not configured. Please try again later.");
  }
  _replicate = new Replicate({ auth: token });
  return _replicate;
}

/**
 * Run a Replicate model using the official npm package.
 * Uses replicate.run() with owner/name format — the SDK auto-resolves
 * the latest version internally.
 *
 * @param modelId - e.g. "meta/llama-3.1-8b-instruct" (owner/name format)
 * @param input - model input parameters
 */
export async function runReplicateModel(
  modelId: string,
  input: Record<string, any>,
  _timeoutMs: number = 120000
): Promise<ReplicateResult> {
  const replicate = getClient();

  try {
    const output = await replicate.run(modelId as any, { input });
    return { output, status: "succeeded" };
  } catch (error) {
    console.error(`[replicate] ${modelId} failed:`, error);

    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("402") || message.includes("credits")) {
      throw new Error("AI service credits are temporarily unavailable. Please try again later.");
    }
    if (message.includes("429") || message.includes("rate")) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }

    throw new Error(`AI request failed. Please try again later. (${message.substring(0, 80)})`);
  }
}

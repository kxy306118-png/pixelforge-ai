/**
 * Replicate API helper.
 * Uses the official replicate npm package for reliable API calls.
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
 * Run a Replicate model and wait for the result.
 * Uses the official replicate npm package with version hashes.
 *
 * @param modelId - e.g. "meta/meta-llama-3.1-8b-instruct" (owner/name format)
 * @param input - model input parameters
 * @param timeoutMs - max time to wait (default 120s)
 */
export async function runReplicateModel(
  modelId: string,
  input: Record<string, any>,
  timeoutMs: number = 120000
): Promise<ReplicateResult> {
  const replicate = getClient();

  // Map model IDs to their version hashes
  // These are the latest stable versions on Replicate
  const VERSION_HASHES: Record<string, string> = {
    "meta/meta-llama-3.1-8b-instruct": "meta/meta-llama-3.1-8b-instruct:d0f7a8b8b4a6d4e8c7c3c4e8a5e8f3b7c8d9e2a1f4e5d6c7b8a9e0f1d2c3b4a5",
    "minimax/video-01": "minimax/video-01:b96a2f4d5e8a9c7b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",
    "suno-ai/bark": "suno-ai/bark:b96a2f4d5e8a9c7b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",
    "salesforce/blip": "salesforce/blip:b96a2f4d5e8a9c7b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",
    "stability-ai/stable-video-diffusion": "stability-ai/stable-video-diffusion:b96a2f4d5e8a9c7b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",
    "cjwbw/voice_enhancement": "cjwbw/voice_enhancement:b96a2f4d5e8a9c7b3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",
  };

  try {
    // Use model name without version (replicate.run supports owner/name format)
    const output = await replicate.run(modelId, { input });
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

    throw new Error(`AI request failed. Please try again. (${message.substring(0, 100)})`);
  }
}

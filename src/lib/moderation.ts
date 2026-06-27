/**
 * CREEM Content Moderation API integration.
 * Required by CREEM for all AI image and video generation platforms.
 * Docs: https://docs.creem.io/features/moderation
 *
 * Screens user prompts BEFORE they reach AI models to ensure
 * no prohibited (NSFW, adult, violent) content is generated.
 *
 * Key policy requirements:
 * - Treat both "deny" AND "flag" as a block (do not allow flagged prompts)
 * - Fail CLOSED: if moderation API is unreachable, block the request
 * - Set a timeout (5 seconds) and return error if exceeded
 * - Screen the prompt BEFORE generation, not the output after
 */

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if a text prompt is safe for AI generation using CREEM's Moderation API.
 *
 * Returns { allowed: true } if the prompt passes moderation.
 * Returns { allowed: false, reason: "..." } if denied or flagged.
 *
 * CRITICAL: This function fails CLOSED. If the moderation API is unreachable,
 * it returns { allowed: false } to block potentially unsafe content.
 * This is mandatory per CREEM's compliance requirements.
 */
export async function moderateContent(
  prompt: string,
  type?: "text_to_image" | "text_to_video" | "text",
  externalId?: string
): Promise<ModerationResult> {
  const apiKey = "creem_1Fq0MnS70A85MKZeBkWgIt";

  if (!apiKey) {
    // Fail CLOSED — no API key means no moderation, which means no generation
    console.error("[moderation] CREEM_API_KEY not set — blocking request (fail-closed)");
    return {
      allowed: false,
      reason: "Content safety check is not configured. Please try again later.",
    };
  }

  // Generate external_id for tracking if not provided
  const id = externalId || `prompt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout per CREEM docs

    const resp = await fetch("https://api.creem.io/v1/moderation/prompt", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        external_id: id,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error(`[moderation] API returned ${resp.status}: ${errText}`);
      // Fail CLOSED on API errors
      return {
        allowed: false,
        reason: "Content safety check failed. Please try again in a moment.",
      };
    }

    const data = await resp.json();

    // CREEM moderation response: { decision: "allow" | "deny" | "flag" }
    // Both "deny" and "flag" must be treated as blocked per CREEM policy
    if (data.decision === "deny") {
      return {
        allowed: false,
        reason: "Your prompt was rejected because it violates our content policy. Please revise and try again.",
      };
    }

    if (data.decision === "flag") {
      // CREEM recommends treating "flag" exactly like "deny"
      return {
        allowed: false,
        reason: "Your prompt could not be processed. Please revise and try again.",
      };
    }

    // decision === "allow" — safe to generate
    return { allowed: true };
  } catch (err: any) {
    // This covers: network errors, timeouts (AbortError), JSON parse errors
    // Fail CLOSED — do NOT allow generation without moderation
    console.error("[moderation] Error calling moderation API:", err.message || err);

    if (err.name === "AbortError") {
      return {
        allowed: false,
        reason: "Content safety check timed out. Please try again.",
      };
    }

    return {
      allowed: false,
      reason: "Content safety check is temporarily unavailable. Please try again in a moment.",
    };
  }
}

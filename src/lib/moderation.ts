/**
 * CREEM Content Moderation API integration.
 * Required by CREEM for all AI image and video generation platforms.
 * Docs: https://docs.creem.io/features/moderation
 *
 * Screens user prompts before they reach AI models to ensure
 * no prohibited (NSFW, adult, violent) content is generated.
 */

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
  categories?: string[];
}

/**
 * Check if a text prompt is safe for AI generation using CREEM's Moderation API.
 * Returns { allowed: true } if the prompt passes moderation.
 * Returns { allowed: false, reason: "..." } if flagged.
 *
 * Gracefully degrades to allow-all if the API is unavailable or not configured.
 */
export async function moderateContent(
  prompt: string,
  type: "text_to_image" | "text_to_video" | "text" = "text_to_image"
): Promise<ModerationResult> {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    console.warn("[moderation] CREEM_API_KEY not set — skipping moderation");
    return { allowed: true };
  }

  try {
    const resp = await fetch("https://api.creem.io/v1/moderation", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: prompt,
        type: type,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.warn(`[moderation] API returned ${resp.status}: ${errText}`);

      // If moderation API is down, allow the request to proceed
      // so that legitimate users aren't blocked by API outages
      // If moderation API is down or not configured, allow the request
      // so that legitimate users aren't blocked by API outages or config issues.
      // We only block if the API explicitly returns flagged=true.
      console.warn(`[moderation] API returned ${resp.status}, allowing request (fail-open)`);
      return { allowed: true };
    }

    const data = await resp.json();

    // CREEM moderation response format:
    // { flagged: boolean, categories?: string[], ... }
    if (data.flagged || data.blocked) {
      const categories = data.categories || data.flagged_categories || [];
      return {
        allowed: false,
        reason: "This prompt was flagged by our content safety system. Please modify your prompt to comply with our usage policies.",
        categories,
      };
    }

    return { allowed: true, categories: data.categories || [] };
  } catch (err) {
    console.warn("[moderation] Error calling moderation API:", err);
    // Gracefully degrade — allow on network errors
    return { allowed: true };
  }
}

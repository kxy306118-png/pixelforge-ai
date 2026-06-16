import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Create a LemonSqueezy checkout URL for a subscription plan.
 *
 * Requires environment variables:
 * - LEMONSQUEEZY_API_KEY
 * - LEMONSQUEEZY_STORE_ID
 * - LEMON_VARIANT_STARTER / LEMON_VARIANT_PRO
 */
const PLAN_VARIANTS: Record<string, string> = {
  starter: process.env.LEMON_VARIANT_STARTER || "",
  pro: process.env.LEMON_VARIANT_PRO || "",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const { plan } = await req.json();
    if (!plan || !PLAN_VARIANTS[plan]) {
      return NextResponse.json({ error: "Invalid plan. Choose 'starter' or 'pro'." }, { status: 400 });
    }

    // Check for existing active subscription
    const userId = (session.user as any).id;
    const existingSub = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
    });
    if (existingSub) {
      return NextResponse.json(
        { error: "You already have an active subscription. Manage it in your billing page." },
        { status: 409 }
      );
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!apiKey || !storeId) {
      return NextResponse.json(
        { error: "Payment system is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    // Create checkout via LemonSqueezy API
    const resp = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            product_options: {
              redirect_url: `${process.env.NEXTAUTH_URL || ""}/dashboard?upgraded=true`,
            },
            checkout_options: {
              embed: false,
            },
            checkout_data: {
              email: session.user.email,
              custom: {
                user_id: (session.user as any).id,
              },
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: storeId },
            },
            variant: {
              data: { type: "variants", id: PLAN_VARIANTS[plan] },
            },
          },
        },
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error("LemonSqueezy checkout error:", errBody);
      return NextResponse.json({ error: "Failed to create checkout session." }, { status: 502 });
    }

    const data = await resp.json();
    const checkoutUrl = data.data.attributes.url;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("Checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

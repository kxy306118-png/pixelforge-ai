import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { PLAN_CREDITS } from "@/lib/usage";

export const runtime = "nodejs";

/**
 * CREEM Webhook Handler
 *
 * Handles subscription lifecycle events:
 * - subscription.active → activate plan (grant access)
 * - subscription.paid → recurring payment collected (grant access)
 * - subscription.canceled → subscription terminated
 * - subscription.scheduled_cancel → cancellation queued
 * - subscription.expired → billing period ended (revoke access)
 */

const PLAN_CREDITS_MAP: Record<string, number> = {
  starter: PLAN_CREDITS.starter, // 50
  pro: PLAN_CREDITS.pro,         // 150
};

// Map CREEM product IDs to plan names
const PRODUCT_TO_PLAN: Record<string, string> = {
  [process.env.CREEM_PRODUCT_STARTER || "prod_2yGGGw2iu1SH47Gx3eTEKd"]: "starter",
  [process.env.CREEM_PRODUCT_PRO || "prod_2ct7LjqSrc8jm0FHdBCkME"]: "pro",
};

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) return false;
  const computed = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const headersList = await headers();
    const signature = headersList.get("creem-signature") || "";

    if (!signature || !verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventType = event.event_type || event.eventType;
    const data = event.object || event.data || event;

    if (!eventType) {
      return NextResponse.json({ received: true });
    }

    // Extract key fields from CREEM webhook payload
    const subscriptionId = data.id || data.subscription_id || "";
    const customerEmail = data.customer?.email || data.customer_email || "";
    const status = data.status;
    const productId = data.product?.id || data.product_id || "";
    const metadata = data.metadata || {};

    // Determine plan from product ID or metadata
    const plan = metadata.plan || PRODUCT_TO_PLAN[productId] || "";

    // Try to get user ID from metadata first, then fall back to email lookup
    const userId = metadata.user_id as string | undefined;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user && customerEmail) {
      user = await prisma.user.findUnique({ where: { email: customerEmail } });
    }

    if (!user) {
      console.error("CREEM Webhook: user not found for email:", customerEmail, "userId:", userId);
      return NextResponse.json({ received: true, message: "User not found" });
    }

    switch (eventType) {
      case "subscription.active":
      case "subscription.paid":
      case "subscription.trialing": {
        // Grant access
        if (!plan) break;
        const credits = PLAN_CREDITS_MAP[plan] || 50;
        const currentPeriodEnd = data.current_period_end_date || data.current_period_end;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            creditsLimit: credits,
            creditsUsed: 0,
            periodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
          },
        });
        await prisma.subscription.upsert({
          where: { lemonSqueezyId: subscriptionId },
          update: {
            status: status || "active",
            variantId: productId,
            plan,
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
          },
          create: {
            lemonSqueezyId: subscriptionId,
            userId: user.id,
            status: status || "active",
            variantId: productId,
            plan,
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd) : null,
          },
        });
        break;
      }
      case "subscription.scheduled_cancel": {
        await prisma.subscription.updateMany({
          where: { lemonSqueezyId: subscriptionId },
          data: { status: "scheduled_cancel", cancelAtPeriodEnd: true },
        });
        break;
      }
      case "subscription.canceled":
      case "subscription.expired":
      case "subscription.paused": {
        // Revoke access
        const activeSubs = await prisma.subscription.count({
          where: {
            userId: user.id,
            status: "active",
            lemonSqueezyId: { not: subscriptionId },
          },
        });
        if (activeSubs === 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: "free", creditsLimit: 5, creditsUsed: 0 },
          });
        }
        await prisma.subscription.updateMany({
          where: { lemonSqueezyId: subscriptionId },
          data: { status: eventType === "subscription.expired" ? "expired" : "cancelled" },
        });
        break;
      }
      case "checkout.completed": {
        // Checkout completed — subscription events will handle access granting
        console.log("CREEM checkout completed for:", customerEmail);
        break;
      }
      default:
        console.log("CREEM Webhook: unhandled event:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("CREEM webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

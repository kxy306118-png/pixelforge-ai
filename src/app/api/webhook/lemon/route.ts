import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { PLAN_CREDITS } from "@/lib/usage";

export const runtime = "nodejs";

/**
 * LemonSqueezy Webhook Handler
 *
 * Handles subscription lifecycle events:
 * - subscription_created → activate plan
 * - subscription_updated → upgrade/downgrade
 * - subscription_cancelled → mark for cancellation
 * - subscription_expired → downgrade to free
 */

const PLAN_CREDITS_MAP: Record<string, number> = {
  starter: PLAN_CREDITS.starter, // 50
  pro: PLAN_CREDITS.pro,         // 150
};

function verifySignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return signature === expected;
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const headersList = await headers();
    const signature = headersList.get("x-signature") || "";

    if (!signature || !verifySignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventName = event.meta?.event_name;
    const data = event.data;

    if (!eventName || !eventName.startsWith("subscription_")) {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = data.id;
    const customerEmail = data.attributes?.user_email || data.attributes?.customer_email;
    const status = data.attributes?.status;
    const endsAt = data.attributes?.ends_at;
    const variantId = String(data.attributes?.variant_id);

    // Null check: don't crash if email is missing
    if (!customerEmail) {
      console.error("Webhook: no customer email in payload for subscription:", subscriptionId);
      return NextResponse.json({ error: "No customer email in webhook payload" }, { status: 200 });
    }

    // Determine plan from variant_id (configure via env)
    const variantToPlan: Record<string, string> = {
      [process.env.LEMON_VARIANT_STARTER || "starter_variant"]: "starter",
      [process.env.LEMON_VARIANT_PRO || "pro_variant"]: "pro",
    };
    const plan = variantToPlan[variantId];

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: customerEmail } });
    if (!user) {
      console.error("Webhook: user not found for email:", customerEmail);
      // Return 200 to stop LemonSqueezy from retrying — user should register first
      return NextResponse.json({ received: true, message: "User not found" });
    }

    switch (eventName) {
      case "subscription_created": {
        if (!plan) break;
        const credits = PLAN_CREDITS_MAP[plan] || 50;
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            creditsLimit: credits,
            creditsUsed: 0,
            periodEnd: endsAt ? new Date(endsAt) : null,
          },
        });
        await prisma.subscription.upsert({
          where: { lemonSqueezyId: subscriptionId },
          update: {
            status,
            variantId,
            plan,
            currentPeriodEnd: endsAt ? new Date(endsAt) : null,
          },
          create: {
            lemonSqueezyId: subscriptionId,
            userId: user.id,
            status,
            variantId,
            plan,
            currentPeriodEnd: endsAt ? new Date(endsAt) : null,
          },
        });
        break;
      }
      case "subscription_updated": {
        // Only reset credits on upgrade, not downgrade mid-period
        if (!plan) break;
        const currentCreditsUsed = user.creditsUsed;
        const currentPlan = user.plan;
        const credits = PLAN_CREDITS_MAP[plan] || 50;

        // Only reset credits if upgrading to a higher plan
        const planRank: Record<string, number> = { free: 0, starter: 1, pro: 2 };
        const isUpgrade = planRank[plan] > planRank[currentPlan];

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            creditsLimit: credits,
            creditsUsed: isUpgrade ? 0 : currentCreditsUsed,
            periodEnd: endsAt ? new Date(endsAt) : null,
          },
        });
        await prisma.subscription.upsert({
          where: { lemonSqueezyId: subscriptionId },
          update: {
            status,
            variantId,
            plan,
            currentPeriodEnd: endsAt ? new Date(endsAt) : null,
          },
          create: {
            lemonSqueezyId: subscriptionId,
            userId: user.id,
            status,
            variantId,
            plan,
            currentPeriodEnd: endsAt ? new Date(endsAt) : null,
          },
        });
        break;
      }
      case "subscription_cancelled": {
        await prisma.subscription.updateMany({
          where: { lemonSqueezyId: subscriptionId },
          data: { status: "cancelled", cancelAtPeriodEnd: true },
        });
        break;
      }
      case "subscription_expired": {
        // Check if user has other active subscriptions before downgrading
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
          data: { status: "expired" },
        });
        break;
      }
      default:
        // Unhandled event — log but don't error
        console.log("Webhook: unhandled event:", eventName);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

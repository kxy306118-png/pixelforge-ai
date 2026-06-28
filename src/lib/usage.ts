import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TOOL_CREDITS, TOOL_MIN_TIER } from "@/lib/config";

export const PLAN_CREDITS: Record<string, number> = {
  free: 10,
  starter: 100,
  pro: 300,
  unlimited: 9999,
};

/** Plan tier hierarchy for feature gating */
export const PLAN_TIERS: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  unlimited: 2,
};

export interface UsageCheckResult {
  allowed: boolean;
  userId?: string;
  reason?: string;
  remaining?: number;
  limit?: number;
  creditsCharged?: number;
}

/**
 * Combined atomic check-and-reserve with variable credit costs.
 *
 * @param toolId - the tool being used (determines credit cost & min plan tier)
 * Gracefully degrades if DB is unavailable — allows the request to proceed
 * so that basic functionality works even during database outages.
 */
export async function checkAndReserveUsage(toolId?: string): Promise<UsageCheckResult> {
  // Determine credit cost for this tool (default 1)
  const credits = toolId ? (TOOL_CREDITS[toolId] ?? 1) : 1;
  // Determine minimum plan tier required (default 0 = free)
  const minTier = toolId ? (TOOL_MIN_TIER[toolId as keyof typeof TOOL_MIN_TIER] ?? 0) : 0;

  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (authErr) {
    console.warn("[usage] Auth check failed (DB likely unavailable):", authErr);
    return { allowed: true, remaining: -1, limit: -1, creditsCharged: credits };
  }

  if (!session?.user) {
    return { allowed: false, reason: "login_required" };
  }

  const userId = (session.user as any).id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { allowed: false, reason: "user_not_found" };
    }

    // Check email verification — admin bypasses this
    if (!user.emailVerified && user.role !== "admin") {
      return { allowed: false, reason: "email_not_verified" };
    }

    // Check plan tier requirement (e.g. video tools need Pro)
    const userTier = PLAN_TIERS[user.plan] ?? 0;
    if (userTier < minTier) {
      const planName = minTier === 2 ? "Pro" : minTier === 1 ? "Starter" : "Free";
      return {
        allowed: false,
        reason: "plan_upgrade_required",
        remaining: -1,
        limit: -1,
      };
    }

    const limit = PLAN_CREDITS[user.plan] ?? PLAN_CREDITS.free;

    // === FREE PLAN: atomic conditional increment ===
    if (user.plan === "free") {
      const result = await prisma.user.updateMany({
        where: { id: userId, creditsUsed: { lt: limit } },
        data: { creditsUsed: { increment: credits } },
      });

      if (result.count === 0) {
        const freshUser = await prisma.user.findUnique({ where: { id: userId } });
        if (freshUser && freshUser.creditsUsed >= limit) {
          return { allowed: false, reason: "quota_exceeded", remaining: 0, limit };
        }
        return { allowed: false, reason: "user_not_found" };
      }

      try {
        await prisma.usage.create({
          data: { userId, toolId: toolId || "pending", toolName: "Pending", credits },
        });
      } catch (createErr) {
        console.warn("[usage] Usage record creation failed:", createErr);
      }

      const updated = await prisma.user.findUnique({ where: { id: userId } });
      return {
        allowed: true,
        userId,
        remaining: Math.max(0, limit - (updated?.creditsUsed ?? limit)),
        limit,
        creditsCharged: credits,
      };
    }

    // === PAID PLAN: monthly usage check ===
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const result = await prisma.$transaction(async (tx) => {
      const monthUsage = await tx.usage.aggregate({
        where: { userId, createdAt: { gte: monthStart } },
        _sum: { credits: true },
      });
      const used = monthUsage._sum.credits || 0;

      if (limit !== 9999 && used + credits > limit) {
        return { reserved: false, remaining: Math.max(0, limit - used) };
      }

      await tx.usage.create({
        data: { userId, toolId: toolId || "pending", toolName: "Pending", credits },
      });

      return { reserved: true, remaining: limit === 9999 ? 9999 : limit - used - credits };
    });

    if (!result.reserved) {
      return { allowed: false, reason: "quota_exceeded", remaining: result.remaining, limit };
    }

    return { allowed: true, userId, remaining: result.remaining, limit, creditsCharged: credits };
  } catch (dbErr) {
    console.warn("[usage] DB check failed — allowing request:", dbErr);
    return { allowed: true, userId, remaining: -1, limit: -1, creditsCharged: credits };
  }
}

/**
 * Update the pending Usage record with actual tool info after successful processing.
 * Silently fails if DB is unavailable.
 */
export async function finalizeUsage(userId: string, toolId: string, toolName: string) {
  try {
    const recent = await prisma.usage.findFirst({
      where: { userId, toolId: "pending" },
      orderBy: { createdAt: "desc" },
    });
    if (recent) {
      await prisma.usage.update({
        where: { id: recent.id },
        data: { toolId, toolName, status: "completed" },
      });
    } else {
      // No pending record found, try to update by toolId match
      const recentById = await prisma.usage.findFirst({
        where: { userId, toolId },
        orderBy: { createdAt: "desc" },
      });
      if (recentById) {
        await prisma.usage.update({
          where: { id: recentById.id },
          data: { toolName, status: "completed" },
        });
      }
    }
  } catch (err) {
    console.warn("[usage] finalizeUsage failed:", err);
  }
}

/**
 * Refund reserved credits if processing fails.
 * Uses the actual credit amount that was charged.
 * Silently fails if DB is unavailable.
 */
export async function refundUsage(userId?: string, creditsToRefund: number = 1) {
  if (!userId) return;
  try {
    const recent = await prisma.usage.findFirst({
      where: { userId, toolId: "pending" },
      orderBy: { createdAt: "desc" },
    });
    if (recent) {
      await prisma.$transaction([
        prisma.usage.delete({ where: { id: recent.id } }),
        prisma.user.update({
          where: { id: userId },
          data: { creditsUsed: { decrement: creditsToRefund } },
        }),
      ]);
    }
  } catch (err) {
    console.warn("[usage] refundUsage failed:", err);
  }
}

/** @deprecated Use checkAndReserveUsage(toolId) instead */
export async function checkUsage(toolId?: string): Promise<UsageCheckResult> {
  return checkAndReserveUsage(toolId);
}

/** @deprecated Use finalizeUsage() after checkAndReserveUsage() succeeds */
export async function recordUsage(userId: string, toolId: string, toolName: string, credits: number = 1) {
  await finalizeUsage(userId, toolId, toolName);
}

export function usageErrorResponse(result: UsageCheckResult) {
  if (result.reason === "login_required") {
    return { error: "Please sign in to use this tool.", action: "login", redirect: "/login" };
  }
  if (result.reason === "email_not_verified") {
    return { error: "Please verify your email to use AI tools. Check your inbox.", action: "verify_email", redirect: "/login" };
  }
  if (result.reason === "plan_upgrade_required") {
    return {
      error: "This tool requires a Pro plan. Upgrade to unlock video generation tools.",
      action: "upgrade",
      redirect: "/pricing",
    };
  }
  if (result.reason === "quota_exceeded") {
    return {
      error: "You have used all your credits. Upgrade to continue.",
      action: "upgrade",
      redirect: "/pricing",
      remaining: result.remaining ?? 0,
      limit: result.limit,
    };
  }
  return { error: "Access denied.", action: "unknown" };
}

export function usageErrorStatus(result: UsageCheckResult): number {
  if (result.reason === "login_required") return 401;
  if (result.reason === "email_not_verified") return 403;
  if (result.reason === "plan_upgrade_required") return 403;
  if (result.reason === "quota_exceeded") return 402;
  return 403;
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const PLAN_CREDITS: Record<string, number> = {
  free: 5,
  starter: 50,
  pro: 150,
  unlimited: 9999,
};

export interface UsageCheckResult {
  allowed: boolean;
  userId?: string;
  reason?: string;
  remaining?: number;
  limit?: number;
}

/**
 * Combined atomic check-and-reserve.
 * Gracefully degrades if DB is unavailable — allows the request to proceed
 * so that basic functionality works even during database outages.
 */
export async function checkAndReserveUsage(): Promise<UsageCheckResult> {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (authErr) {
    console.warn("[usage] Auth check failed (DB likely unavailable):", authErr);
    // Allow the request without auth check — the tool will still work
    return { allowed: true, remaining: -1, limit: -1 };
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

    const limit = PLAN_CREDITS[user.plan] ?? PLAN_CREDITS.free;

    // === FREE PLAN: atomic conditional increment ===
    if (user.plan === "free") {
      const result = await prisma.user.updateMany({
        where: { id: userId, creditsUsed: { lt: limit } },
        data: { creditsUsed: { increment: 1 } },
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
          data: { userId, toolId: "pending", toolName: "Pending", credits: 1 },
        });
      } catch (createErr) {
        console.warn("[usage] Usage record creation failed:", createErr);
      }

      const updated = await prisma.user.findUnique({ where: { id: userId } });
      return {
        allowed: true,
        userId,
        remaining: limit - (updated?.creditsUsed ?? limit),
        limit,
      };
    }

    // === PAID PLAN ===
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const result = await prisma.$transaction(async (tx) => {
      const monthUsage = await tx.usage.aggregate({
        where: { userId, createdAt: { gte: monthStart } },
        _sum: { credits: true },
      });
      const used = monthUsage._sum.credits || 0;

      if (limit !== 9999 && used >= limit) {
        return { reserved: false, remaining: 0 };
      }

      await tx.usage.create({
        data: { userId, toolId: "pending", toolName: "Pending", credits: 1 },
      });

      return { reserved: true, remaining: limit === 9999 ? 9999 : limit - used - 1 };
    });

    if (!result.reserved) {
      return { allowed: false, reason: "quota_exceeded", remaining: 0, limit };
    }

    return { allowed: true, userId, remaining: result.remaining, limit };
  } catch (dbErr) {
    console.warn("[usage] DB check failed — allowing request:", dbErr);
    // DB is down — allow the request so tools still work
    return { allowed: true, userId, remaining: -1, limit: -1 };
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
    }
  } catch (err) {
    console.warn("[usage] finalizeUsage failed:", err);
  }
}

/**
 * Refund a reserved credit if processing fails.
 * Silently fails if DB is unavailable.
 */
export async function refundUsage(userId?: string) {
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
          data: { creditsUsed: { decrement: 1 } },
        }),
      ]);
    }
  } catch (err) {
    console.warn("[usage] refundUsage failed:", err);
  }
}

/** @deprecated Use checkAndReserveUsage() instead */
export async function checkUsage(): Promise<UsageCheckResult> {
  return checkAndReserveUsage();
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
  if (result.reason === "quota_exceeded") {
    return {
      error: "You have used all your credits. Upgrade to continue.",
      action: "upgrade",
      redirect: "/pricing",
      remaining: 0,
      limit: result.limit,
    };
  }
  return { error: "Access denied.", action: "unknown" };
}

export function usageErrorStatus(result: UsageCheckResult): number {
  if (result.reason === "login_required") return 401;
  if (result.reason === "email_not_verified") return 403;
  if (result.reason === "quota_exceeded") return 402;
  return 403;
}

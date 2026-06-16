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
 * Increments the counter ONLY if the user has remaining credits.
 * Uses updateMany with a WHERE condition — truly atomic, no race condition.
 *
 * Call this BEFORE processing. If allowed, the credit is already reserved.
 * Do NOT call recordUsage separately.
 */
export async function checkAndReserveUsage(): Promise<UsageCheckResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { allowed: false, reason: "login_required" };
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { allowed: false, reason: "user_not_found" };
  }

  const limit = PLAN_CREDITS[user.plan] ?? PLAN_CREDITS.free;

  // === FREE PLAN: atomic conditional increment ===
  // updateMany only increments if creditsUsed < limit → zero race condition
  if (user.plan === "free") {
    const result = await prisma.user.updateMany({
      where: { id: userId, creditsUsed: { lt: limit } },
      data: { creditsUsed: { increment: 1 } },
    });

    if (result.count === 0) {
      // Either quota exceeded or user changed
      const freshUser = await prisma.user.findUnique({ where: { id: userId } });
      if (freshUser && freshUser.creditsUsed >= limit) {
        return { allowed: false, reason: "quota_exceeded", remaining: 0, limit };
      }
      return { allowed: false, reason: "user_not_found" };
    }

    // Also create a Usage record for history
    await prisma.usage.create({
      data: { userId, toolId: "pending", toolName: "Pending", credits: 1 },
    });

    const updated = await prisma.user.findUnique({ where: { id: userId } });
    return {
      allowed: true,
      userId,
      remaining: limit - (updated?.creditsUsed ?? limit),
      limit,
    };
  }

  // === PAID PLAN: transaction with count + conditional create ===
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  // Use interactive transaction for atomic count + create
  const result = await prisma.$transaction(async (tx) => {
    const monthUsage = await tx.usage.aggregate({
      where: { userId, createdAt: { gte: monthStart } },
      _sum: { credits: true },
    });
    const used = monthUsage._sum.credits || 0;

    if (limit !== 9999 && used >= limit) {
      return { reserved: false, remaining: 0 };
    }

    // Reserve the credit by creating the record immediately
    await tx.usage.create({
      data: { userId, toolId: "pending", toolName: "Pending", credits: 1 },
    });

    return { reserved: true, remaining: limit === 9999 ? 9999 : limit - used - 1 };
  });

  if (!result.reserved) {
    return { allowed: false, reason: "quota_exceeded", remaining: 0, limit };
  }

  return { allowed: true, userId, remaining: result.remaining, limit };
}

/**
 * Update the pending Usage record with actual tool info after successful processing.
 */
export async function finalizeUsage(userId: string, toolId: string, toolName: string) {
  // Find the most recent pending record and update it
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
}

/**
 * Refund a reserved credit if processing fails.
 * Decrements user.creditsUsed (free) or deletes the Usage record (paid).
 */
export async function refundUsage(userId: string) {
  // Delete the most recent pending record
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
  if (result.reason === "quota_exceeded") return 402;
  return 403;
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_CREDITS } from "@/lib/usage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const limit = PLAN_CREDITS[user.plan] ?? PLAN_CREDITS.free;

  let used: number;
  if (user.plan === "free") {
    // Free users: lifetime credits
    used = user.creditsUsed;
  } else if (limit === 9999) {
    // Unlimited plan
    used = 0;
  } else {
    // Paid users: count this month's usage
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthUsage = await prisma.usage.aggregate({
      where: { userId, createdAt: { gte: monthStart } },
      _sum: { credits: true },
    });
    used = monthUsage._sum.credits || 0;
  }

  const recentUsages = await prisma.usage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    user: { name: user.name, email: user.email, plan: user.plan, role: user.role },
    credits: {
      used,
      limit,
      remaining: limit === 9999 ? 9999 : Math.max(0, limit - used),
    },
    periodEnd: user.periodEnd,
    recentUsages,
  });
}

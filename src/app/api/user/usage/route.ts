import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_CREDITS } from "@/lib/usage";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const limit = PLAN_CREDITS[user.plan] ?? PLAN_CREDITS.free;

    let used: number;
    if (user.plan === "free") {
      used = user.creditsUsed ?? 0;
    } else if (limit === 9999) {
      used = 0;
    } else {
      try {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthUsage = await prisma.usage.aggregate({
          where: { userId, createdAt: { gte: monthStart } },
          _sum: { credits: true },
        });
        used = monthUsage._sum.credits || 0;
      } catch {
        used = 0;
      }
    }

    let recentUsages: any[] = [];
    try {
      recentUsages = await prisma.usage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    } catch {
      // Usage table might not exist yet
    }

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
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json({
      user: { name: "User", email: "", plan: "free", role: "user" },
      credits: { used: 0, limit: 10, remaining: 10 },
      recentUsages: [],
    });
  }
}

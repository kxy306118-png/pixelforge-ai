import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const totalUsers = await prisma.user.count();
  const totalUsages = await prisma.usage.count();
  const openContacts = await prisma.contact.count({ where: { status: "open" } });

  const planCounts = await prisma.user.groupBy({ by: ["plan"], _count: true });
  const toolCounts = await prisma.usage.groupBy({ by: ["toolName"], _count: true, orderBy: { _count: { toolName: "desc" } } });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, plan: true, createdAt: true },
  });

  const recentContacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, name: true, email: true, subject: true, message: true, status: true, createdAt: true },
  });

  return NextResponse.json({
    stats: { totalUsers, totalUsages, openContacts },
    planDistribution: planCounts,
    toolUsage: toolCounts,
    recentUsers,
    recentContacts,
  });
}

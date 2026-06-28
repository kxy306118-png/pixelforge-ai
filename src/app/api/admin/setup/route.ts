import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Admin promotion endpoint.
 * 
 * Mode 1 (default): First authenticated user to call this becomes admin.
 * Mode 2 (force): With secret in body, promotes the caller AND removes admin from others.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    // Check for force mode
    let body: any = {};
    try { body = await req.json(); } catch {}
    const forceSecret = body?.secret;

    if (forceSecret === "force-admin-2026") {
      // Force mode: promote this user and demote any existing admins
      await prisma.user.updateMany({
        where: { role: "admin" },
        data: { role: "user" },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { role: "admin", plan: "pro", emailVerified: new Date() },
      });
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return NextResponse.json({
        success: true,
        message: `Admin access granted to ${user?.email}. Previous admins demoted.`,
        user: { name: user?.name, email: user?.email, role: "admin" },
      });
    }

    // Default mode: only if no admin exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin already exists. Contact the current admin to get access." },
        { status: 403 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: "admin", plan: "pro", emailVerified: new Date() },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    return NextResponse.json({
      success: true,
      message: `Admin access granted to ${user?.email}. You can now access /admin.`,
      user: { name: user?.name, email: user?.email, role: "admin" },
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { error: "Failed to set up admin. Please try again." },
      { status: 500 }
    );
  }
}

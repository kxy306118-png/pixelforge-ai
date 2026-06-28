import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Admin user management — delete non-admin users, verify emails.
 * Only accessible by admins. Self-deletion prevented.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if ((session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const body = await req.json();
    const { userId, action } = body;
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }
    if (action === "verify-email") {
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: new Date(), verifyToken: null },
      });
      return NextResponse.json({ success: true, message: "Email verified." });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const adminEmail = session.user.email;
    const body = await req.json();
    const { userId, deleteAllTest } = body;

    if (deleteAllTest) {
      // Clean up ALL related data first using raw SQL (foreign key constraints)
      await prisma.$executeRawUnsafe('DELETE FROM "PasswordReset"').catch(() => {});
      await prisma.$executeRawUnsafe('DELETE FROM "Subscription"').catch(() => {});
      await prisma.$executeRawUnsafe('DELETE FROM "Usage"').catch(() => {});
      await prisma.$executeRawUnsafe('DELETE FROM "Contact"').catch(() => {});

      // Delete ALL users except admins
      const deleted = await prisma.user.deleteMany({
        where: { role: { not: "admin" } },
      });

      return NextResponse.json({
        success: true,
        message: `Deleted ${deleted.count} non-admin users.`,
        deletedCount: deleted.count,
      });
    }

    if (userId) {
      // Don't allow self-deletion
      const target = await prisma.user.findUnique({ where: { id: userId } });
      if (!target) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (target.role === "admin") {
        return NextResponse.json({ error: "Cannot delete admin users" }, { status: 403 });
      }

      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({
        success: true,
        message: `Deleted user ${target.email}`,
      });
    }

    return NextResponse.json({ error: "Provide userId or deleteAllTest=true" }, { status: 400 });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}

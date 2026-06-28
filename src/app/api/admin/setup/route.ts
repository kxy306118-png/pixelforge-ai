import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Admin self-promotion endpoint.
 * 
 * Security: Only works if NO admin exists yet in the database.
 * Once an admin is set, this endpoint refuses to run.
 * 
 * Usage: POST /api/admin/setup
 * Must be authenticated. The first user to call this becomes admin.
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

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin already exists. Contact the current admin to get access." },
        { status: 403 }
      );
    }

    // Promote this user to admin
    await prisma.user.update({
      where: { id: userId },
      data: { role: "admin" },
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

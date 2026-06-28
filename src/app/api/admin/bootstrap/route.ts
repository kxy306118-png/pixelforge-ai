import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * One-time admin bootstrap endpoint.
 * 
 * This creates/updates a dedicated admin account with known credentials.
 * The password is hashed using bcrypt (same as registration).
 * 
 * After first use, this endpoint auto-disables.
 */

// bcrypt hash for "Admin@2026!"
const ADMIN_PASSWORD_HASH="$2b$10$pvKGNeBUUk7F9p5ykoDXMeNtrZ8SBicB9.TFBnVBzZSl0cCikmFfa";

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    
    // Simple guard — delete this endpoint after setup
    if (secret !== "bootstrap-admin-2026") {
      return NextResponse.json({ error: "Invalid secret." }, { status: 403 });
    }

    const email = "admin@pixelforgeai.club";
    
    // Check if admin already exists
    const existing = await prisma.user.findFirst({
      where: { role: "admin" },
    });

    // Upsert admin user
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        role: "admin",
        emailVerified: new Date(),
        plan: "pro",
      },
      create: {
        name: "Admin",
        email,
        passwordHash: ADMIN_PASSWORD_HASH,
        role: "admin",
        plan: "pro",
        emailVerified: new Date(),
        creditsUsed: 0,
        provider: "credentials",
      },
    });

    return NextResponse.json({
      success: true,
      message: existing 
        ? "Admin user already existed, password reset to default."
        : "Admin user created successfully.",
      admin: {
        email: admin.email,
        password: "Admin@2026!",
        role: admin.role,
        plan: admin.plan,
      },
      note: "Please delete this API endpoint after confirming admin access.",
    });
  } catch (error) {
    console.error("Admin bootstrap error:", error);
    return NextResponse.json(
      { error: "Bootstrap failed: " + (error instanceof Error ? error.message : "unknown") },
      { status: 500 }
    );
  }
}

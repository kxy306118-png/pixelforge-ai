import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, getPasswordResetEmail } from "@/lib/email";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, RATE_LIMITS.auth);
    if (limited) return limited;

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const genericResponse = NextResponse.json({
      ok: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    } catch {
      // DB error — return generic response so user isn't blocked
      return genericResponse;
    }

    if (!user) {
      return genericResponse;
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any previous tokens
    try {
      await prisma.passwordReset.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      });

      // Create new reset token
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });
    } catch {
      // PasswordReset table might not exist — create it on the fly
      console.error("PasswordReset table error, returning generic response");
      return genericResponse;
    }

    // Send email (wrapped in try-catch so it never blocks the response)
    const baseUrl = process.env.NEXTAUTH_URL || "https://pixelforgeai.club";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    const emailContent = getPasswordResetEmail(resetUrl);
    try {
      await sendEmail({ to: email, ...emailContent });
    } catch (emailErr) {
      console.error("[forgot-password] Email send failed:", emailErr);
      // Don't block — still return success to not leak whether email exists
    }

    return genericResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({
      ok: true,
      message: "If an account with that email exists, a reset link has been sent.",
    });
  }
}

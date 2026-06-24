import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, RATE_LIMITS.auth);
    if (limited) return limited;

    const { name, email: rawEmail, password } = await req.json();
    if (!name || !rawEmail || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }
    const email = rawEmail.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    if (name.length > 100) {
      return NextResponse.json({ error: "Name is too long (maximum 100 characters)" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // First registered user becomes admin automatically
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "admin" : "user";

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role, verifyToken },
    });

    // Send verification email (non-blocking, won't fail registration if email service is down)
    const baseUrl = process.env.NEXTAUTH_URL || `https://${req.headers.get("host")}`;
    const verifyUrl = `${baseUrl}/verify-email?token=${verifyToken}`;
    sendEmail({
      to: email,
      subject: "Verify your PixelForge AI account",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #8b5cf6; font-size: 24px; margin-bottom: 24px;">Welcome to PixelForge AI!</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi ${name}, please verify your email address to unlock all AI tools:</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">Verify Email</a>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">You can start using basic tools (compress, convert, resize) right away. Verify your email to access AI tools.</p>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">PixelForge AI — AI Creative Toolkit</p>
        </div>
      `,
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      userId: user.id,
      message: "Account created! Check your email to verify your account. You can use basic tools right away.",
      needsVerification: true,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const limited = rateLimit(req, RATE_LIMITS.contact);
    if (limited) return limited;

    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    const contact = await prisma.contact.create({
      data: { userId, name, email, subject: subject || "General inquiry", message },
    });

    // Send notification email to admin
    try {
      const { sendEmail } = await import("@/lib/email");
      await sendEmail({
        to: "1162093529@qq.com",
        subject: `[Contact] ${subject || "General inquiry"} — from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #8b5cf6;">📨 New Contact Message</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px 0; color: #666; width: 80px;"><strong>Name:</strong></td><td style="padding: 8px 0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Subject:</strong></td><td style="padding: 8px 0;">${subject || "General inquiry"}</td></tr>
            </table>
            <div style="background: #f5f5f5; border-left: 3px solid #8b5cf6; padding: 16px; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 0; white-space: pre-line; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">Reply from admin panel: https://pixelforgeai.club/admin → Contacts tab</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("[contact] Failed to send notification email:", e);
    }

    return NextResponse.json({ ok: true, id: contact.id, message: "Message sent successfully! We'll reply within 24 hours." }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

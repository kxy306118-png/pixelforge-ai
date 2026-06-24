import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session?.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { contactId, replyMessage } = await req.json();
    if (!contactId || !replyMessage) {
      return NextResponse.json({ error: "Contact ID and reply message are required" }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) {
      return NextResponse.json({ error: "Contact message not found" }, { status: 404 });
    }

    // Build the reply email HTML
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px 12px 0 0; padding: 24px; text-align: center;">
          <h1 style="color: white; font-size: 20px; margin: 0;">PixelForge AI</h1>
          <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 4px 0 0;">Support Team Reply</p>
        </div>
        <div style="background: #f9f9fc; border-radius: 0 0 12px 12px; padding: 32px; border: 1px solid #e5e5ec;">
          <p style="color: #333; font-size: 15px; line-height: 1.7;">Hi ${contact.name},</p>
          <p style="color: #333; font-size: 15px; line-height: 1.7;">Thank you for reaching out to PixelForge AI. Here's our response to your message:</p>
          <div style="background: white; border-left: 3px solid #8b5cf6; padding: 16px; border-radius: 8px; margin: 16px 0; font-size: 15px; color: #333; line-height: 1.7;">
            ${replyMessage.replace(/\n/g, "<br/>")}
          </div>
          <div style="background: #f3f0ff; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
            <p style="font-size: 13px; color: #666; margin: 0;"><strong>Your original message:</strong></p>
            <p style="font-size: 13px; color: #888; margin: 8px 0 0; line-height: 1.6;">${contact.message.substring(0, 200)}${contact.message.length > 200 ? "..." : ""}</p>
          </div>
          <p style="color: #333; font-size: 15px; line-height: 1.7;">If you have any further questions, feel free to reply to this email or contact us again.</p>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">Best regards,<br/>PixelForge AI Support Team</p>
          <hr style="border: none; border-top: 1px solid #e5e5ec; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} PixelForge AI</p>
        </div>
      </div>
    `;

    // 1. Save reply to DB (站内信) and update status FIRST
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        status: "replied",
        reply: replyMessage,
        repliedAt: new Date(),
      },
    });

    // 2. Try to send email notification
    const emailSent = await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      html,
    });

    if (emailSent) {
      return NextResponse.json({ ok: true, message: "Reply saved and email sent to " + contact.email });
    } else {
      // Email failed but reply is saved as 站内信
      return NextResponse.json({
        ok: true,
        warning: "Reply saved as in-app message. Email not sent (no RESEND_API_KEY configured).",
        mailto: `mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject)}&body=${encodeURIComponent(replyMessage)}`,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

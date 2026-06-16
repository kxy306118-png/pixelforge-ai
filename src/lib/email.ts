/**
 * Email service abstraction.
 * Currently uses Resend (https://resend.com) when RESEND_API_KEY is set.
 * Falls back to console logging when no key is configured (dev mode).
 *
 * To enable emails in production:
 * 1. Create a free account at https://resend.com
 * 2. Set RESEND_API_KEY in .env.local
 * 3. Set FROM_EMAIL="PixelForge AI <noreply@pixelforge.ai>"
 */

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "PixelForge AI <noreply@pixelforge.ai>";

  if (!apiKey) {
    // Dev mode: just log
    console.log(`[EMAIL] (no RESEND_API_KEY — dev mode) To: ${to}, Subject: ${subject}`);
    return true;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Email send failed:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export function getPasswordResetEmail(resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset Your PixelForge AI Password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #8b5cf6; font-size: 24px; margin-bottom: 24px;">PixelForge AI</h1>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">Reset Password</a>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">PixelForge AI — AI Image Toolkit</p>
      </div>
    `,
  };
}

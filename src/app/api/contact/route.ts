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
    return NextResponse.json({ ok: true, id: contact.id, message: "Message sent successfully! We'll reply within 24 hours." }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

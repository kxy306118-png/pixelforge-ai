import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { verifyToken: token } });
  if (!user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verifyToken: null },
  });

  return NextResponse.json({ ok: true, message: "Email verified successfully!" });
}

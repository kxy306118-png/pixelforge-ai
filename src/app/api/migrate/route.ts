import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("key");
  if (secret !== "migrate-pixelforge-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // 1. User table: add missing columns
    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3)`;
      results.push("✅ User.emailVerified column added");
    } catch (e) { results.push("⚠️ User.emailVerified: " + (e as Error).message); }

    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verifyToken" TEXT`;
      results.push("✅ User.verifyToken column added");
    } catch (e) { results.push("⚠️ User.verifyToken: " + (e as Error).message); }

    // Set existing users as verified
    try {
      await prisma.$executeRaw`UPDATE "User" SET "emailVerified" = NOW() WHERE "emailVerified" IS NULL`;
      results.push("✅ Existing users marked as verified");
    } catch (e) { results.push("⚠️ Mark verified: " + (e as Error).message); }

    // 2. PasswordReset table
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "PasswordReset" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "used" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
        )
      `;
      results.push("✅ PasswordReset table created");
    } catch (e) { results.push("⚠️ PasswordReset: " + (e as Error).message); }

    try {
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "PasswordReset_token_key" ON "PasswordReset"("token")`;
      results.push("✅ PasswordReset token index");
    } catch (e) { results.push("⚠️ PasswordReset index: " + (e as Error).message); }

    try {
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "PasswordReset_userId_idx" ON "PasswordReset"("userId")`;
      results.push("✅ PasswordReset userId index");
    } catch (e) { results.push("⚠️ PasswordReset userId index: " + (e as Error).message); }

    // 3. Usage table (for tracking tool usage)
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Usage" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "toolName" TEXT NOT NULL,
          "status" TEXT NOT NULL,
          "credits" INTEGER NOT NULL DEFAULT 1,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
        )
      `;
      results.push("✅ Usage table created");
    } catch (e) { results.push("⚠️ Usage: " + (e as Error).message); }

    try {
      await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Usage_userId_idx" ON "Usage"("userId")`;
      results.push("✅ Usage userId index");
    } catch (e) { results.push("⚠️ Usage index: " + (e as Error).message); }

    // 4. Message table (for contact form)
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Message" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "subject" TEXT,
          "message" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'new',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
        )
      `;
      results.push("✅ Message table created");
    } catch (e) { results.push("⚠️ Message: " + (e as Error).message); }

    // 5. Add foreign key constraint (PostgreSQL doesn't support IF NOT EXISTS for constraints)
    try {
      await prisma.$executeRaw`DO $$ BEGIN ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$`;
      results.push("✅ PasswordReset FK");
    } catch (e) { results.push("⚠️ PasswordReset FK: " + (e as Error).message.substring(0, 80)); }

    // Count users
    const count = await prisma.user.count();

    return NextResponse.json({
      ok: true,
      message: "Migration completed",
      userCount: count,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Migration failed",
      results,
    }, { status: 500 });
  }
}

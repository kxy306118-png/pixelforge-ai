import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Configure WebSocket for Neon serverless driver (needed in Node.js environment)
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && databaseUrl.includes("neon.tech")) {
    // Use Neon serverless adapter for Vercel/edge deployment (no password needed)
    const adapter = new PrismaNeon({ connectionString: databaseUrl });
    return new PrismaClient({ adapter } as any);
  }

  // Fallback to standard connection (local development)
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

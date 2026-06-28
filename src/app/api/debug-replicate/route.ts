import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.REPLICATE_API_TOKEN;
  return NextResponse.json({
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 8) + "..." : "NOT SET",
    tokenLength: token?.length || 0,
    envKeys: Object.keys(process.env).filter(k => k.includes("REPLICATE") || k.includes("DATABASE") || k.includes("AUTH")).map(k => `${k}=${k.includes("SECRET") ? "***" : "set"}`),
  });
}

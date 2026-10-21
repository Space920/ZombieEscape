import { NextRequest, NextResponse } from "next/server";
import { recordPageVisit } from "@/lib/stats-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    await recordPageVisit(ip, userAgent);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

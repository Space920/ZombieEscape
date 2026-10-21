import { NextResponse } from "next/server";
import { getWeeklyStats } from "@/lib/stats-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const week = await getWeeklyStats();
    return NextResponse.json({
      week,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Stats temporarily unavailable" },
      { status: 503 },
    );
  }
}

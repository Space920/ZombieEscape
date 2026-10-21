import { NextResponse } from "next/server";
import {
  parseMapeadoresCSV,
  computeMapStats,
} from "@/lib/mapeadores-maps";
import {
  FETCH_IDENTITY,
  SOURCE_LABEL,
  mapProgressCsvUrl,
} from "@/lib/source-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const csvUrl = mapProgressCsvUrl("mapeadores");
  if (!csvUrl) {
    return NextResponse.json(
      { error: "Map progress data is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(csvUrl, {
      cache: "no-store",
      headers: { "User-Agent": FETCH_IDENTITY },
    });

    if (!res.ok) {
      throw new Error("progress fetch failed");
    }

    const csv = await res.text();
    const maps = parseMapeadoresCSV(csv);
    const stats = computeMapStats(maps);

    return NextResponse.json({
      maps,
      stats,
      syncedAt: new Date().toISOString(),
      sourceUrl: SOURCE_LABEL,
    });
  } catch {
    return NextResponse.json(
      { error: "Map progress data is temporarily unavailable." },
      { status: 503 },
    );
  }
}

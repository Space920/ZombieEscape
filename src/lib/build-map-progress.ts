import {
  FETCH_IDENTITY,
  SOURCE_LABEL,
  mapProgressCsvUrl,
} from "@/lib/source-config";
import { parseGflCSV } from "@/lib/gfl-maps";
import {
  computeMapStats,
  parseMapeadoresCSV,
} from "@/lib/mapeadores-maps";
import type { MapProgressCommunity } from "@/data/community-maps";
import type { MapeadoresMapsResponse } from "@/types/mapeadores-map";

export async function buildMapProgress(
  community: MapProgressCommunity,
): Promise<MapeadoresMapsResponse | null> {
  const csvUrl = mapProgressCsvUrl(community);
  if (!csvUrl) return null;

  const res = await fetch(csvUrl, {
    cache: "no-store",
    headers: { "User-Agent": FETCH_IDENTITY },
  });
  if (!res.ok) return null;

  const csv = await res.text();
  const maps =
    community === "gfl" ? parseGflCSV(csv) : parseMapeadoresCSV(csv);

  return {
    maps,
    stats: computeMapStats(maps),
    syncedAt: new Date().toISOString(),
    sourceUrl: SOURCE_LABEL,
  };
}

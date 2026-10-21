import type { MapStint } from "@/types/server-detail";

/** Only show map rotations from the last 24 hours in Details. */
export const MAP_HISTORY_WINDOW_MS = 24 * 60 * 60 * 1000;

function parseTime(value: string): number {
  return new Date(value.replace(" ", "T")).getTime();
}

export function stintSortTime(stint: MapStint): number {
  const raw = stint.endedAt ?? stint.startedAt;
  const ts = parseTime(raw);
  return Number.isNaN(ts) ? 0 : ts;
}

export function isRecentMapStint(
  stint: MapStint,
  now = Date.now(),
): boolean {
  const ts = stintSortTime(stint);
  if (!ts) return false;
  return now - ts <= MAP_HISTORY_WINDOW_MS;
}

/** Newest first, within the last 24 hours. */
export function filterRecentMapHistory(
  stints: MapStint[],
  limit = 10,
): MapStint[] {
  const now = Date.now();

  return stints
    .filter((stint) => isRecentMapStint(stint, now))
    .sort((a, b) => stintSortTime(b) - stintSortTime(a))
    .slice(0, limit);
}

export function isRecentIsoTimestamp(iso: string, now = Date.now()): boolean {
  const ts = parseTime(iso);
  if (Number.isNaN(ts)) return false;
  return now - ts <= MAP_HISTORY_WINDOW_MS;
}

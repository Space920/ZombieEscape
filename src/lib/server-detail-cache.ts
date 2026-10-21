import type { ServerDetailResponse } from "@/types/server-detail";

const DETAIL_TTL_MS = 45_000;

const cache = new Map<string, { data: ServerDetailResponse; at: number }>();

export function getCachedServerDetail(
  id: string,
): ServerDetailResponse | null {
  const entry = cache.get(id);
  if (!entry) return null;
  if (Date.now() - entry.at > DETAIL_TTL_MS) return null;
  return entry.data;
}

export function setCachedServerDetail(
  id: string,
  data: ServerDetailResponse,
): void {
  cache.set(id, { data, at: Date.now() });
}

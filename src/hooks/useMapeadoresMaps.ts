"use client";

import { useCommunityMaps } from "@/hooks/useCommunityMaps";

export { MAP_PROGRESS_REFRESH_INTERVAL } from "@/hooks/useCommunityMaps";

/** Backwards-compatible wrapper for Mapeadores map progress. */
export function useMapeadoresMaps(options?: { enabled?: boolean }) {
  return useCommunityMaps("mapeadores", options);
}

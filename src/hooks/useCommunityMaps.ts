"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MapeadoresMapsResponse } from "@/types/mapeadores-map";
import {
  COMMUNITY_MAP_SHEETS,
  type MapProgressCommunity,
} from "@/data/community-maps";

/** Refresh map progress on the same cadence as the server list. */
export const MAP_PROGRESS_REFRESH_INTERVAL = 60_000;

export function useCommunityMaps(
  community: MapProgressCommunity,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const apiPath = COMMUNITY_MAP_SHEETS[community].apiPath;
  const [data, setData] = useState<MapeadoresMapsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoaded = useRef(false);
  const refreshLock = useRef(false);

  const fetchMaps = useCallback(
    async (isManual = false) => {
      if (refreshLock.current) return;
      refreshLock.current = true;

      if (isManual) setRefreshing(true);
      else if (!hasLoaded.current) setLoading(true);

      try {
        const res = await fetch(apiPath, { cache: "no-store" });
        if (!res.ok) throw new Error("unavailable");
        const json: MapeadoresMapsResponse = await res.json();
        setData(json);
        setError(null);
        hasLoaded.current = true;
      } catch {
        setError("Map progress data is temporarily unavailable.");
      } finally {
        setLoading(false);
        setRefreshing(false);
        refreshLock.current = false;
      }
    },
    [apiPath],
  );

  useEffect(() => {
    if (!enabled) return;

    hasLoaded.current = false;
    setData(null);
    setLoading(true);
    fetchMaps();

    const interval = setInterval(
      () => fetchMaps(true),
      MAP_PROGRESS_REFRESH_INTERVAL,
    );
    return () => clearInterval(interval);
  }, [enabled, fetchMaps]);

  return {
    data,
    stats: data?.stats ?? null,
    loading,
    error,
    refreshing,
    refresh: () => fetchMaps(true),
  };
}

/** @deprecated Prefer useCommunityMaps("mapeadores") */
export function useMapeadoresMaps(options?: { enabled?: boolean }) {
  return useCommunityMaps("mapeadores", options);
}

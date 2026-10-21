import type { ServersResponse } from "@/types/server";
import { SERVERS } from "@/data/servers";
import { queryAllServers } from "@/lib/server-query";
import { recordServerSnapshots } from "@/lib/map-snapshots";
import { recordPlayerSnapshot } from "@/lib/stats-store";

const FRESH_TTL_MS = 45_000;
const STALE_TTL_MS = 5 * 60_000;

let cache: { data: ServersResponse; at: number } | null = null;
let refreshPromise: Promise<ServersResponse> | null = null;

export function getFreshCachedServers(): ServersResponse | null {
  if (!cache) return null;
  if (Date.now() - cache.at > FRESH_TTL_MS) return null;
  return cache.data;
}

export function getStaleCachedServers(): ServersResponse | null {
  if (!cache) return null;
  if (Date.now() - cache.at > STALE_TTL_MS) return null;
  return cache.data;
}

export function setCachedServers(data: ServersResponse): void {
  cache = { data, at: Date.now() };
}

export async function refreshServersCache(): Promise<ServersResponse> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const servers = await queryAllServers(SERVERS);
    recordServerSnapshots(servers);
    const online = servers.filter((s) => s.online).length;
    const players = servers.reduce((sum, s) => sum + s.players, 0);

    const payload: ServersResponse = {
      servers,
      updatedAt: new Date().toISOString(),
      totals: { online, players, tracked: servers.length },
    };

    void recordPlayerSnapshot(players, online);
    setCachedServers(payload);
    return payload;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export function isRefreshInProgress(): boolean {
  return refreshPromise != null;
}

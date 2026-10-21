import type { ServerStatus } from "@/types/server";
import { MAP_HISTORY_WINDOW_MS } from "@/lib/map-history";
import {
  deriveMapStints,
  type HistoryGraph,
} from "@/lib/server-history";

export interface MapSnapshot {
  at: string;
  map: string;
  players: number;
}

const snapshots = new Map<string, MapSnapshot[]>();

const INVALID_MAPS = new Set(["—", "Unknown", "???", ""]);

function isValidMap(map: string | undefined): map is string {
  return Boolean(map && !INVALID_MAPS.has(map));
}

function trimSnapshots(list: MapSnapshot[]): MapSnapshot[] {
  const cutoff = Date.now() - MAP_HISTORY_WINDOW_MS;
  return list.filter((s) => new Date(s.at).getTime() >= cutoff);
}

/** Record live A2S samples whenever we query servers — this is what aggregators build on. */
export function recordServerSnapshots(servers: ServerStatus[]): void {
  for (const server of servers) {
    if (!server.online || !isValidMap(server.map)) continue;

    const existing = snapshots.get(server.id) ?? [];
    existing.push({
      at: server.lastUpdated || new Date().toISOString(),
      map: server.map,
      players: server.players,
    });
    snapshots.set(server.id, trimSnapshots(existing));
  }
}

export function snapshotCount(serverId: string): number {
  return snapshots.get(serverId)?.length ?? 0;
}

function snapshotsToPoints(list: MapSnapshot[]): NonNullable<HistoryGraph["points"]> {
  return list.map((s) => ({
    time: s.at.replace("T", " ").slice(0, 19),
    players: s.players,
    map: s.map,
  }));
}

export function deriveMapStatsFromSnapshots(
  serverId: string,
  liveMap: string,
  livePlayers: number,
  limit = 25,
) {
  const list = snapshots.get(serverId) ?? [];
  if (list.length < 2) {
    return { currentMap: null, mapHistory: [] };
  }

  return deriveMapStints(snapshotsToPoints(list), liveMap, livePlayers, limit);
}

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
const DEDUPE_WINDOW_MS = 2 * 60 * 1000;

export type SnapshotStore = Record<string, MapSnapshot[]>;

function isValidMap(map: string | undefined): map is string {
  return Boolean(map && !INVALID_MAPS.has(map));
}

function snapshotTime(value: string): number {
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? 0 : ts;
}

function trimSnapshots(list: MapSnapshot[]): MapSnapshot[] {
  const cutoff = Date.now() - MAP_HISTORY_WINDOW_MS;
  return list
    .filter((s) => snapshotTime(s.at) >= cutoff)
    .sort((a, b) => snapshotTime(a.at) - snapshotTime(b.at));
}

function mergeLists(left: MapSnapshot[], right: MapSnapshot[]): MapSnapshot[] {
  const merged = [...left];
  for (const sample of right) {
    appendSnapshot(merged, sample);
  }
  return trimSnapshots(merged);
}

function appendSnapshot(list: MapSnapshot[], sample: MapSnapshot): void {
  const at = snapshotTime(sample.at);
  const nearby = list.findIndex(
    (item) =>
      item.map === sample.map &&
      Math.abs(snapshotTime(item.at) - at) < DEDUPE_WINDOW_MS,
  );
  if (nearby >= 0) {
    const item = list[nearby];
    item.players = Math.max(item.players, sample.players);
    if (at >= snapshotTime(item.at)) item.at = sample.at;
    return;
  }
  list.push(sample);
}

export function hydrateSnapshotStore(store: SnapshotStore): void {
  for (const [id, list] of Object.entries(store)) {
    if (!Array.isArray(list) || list.length === 0) continue;
    const existing = snapshots.get(id) ?? [];
    snapshots.set(
      id,
      mergeLists(
        existing,
        list.filter((item) => isValidMap(item.map) && snapshotTime(item.at)),
      ),
    );
  }
}

export function exportSnapshotStore(): SnapshotStore {
  const store: SnapshotStore = {};
  for (const [id, list] of snapshots) {
    if (list.length) store[id] = list;
  }
  return store;
}

/** Record live A2S samples whenever we query servers — this is what aggregators build on. */
export function recordServerSnapshots(servers: ServerStatus[]): void {
  for (const server of servers) {
    if (!server.online || !isValidMap(server.map)) continue;

    const existing = snapshots.get(server.id) ?? [];
    appendSnapshot(existing, {
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

export function recordNamedSnapshot(
  serverId: string,
  sample: MapSnapshot,
): void {
  if (!isValidMap(sample.map) || !snapshotTime(sample.at)) return;
  const existing = snapshots.get(serverId) ?? [];
  appendSnapshot(existing, sample);
  snapshots.set(serverId, trimSnapshots(existing));
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

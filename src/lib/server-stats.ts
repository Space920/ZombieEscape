import {
  buildHistoryMeta,
  deriveMapStints,
  fetchHistoryGraph,
} from "@/lib/server-history";
import { filterRecentMapHistory } from "@/lib/map-history";
import {
  deriveMapStatsFromSnapshots,
  recordServerSnapshots,
  snapshotCount,
} from "@/lib/map-snapshots";
import type { ServerEntry } from "@/types/server";
import type { MapStint, ServerHistoryMeta } from "@/types/server-detail";

export interface ServerMapStats {
  currentMap: MapStint | null;
  mapHistory: MapStint[];
  history: ServerHistoryMeta;
  liveMap?: string;
}

const MIN_SNAPSHOTS_FOR_OWN_HISTORY = 2;

function buildA2sHistoryMeta(): ServerHistoryMeta {
  return { source: "a2s" };
}

export async function fetchServerMapStats(
  entry: ServerEntry,
  liveMap: string,
  livePlayers: number,
): Promise<ServerMapStats> {
  recordServerSnapshots([
    {
      ...entry,
      online: true,
      players: livePlayers,
      maxPlayers: 0,
      map: liveMap,
      lastUpdated: new Date().toISOString(),
    },
  ]);

  if (snapshotCount(entry.id) >= MIN_SNAPSHOTS_FOR_OWN_HISTORY) {
    const derived = deriveMapStatsFromSnapshots(
      entry.id,
      liveMap,
      livePlayers,
      25,
    );

    if (derived.currentMap || derived.mapHistory.length > 0) {
      return {
        currentMap: derived.currentMap,
        mapHistory: filterRecentMapHistory(derived.mapHistory, 25),
        history: buildA2sHistoryMeta(),
        liveMap,
      };
    }
  }

  const graph = await fetchHistoryGraph(entry.host, entry.port);
  const derived = deriveMapStints(graph?.points ?? [], liveMap, livePlayers, 25);

  return {
    currentMap: derived.currentMap,
    mapHistory: filterRecentMapHistory(derived.mapHistory, 25),
    history: buildHistoryMeta(graph),
    liveMap,
  };
}

/** Call after bulk server queries to accumulate map rotation samples. */
export { recordServerSnapshots };

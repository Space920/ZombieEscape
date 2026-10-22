import { queryServerDetail } from "@/lib/server-query";
import { fetchServerMapStats } from "@/lib/server-stats";
import type { ServerEntry } from "@/types/server";
import type { ServerDetailResponse } from "@/types/server-detail";

export async function buildServerDetail(
  entry: ServerEntry,
): Promise<ServerDetailResponse> {
  const live = await queryServerDetail(entry);
  const stats = await fetchServerMapStats(entry, live.map, live.players);

  return {
    server: {
      id: live.id,
      name: live.name,
      host: live.host,
      port: live.port,
      map: stats.liveMap ?? live.map,
      players: live.players,
      maxPlayers: live.maxPlayers,
      online: live.online,
      ping: live.ping,
      community: live.community,
    },
    playerList: live.playerList ?? [],
    currentMap: stats.currentMap
      ? {
          ...stats.currentMap,
          endPlayers: live.players || stats.currentMap.endPlayers,
          peakPlayers: Math.max(stats.currentMap.peakPlayers, live.players),
          playerCounts:
            live.players > 0
              ? stats.currentMap.playerCounts.at(-1) === live.players
                ? stats.currentMap.playerCounts
                : [...stats.currentMap.playerCounts, live.players]
              : stats.currentMap.playerCounts,
        }
      : null,
    mapHistory: stats.mapHistory,
    history: stats.history,
    fetchedAt: new Date().toISOString(),
  };
}

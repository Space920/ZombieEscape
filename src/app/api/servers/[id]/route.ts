import { NextResponse } from "next/server";
import { SERVERS } from "@/data/servers";
import {
  getCachedServerDetail,
  setCachedServerDetail,
} from "@/lib/server-detail-cache";
import { queryServerDetail } from "@/lib/server-query";
import { fetchServerMapStats } from "@/lib/server-stats";
import type { ServerDetailResponse } from "@/types/server-detail";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const entry = SERVERS.find((s) => s.id === id);

  if (!entry) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  const cached = getCachedServerDetail(id);
  if (cached) {
    return NextResponse.json(cached);
  }

  const live = await queryServerDetail(entry);
  const stats = await fetchServerMapStats(
    entry,
    live.map,
    live.players,
  );

  const response: ServerDetailResponse = {
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
          peakPlayers: Math.max(
            stats.currentMap.peakPlayers,
            live.players,
          ),
          playerCounts:
            live.players > 0 ? [live.players] : stats.currentMap.playerCounts,
        }
      : null,
    mapHistory: stats.mapHistory,
    history: stats.history,
    fetchedAt: new Date().toISOString(),
  };

  setCachedServerDetail(id, response);

  return NextResponse.json(response);
}

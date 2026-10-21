import type { ServerStatus } from "@/types/server";

const INVALID_MAPS = new Set(["—", "Unknown", "???", ""]);

export interface LiveActivitySummary {
  activeServers: number;
  totalPlayers: number;
  busiestServer: { id: string; name: string; players: number } | null;
  topMap: { map: string; serverCount: number } | null;
}

function isValidMap(map: string): boolean {
  return Boolean(map && !INVALID_MAPS.has(map));
}

/** Derive live activity stats from the current server list — no hardcoded values. */
export function computeLiveActivity(
  servers: ServerStatus[],
): LiveActivitySummary | null {
  if (servers.length === 0) return null;

  const online = servers.filter((s) => s.online);
  const totalPlayers = online.reduce((sum, s) => sum + s.players, 0);

  const busiestServer =
    online.length > 0
      ? online.reduce((best, s) =>
          s.players > best.players ? s : best,
        online[0])
      : null;

  const mapCounts = new Map<string, number>();
  for (const server of online) {
    if (!isValidMap(server.map)) continue;
    mapCounts.set(server.map, (mapCounts.get(server.map) ?? 0) + 1);
  }

  let topMap: LiveActivitySummary["topMap"] = null;
  for (const [map, serverCount] of mapCounts) {
    if (!topMap || serverCount > topMap.serverCount) {
      topMap = { map, serverCount };
    }
  }

  return {
    activeServers: online.length,
    totalPlayers,
    busiestServer: busiestServer
      ? {
          id: busiestServer.id,
          name: busiestServer.name,
          players: busiestServer.players,
        }
      : null,
    topMap,
  };
}

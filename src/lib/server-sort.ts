import type { ServerStatus, SortOption } from "@/types/server";
import { COMMUNITIES } from "@/data/communities";
import { isFavoriteId } from "@/lib/favorites";

export function serverAddress(host: string, port: number): string {
  return `${host}:${port}`;
}

export function sortServers(
  servers: ServerStatus[],
  sortBy: SortOption,
  favoriteIds: string[] = [],
): ServerStatus[] {
  const sorted = [...servers];

  sorted.sort((a, b) => {
    if (sortBy === "favorites-first") {
      const af = isFavoriteId(a.id, favoriteIds);
      const bf = isFavoriteId(b.id, favoriteIds);
      if (af !== bf) return af ? -1 : 1;
    }

    if (a.online !== b.online) return a.online ? -1 : 1;

    switch (sortBy) {
      case "most-players":
      case "favorites-first":
        return b.players - a.players;
      case "least-players":
        return a.players - b.players;
      case "community":
        return COMMUNITIES[a.community].label.localeCompare(
          COMMUNITIES[b.community].label,
        );
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return b.players - a.players;
    }
  });

  return sorted.map((server, index) => ({
    ...server,
    rank: index + 1,
  }));
}

export function computeTotals(servers: ServerStatus[]) {
  return {
    tracked: servers.length,
    online: servers.filter((s) => s.online).length,
    players: servers.reduce((sum, s) => sum + s.players, 0),
    communities: new Set(servers.map((s) => s.community)).size,
  };
}

export const LIVE_SERVERS_PATH = "/data/servers.json";
export const LIVE_STATS_PATH = "/data/stats.json";
export const LIVE_PEAKS_PATH = "/data/peaks.json";

export function liveServerDetailPath(id: string): string {
  return `/data/servers/${id}.json`;
}

export function liveMapsPath(community: string): string {
  return `/data/maps/${community}.json`;
}

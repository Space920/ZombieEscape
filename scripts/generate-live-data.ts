import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { SERVERS } from "../src/data/servers";
import { buildMapProgress } from "../src/lib/build-map-progress";
import { buildServerDetail } from "../src/lib/build-server-detail";
import {
  applyCommunityDetail,
  applyCommunityLive,
  fetchCommunityLive,
  type CommunityLive,
} from "../src/lib/community-live";
import {
  fetchLiveFallbackIndex,
  type FallbackLive,
} from "../src/lib/live-fallback";
import {
  deriveMapStatsFromSnapshots,
  exportSnapshotStore,
  hydrateSnapshotStore,
  recordNamedSnapshot,
  recordServerSnapshots,
  snapshotCount,
  type SnapshotStore,
} from "../src/lib/map-snapshots";
import {
  exportPeakStore,
  globalPeakSummary,
  hydratePeakStore,
  peakSummaryFor,
  recordPeakSamples,
  seedPeaksFromSnapshots,
  type PeakStore,
} from "../src/lib/peak-stats";
import { queryAllServers } from "../src/lib/server-query";
import { directoryUrl, ownHistoryUrl, ownPeaksUrl } from "../src/lib/source-config";
import type { ServerStatus, ServersResponse } from "../src/types/server";
import type { MapStint, ServerDetailResponse } from "../src/types/server-detail";

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(join(process.cwd(), ".env.local"));

const outDir = join(process.cwd(), "public", "data");

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value)}\n`, "utf8");
}

const EU = new Set([
  "DE", "FR", "GB", "NL", "PL", "SE", "ES", "IT", "FI", "DK", "NO", "BE",
  "AT", "CH", "CZ", "PT", "RO", "HU", "IE", "UA", "SK", "BG", "HR", "LT",
  "LV", "EE", "GR",
]);

function regionFor(country: string) {
  if (["US", "CA", "MX"].includes(country)) return "NA";
  if (country === "RU") return "RU";
  if (country === "JP") return "JP";
  if (["CN", "HK", "TW", "MO"].includes(country)) return "CN";
  if (country === "KR") return "KR";
  if (country === "BR") return "BR";
  if (EU.has(country)) return "EU";
  return "AS";
}

function extraServer(host: string, port: number, hit: FallbackLive): ServerStatus {
  return {
    id: `open-${host.replaceAll(".", "-")}-${port}`,
    name: hit.name || "ZE Server",
    host,
    port,
    game: "cs2",
    region: regionFor(hit.country),
    community: "open",
    online: true,
    players: hit.players,
    maxPlayers: hit.maxPlayers,
    map: hit.map || "—",
    lastUpdated: new Date().toISOString(),
  };
}

function trendStint(map: string, players: number, history: number[]): MapStint | null {
  if (history.length < 2) return null;
  const start = history[0];
  const end = players || history[history.length - 1];
  const diff = end - start;
  return {
    map: map || "—",
    startedAt: new Date().toISOString(),
    endedAt: null,
    durationMinutes: 0,
    peakPlayers: Math.max(...history, end),
    startPlayers: start,
    endPlayers: end,
    trend: diff >= 3 ? "up" : diff <= -3 ? "down" : "flat",
    playerCounts: history,
    isCurrent: true,
  };
}

function detailFor(status: ServerStatus, history: number[]): ServerDetailResponse {
  return {
    server: {
      id: status.id,
      name: status.name,
      host: status.host,
      port: status.port,
      map: status.map,
      players: status.players,
      maxPlayers: status.maxPlayers,
      online: status.online,
      community: status.community,
    },
    playerList: [],
    currentMap: trendStint(status.map, status.players, history),
    mapHistory: [],
    history: { source: history.length > 1 ? "external" : "none" },
    fetchedAt: new Date().toISOString(),
  };
}

async function hydrateOwnHistory(localPath: string) {
  if (existsSync(localPath)) {
    try {
      const parsed = JSON.parse(readFileSync(localPath, "utf8")) as {
        servers?: SnapshotStore;
      };
      hydrateSnapshotStore(parsed.servers ?? (parsed as SnapshotStore));
    } catch {
      /* ignore corrupt local cache */
    }
  }

  try {
    const res = await fetch(ownHistoryUrl(), {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return;
    const parsed = (await res.json()) as { servers?: SnapshotStore };
    hydrateSnapshotStore(parsed.servers ?? (parsed as SnapshotStore));
  } catch {
    /* first deploy or site unreachable */
  }
}

async function hydrateOwnPeaks(localPath: string) {
  if (existsSync(localPath)) {
    try {
      hydratePeakStore(JSON.parse(readFileSync(localPath, "utf8")) as PeakStore);
    } catch {
      /* ignore corrupt local cache */
    }
  }

  try {
    const res = await fetch(ownPeaksUrl(), {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return;
    hydratePeakStore((await res.json()) as PeakStore);
  } catch {
    /* first deploy or site unreachable */
  }
}

async function generateServers(
  index: Map<string, FallbackLive>,
  communityLive: CommunityLive[],
): Promise<ServersResponse> {
  try {
    const queried = applyCommunityLive(
      await queryAllServers(SERVERS),
      communityLive,
    );
    const known = new Set(SERVERS.map((server) => `${server.host}:${server.port}`));
    const extras = [...index.entries()]
      .filter(([key, hit]) => !known.has(key) && hit.online && hit.players > 0)
      .map(([key, hit]) => {
        const [host, port] = key.split(":");
        return extraServer(host, Number(port), hit);
      });
    const servers = [...queried, ...extras].sort((a, b) => b.players - a.players);
    const online = servers.filter((server) => server.online).length;
    const players = servers.reduce((sum, server) => sum + server.players, 0);
    return {
      servers,
      updatedAt: new Date().toISOString(),
      totals: { online, players, tracked: servers.length },
    };
  } catch {
    return {
      servers: [],
      updatedAt: new Date().toISOString(),
      totals: { online: 0, players: 0, tracked: SERVERS.length },
    };
  }
}

async function main() {
  loadEnvFile(join(process.cwd(), ".env.local"));
  const historyPath = join(outDir, "history.json");
  const peaksPath = join(outDir, "peaks.json");
  await hydrateOwnHistory(historyPath);
  await hydrateOwnPeaks(peaksPath);

  const [index, communityLive] = await Promise.all([
    fetchLiveFallbackIndex(),
    fetchCommunityLive(),
  ]);
  const list = await generateServers(index, communityLive);

  recordServerSnapshots(list.servers);
  for (const live of communityLive) {
    recordNamedSnapshot(live.community, {
      at: live.mapStartedAt ?? new Date().toISOString(),
      map: live.map,
      players: live.players,
    });
  }

  seedPeaksFromSnapshots(exportSnapshotStore());
  recordPeakSamples(list.servers);

  writeJson(join(outDir, "servers.json"), list);
  writeJson(join(outDir, "directory.json"), { href: directoryUrl() ?? "" });

  await Promise.all(
    list.servers.map(async (status) => {
      const hit = index.get(`${status.host}:${status.port}`);
      const known = SERVERS.find((entry) => entry.id === status.id);
      try {
        if (!known) {
          const own = deriveMapStatsFromSnapshots(
            status.id,
            status.map,
            status.players,
            25,
          );
          const fallback = detailFor(status, hit?.history ?? []);
          writeJson(join(outDir, "servers", `${status.id}.json`), {
            ...fallback,
            currentMap: own.currentMap ?? fallback.currentMap,
            mapHistory: own.mapHistory.length
              ? own.mapHistory
              : fallback.mapHistory,
            history: {
              source:
                snapshotCount(status.id) >= 2
                  ? "a2s"
                  : fallback.history.source,
            },
            peaks: peakSummaryFor(status.id),
          });
          return;
        }
        let detail = applyCommunityDetail(
          await buildServerDetail(known),
          communityLive,
        );
        const trend = trendStint(
          detail.server.map,
          detail.server.players,
          hit?.history ?? [],
        );
        if (
          trend &&
          detail.history.source !== "a2s" &&
          (detail.currentMap?.playerCounts.length ?? 0) < 4
        ) {
          detail = {
            ...detail,
            currentMap: {
              ...(detail.currentMap ?? trend),
              playerCounts: trend.playerCounts,
              startPlayers: trend.startPlayers,
              endPlayers: trend.endPlayers,
              peakPlayers: Math.max(
                detail.currentMap?.peakPlayers ?? 0,
                trend.peakPlayers,
              ),
              trend: trend.trend,
            },
          };
        }
        writeJson(join(outDir, "servers", `${status.id}.json`), {
          ...detail,
          peaks: peakSummaryFor(status.id),
        });
      } catch {
        writeJson(join(outDir, "servers", `${status.id}.json`), {
          error: "unavailable",
          fetchedAt: new Date().toISOString(),
        });
      }
    }),
  );

  writeJson(historyPath, {
    updatedAt: new Date().toISOString(),
    servers: exportSnapshotStore(),
  });
  writeJson(peaksPath, exportPeakStore());

  for (const community of ["mapeadores", "gfl"] as const) {
    const progress = await buildMapProgress(community).catch(() => null);
    if (progress) {
      writeJson(join(outDir, "maps", `${community}.json`), progress);
    }
  }

  writeJson(join(outDir, "stats.json"), {
    week: {
      visitors: 0,
      pageViews: 0,
      peakPlayers: Math.max(
        list.totals.players,
        globalPeakSummary().allTimePeak?.players ?? 0,
      ),
      avgPlayers: list.totals.players,
      playerSamples: globalPeakSummary().samples,
    },
  });

  const communitySummary =
    communityLive
      .map((live) => `${live.community}:${live.map} ${live.players}/${live.maxPlayers}`)
      .join(", ") || "none";
  console.log(
    `Wrote live data for ${list.totals.tracked} servers (${list.totals.players} players). Community live: ${communitySummary}.`,
  );
}

void main();

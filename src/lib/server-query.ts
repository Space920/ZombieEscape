import { GameDig } from "gamedig";
import type { GameDigPlayer } from "gamedig";
import type { ServerEntry, ServerStatus } from "@/types/server";
import type { ServerPlayer } from "@/types/server-detail";
import {
  applyLiveFallback,
  fetchLiveFallbackIndex,
} from "@/lib/live-fallback";

const GAME_TYPE: Record<ServerEntry["game"], string> = {
  csgo: "csgo",
  cs2: "counterstrike2",
  css: "css",
};

const FALLBACK_TYPES: Partial<Record<ServerEntry["game"], string>> = {
  cs2: "csgo",
  csgo: "counterstrike2",
};

/** Slow failures are timeouts — retrying another protocol won't help. */
const FALLBACK_SLOW_MS = 3_000;

export interface QueryOptions {
  maxAttempts: number;
  socketTimeout: number;
  tryFallback: boolean;
  includePlayerList: boolean;
}

export const LIST_QUERY: QueryOptions = {
  maxAttempts: 1,
  socketTimeout: 2_000,
  tryFallback: false,
  includePlayerList: false,
};

export const DETAIL_QUERY: QueryOptions = {
  maxAttempts: 1,
  socketTimeout: 2_500,
  tryFallback: true,
  includePlayerList: true,
};

const LIST_SERVER_TIMEOUT_MS = 2_800;

export function mapPlayerList(players?: GameDigPlayer[]): ServerPlayer[] {
  return (players ?? [])
    .filter((p) => p.name && p.name.trim().length > 0)
    .map((p) => ({
      name: p.name!.trim(),
      score: p.raw?.score ?? 0,
      timeSeconds: Math.max(0, p.raw?.time ?? 0),
    }))
    .sort((a, b) => b.timeSeconds - a.timeSeconds);
}

async function queryWithType(
  entry: ServerEntry,
  type: string,
  options: QueryOptions,
): Promise<{ status: ServerStatus | null; durationMs: number }> {
  const started = Date.now();

  try {
    const result = await GameDig.query({
      type,
      host: entry.host,
      port: entry.port,
      maxAttempts: options.maxAttempts,
      socketTimeout: options.socketTimeout,
    });

    return {
      durationMs: Date.now() - started,
      status: {
        ...entry,
        online: true,
        players: result.numplayers ?? result.players?.length ?? 0,
        maxPlayers: result.maxplayers ?? 0,
        map: result.map ?? "Unknown",
        ping: result.ping,
        playerList: options.includePlayerList
          ? mapPlayerList(result.players)
          : undefined,
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch {
    return { status: null, durationMs: Date.now() - started };
  }
}

export async function queryServer(
  entry: ServerEntry,
  options: QueryOptions = DETAIL_QUERY,
): Promise<ServerStatus> {
  const offline = offlineStatus(entry);

  const primary = await queryWithType(entry, GAME_TYPE[entry.game], options);
  if (primary.status) return primary.status;

  const fallbackType = FALLBACK_TYPES[entry.game];
  const shouldTryFallback =
    options.tryFallback &&
    Boolean(fallbackType) &&
    primary.durationMs < FALLBACK_SLOW_MS;

  if (shouldTryFallback && fallbackType) {
    const fallback = await queryWithType(entry, fallbackType, options);
    if (fallback.status) return fallback.status;
  }

  return offline;
}

export async function queryServerDetail(
  entry: ServerEntry,
): Promise<ServerStatus> {
  const [status, fallback] = await Promise.all([
    queryServer(entry, DETAIL_QUERY),
    fetchLiveFallbackIndex(),
  ]);
  return applyLiveFallback(status, fallback);
}

function offlineStatus(entry: ServerEntry): ServerStatus {
  return {
    ...entry,
    online: false,
    players: 0,
    maxPlayers: 0,
    map: "—",
    playerList: [],
    lastUpdated: new Date().toISOString(),
  };
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallback: T,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function queryAllServers(
  entries: ServerEntry[],
): Promise<ServerStatus[]> {
  const [queried, fallback] = await Promise.all([
    Promise.all(
      entries.map((entry) =>
        withTimeout(
          queryServer(entry, LIST_QUERY),
          LIST_SERVER_TIMEOUT_MS,
          offlineStatus(entry),
        ),
      ),
    ),
    fetchLiveFallbackIndex(),
  ]);

  const results = queried.map((status) => applyLiveFallback(status, fallback));

  const sorted = results.sort((a, b) => b.players - a.players);

  return sorted.map((server, index) => ({
    ...server,
    rank: index + 1,
  }));
}

import type { ServerStatus } from "@/types/server";
import { FETCH_IDENTITY, liveFallbackUrl } from "@/lib/source-config";

const CACHE_TTL_MS = 60_000;

export interface FallbackLive {
  online: boolean;
  players: number;
  maxPlayers: number;
  map: string;
  name: string;
  country: string;
  history: number[];
}

interface FallbackServer {
  hostname?: string;
  ip?: string;
  port?: number;
  status?: string;
  current_players?: number;
  max_players?: number;
  map?: string;
  country_iso_code?: string;
  players_history?: number[];
}

interface FallbackResponse {
  servers?: FallbackServer[];
}

let cache: { at: number; index: Map<string, FallbackLive> } | null = null;

function keyFor(host: string, port: number) {
  return `${host}:${port}`;
}

function cleanName(hostname: string | undefined) {
  const cut = (hostname ?? "").split("|")[0]?.trim() ?? "";
  return cut.slice(0, 48);
}

function recentHistory(values: number[] | undefined) {
  if (!values?.length) return [];
  const numeric = values.filter((value) => Number.isFinite(value));
  return numeric.slice(-24);
}

export async function fetchLiveFallbackIndex(): Promise<
  Map<string, FallbackLive>
> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.index;
  }

  const url = liveFallbackUrl();
  if (!url) return cache?.index ?? new Map();

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": FETCH_IDENTITY,
      },
      signal: AbortSignal.timeout(4_000),
    });
    if (!res.ok) throw new Error("fallback unavailable");

    const data = (await res.json()) as FallbackResponse;
    const index = new Map<string, FallbackLive>();

    for (const server of data.servers ?? []) {
      if (!server.ip || !server.port) continue;
      index.set(keyFor(server.ip, server.port), {
        online: server.status === "up",
        players: server.current_players ?? 0,
        maxPlayers: server.max_players ?? 0,
        map: server.map ?? "—",
        name: cleanName(server.hostname),
        country: (server.country_iso_code ?? "").toUpperCase(),
        history: recentHistory(server.players_history),
      });
    }

    cache = { at: Date.now(), index };
    return index;
  } catch {
    return cache?.index ?? new Map();
  }
}

export function applyLiveFallback(
  status: ServerStatus,
  index: Map<string, FallbackLive>,
): ServerStatus {
  if (status.online) return status;

  const hit = index.get(keyFor(status.host, status.port));
  if (!hit?.online) return status;

  return {
    ...status,
    online: true,
    players: hit.players,
    maxPlayers: hit.maxPlayers,
    map: hit.map || status.map,
  };
}

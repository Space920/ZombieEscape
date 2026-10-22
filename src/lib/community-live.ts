import {
  COMMUNITY_USER_AGENT,
  gflStatusUrl,
  mapeadoresStatusUrl,
} from "@/lib/source-config";
import type { ServerStatus } from "@/types/server";
import type { ServerPlayer } from "@/types/server-detail";

export type CommunityLiveId = "gfl" | "mapeadores";

export interface CommunityLive {
  community: CommunityLiveId;
  online: boolean;
  map: string;
  players: number;
  maxPlayers: number;
  mapStartedAt: string | null;
  nextMap: string;
  playerList: ServerPlayer[];
}

const FETCH_HEADERS = {
  Accept: "application/json, text/x-component, text/html",
  "User-Agent": COMMUNITY_USER_AGENT,
};

function fieldString(source: string, key: string): string | null {
  const match = source.match(new RegExp(`"${key}":"([^"]*)"`));
  return match?.[1] ?? null;
}

function fieldNumber(source: string, key: string): number | null {
  const match = source.match(new RegExp(`"${key}":(-?\\d+(?:\\.\\d+)?)`));
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function parseGflStatus(payload: string): CommunityLive | null {
  const map = fieldString(payload, "currentMap");
  const players = fieldNumber(payload, "currentPlayers");
  const maxPlayers = fieldNumber(payload, "maxPlayers");
  if (!map || players == null || maxPlayers == null) return null;

  const startedUnix = fieldNumber(payload, "currentMapStarted");
  const mapStartedAt =
    startedUnix && startedUnix > 1_000_000_000
      ? new Date(startedUnix * 1000).toISOString()
      : null;

  return {
    community: "gfl",
    online: true,
    map,
    players,
    maxPlayers,
    mapStartedAt,
    nextMap: fieldString(payload, "nextMap") ?? "",
    playerList: [],
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseMapeadoresStatus(payload: unknown): CommunityLive | null {
  const data = asRecord(payload);
  if (!data) return null;

  const map = typeof data.map === "string" ? data.map : "";
  const players =
    typeof data.playerCount === "number"
      ? data.playerCount
      : Array.isArray(data.players)
        ? data.players.length
        : null;
  const maxPlayers =
    typeof data.maxPlayers === "number" ? data.maxPlayers : null;
  if (!map || players == null || maxPlayers == null) return null;

  const playerList: ServerPlayer[] = Array.isArray(data.players)
    ? data.players.flatMap((entry) => {
        const row = asRecord(entry);
        const name = typeof row?.name === "string" ? row.name.trim() : "";
        if (!name) return [];
        return [
          {
            name,
            score: typeof row.score === "number" ? row.score : 0,
            timeSeconds: 0,
          },
        ];
      })
    : [];

  return {
    community: "mapeadores",
    online: data.online !== false,
    map,
    players,
    maxPlayers,
    mapStartedAt: null,
    nextMap: "",
    playerList,
  };
}

async function fetchText(
  url: string,
  extraHeaders?: Record<string, string>,
): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { ...FETCH_HEADERS, ...extraHeaders },
      cache: "no-store",
      signal: AbortSignal.timeout(6_000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function fetchGflStatus(): Promise<CommunityLive | null> {
  const url = gflStatusUrl();
  if (!url) return null;
  const payload = await fetchText(url, {
    Accept: "text/x-component, text/html",
    RSC: "1",
  });
  return payload ? parseGflStatus(payload) : null;
}

export async function fetchMapeadoresStatus(): Promise<CommunityLive | null> {
  const url = mapeadoresStatusUrl();
  if (!url) return null;

  const payload = await fetchText(url, { Accept: "application/json" });
  if (!payload) return null;

  try {
    return parseMapeadoresStatus(JSON.parse(payload));
  } catch {
    return null;
  }
}

export async function fetchCommunityLive(): Promise<CommunityLive[]> {
  const results = await Promise.all([
    fetchGflStatus(),
    fetchMapeadoresStatus(),
  ]);
  return results.filter((live): live is CommunityLive => live != null);
}

export function applyCommunityLive(
  servers: ServerStatus[],
  lives: CommunityLive[],
): ServerStatus[] {
  if (!lives.length) return servers;
  const byId = new Map(lives.map((live) => [live.community, live]));

  return servers.map((server) => {
    const live = byId.get(server.id as CommunityLiveId);
    if (!live) return server;
    if (server.online && server.players > 0 && server.map !== "—") {
      return server;
    }

    return {
      ...server,
      online: live.online,
      players: live.players,
      maxPlayers: live.maxPlayers || server.maxPlayers,
      map: live.map || server.map,
      lastUpdated: new Date().toISOString(),
    };
  });
}

export function applyCommunityDetail<T extends {
  server: {
    id: string;
    map: string;
    players: number;
    maxPlayers: number;
    online: boolean;
  };
  playerList: ServerPlayer[];
  currentMap: {
    map: string;
    startedAt: string;
    durationMinutes: number;
  } | null;
}>(detail: T, lives: CommunityLive[]): T {
  const live = lives.find((item) => item.community === detail.server.id);
  if (!live) return detail;

  const serverNeedsFill =
    !detail.server.online ||
    detail.server.players <= 0 ||
    detail.server.map === "—";

  const started = live.mapStartedAt ? Date.parse(live.mapStartedAt) : NaN;
  const currentMap =
    detail.currentMap &&
    live.mapStartedAt &&
    Number.isFinite(started) &&
    detail.currentMap.map === live.map
      ? {
          ...detail.currentMap,
          startedAt: live.mapStartedAt,
          durationMinutes: Math.max(
            0,
            Math.round((Date.now() - started) / 60_000),
          ),
        }
      : detail.currentMap;

  return {
    ...detail,
    server: serverNeedsFill
      ? {
          ...detail.server,
          online: live.online,
          players: live.players,
          maxPlayers: live.maxPlayers || detail.server.maxPlayers,
          map: live.map || detail.server.map,
        }
      : detail.server,
    playerList:
      detail.playerList.length > 0 ? detail.playerList : live.playerList,
    currentMap,
  };
}

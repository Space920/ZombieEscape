export type Game = "csgo" | "cs2" | "css";
export type CommunityId =
  | "gfl"
  | "mapeadores"
  | "unloze"
  | "net4all"
  | "possession"
  | "nide"
  | "avalon"
  | "rss"
  | "lupercalia"
  | "enemydowns"
  | "kult"
  | "zmbio"
  | "zed"
  | "kaishui"
  | "zero"
  | "upkk";

import type { ServerPlayer } from "@/types/server-detail";

/** Static server configuration — live status comes from the API. */
export interface ServerEntry {
  id: string;
  name: string;
  host: string;
  port: number;
  game: Game;
  region: string;
  community: CommunityId;
  website?: string;
  discord?: string;
  tags?: string[];
  /** Reserved for future use — not displayed yet */
  description?: string;
  /** Reserved for future use — not displayed yet */
  lastSeenOnline?: string;
}

export interface ServerStatus extends ServerEntry {
  online: boolean;
  players: number;
  maxPlayers: number;
  map: string;
  ping?: number;
  lastUpdated: string;
  rank?: number;
  playerList?: ServerPlayer[];
}

export interface ServersResponse {
  servers: ServerStatus[];
  updatedAt: string;
  totals: {
    online: number;
    players: number;
    tracked: number;
  };
}

export type SortOption =
  | "most-players"
  | "least-players"
  | "community"
  | "name"
  | "favorites-first";

export type CommunityFilter = "all" | CommunityId;

export type RegionFilter =
  | "all"
  | "NA"
  | "EU"
  | "RU"
  | "JP"
  | "BR"
  | "KR"
  | "AS"
  | "CN";

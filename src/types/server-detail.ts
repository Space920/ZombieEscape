export type PlayerTrend = "up" | "down" | "flat";

export interface ServerPlayer {
  name: string;
  score: number;
  timeSeconds: number;
}

export interface MapStint {
  map: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number;
  peakPlayers: number;
  startPlayers: number;
  endPlayers: number;
  trend: PlayerTrend;
  playerCounts: number[];
  isCurrent: boolean;
}

export interface ServerHistoryMeta {
  source: "a2s" | "external" | "none";
  periodStart?: string;
  periodEnd?: string;
  overallTrend?: string;
  trendPercent?: number;
  externalUrl?: string;
  externalLabel?: string;
  mapHistoryGraphUrl?: string;
  playerHistoryGraphUrl?: string;
}

export interface PeakHit {
  players: number;
  at: string;
  map: string;
}

export interface PeakSummary {
  samples: number;
  weekdaysCovered: number;
  allTimePeak: PeakHit | null;
  busiestWeekday: number | null;
  busiestHour: number | null;
  weekdayAvg: number[];
  hourAvg: number[];
}

export interface ServerDetailResponse {
  server: {
    id: string;
    name: string;
    host: string;
    port: number;
    map: string;
    players: number;
    maxPlayers: number;
    online: boolean;
    ping?: number;
    community: string;
  };
  playerList: ServerPlayer[];
  currentMap: MapStint | null;
  mapHistory: MapStint[];
  history: ServerHistoryMeta;
  peaks?: PeakSummary | null;
  fetchedAt: string;
}

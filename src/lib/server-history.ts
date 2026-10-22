import type { MapStint, PlayerTrend, ServerHistoryMeta } from "@/types/server-detail";
import { filterRecentMapHistory, isRecentMapStint } from "@/lib/map-history";
import { FETCH_IDENTITY, historyGraphUrl } from "@/lib/source-config";

interface HistoryPoint {
  time: string;
  players: number;
  map: string;
}

export interface HistoryGraph {
  period_start?: string;
  period_end?: string;
  analysis?: {
    averages?: {
      trend?: string;
      deviation_percent?: number;
    };
  };
  points?: HistoryPoint[];
}

export function historySlug(host: string, port: number): string {
  return `${host}:${port}`.replace(/[.:]/g, "_");
}

export async function fetchHistoryGraph(
  host: string,
  port: number,
): Promise<HistoryGraph | null> {
  const url = historyGraphUrl(historySlug(host, port));
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: 900 },
      headers: { "User-Agent": FETCH_IDENTITY },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function computeTrend(start: number, end: number): PlayerTrend {
  const diff = end - start;
  if (diff >= 3) return "up";
  if (diff <= -3) return "down";
  return "flat";
}

function downsample(values: number[], maxBars = 24): number[] {
  if (values.length <= maxBars) return values;
  const step = values.length / maxBars;
  const sampled: number[] = [];
  for (let i = 0; i < maxBars; i++) {
    const idx = Math.min(Math.floor(i * step), values.length - 1);
    sampled.push(values[idx]);
  }
  return sampled;
}

function stintFromSegment(
  segment: HistoryPoint[],
  isCurrent: boolean,
): MapStint {
  const startPlayers = segment[0].players;
  const endPlayers = segment[segment.length - 1].players;
  const playerCounts = segment.map((p) => p.players);
  const startTime = new Date(segment[0].time.replace(" ", "T"));
  const endTime = new Date(segment[segment.length - 1].time.replace(" ", "T"));
  const elapsedMinutes = Math.round(
    (endTime.getTime() - startTime.getTime()) / 60_000,
  );

  return {
    map: segment[0].map,
    startedAt: segment[0].time,
    endedAt: isCurrent ? null : segment[segment.length - 1].time,
    durationMinutes:
      elapsedMinutes > 0
        ? elapsedMinutes
        : Math.max(0, (segment.length - 1) * 6),
    peakPlayers: Math.max(...playerCounts),
    startPlayers,
    endPlayers,
    trend: computeTrend(startPlayers, endPlayers),
    playerCounts: downsample(playerCounts),
    isCurrent,
  };
}

export function deriveMapStints(
  points: HistoryPoint[],
  currentMap?: string,
  livePlayers = 0,
  limit = 10,
): { currentMap: MapStint | null; mapHistory: MapStint[] } {
  if (
    !currentMap ||
    currentMap === "—" ||
    currentMap === "Unknown" ||
    currentMap === "???"
  ) {
    return { currentMap: null, mapHistory: [] };
  }

  if (points.length === 0) {
    return {
      currentMap: liveStint(currentMap, livePlayers),
      mapHistory: [],
    };
  }

  const segments: MapStint[] = [];
  let i = 0;

  while (i < points.length) {
    const map = points[i].map;
    let j = i + 1;
    while (j < points.length && points[j].map === map) j++;
    segments.push(stintFromSegment(points.slice(i, j), false));
    i = j;
  }

  let current: MapStint | null = null;
  let historySegments = [...segments];

  const lastSegment = segments[segments.length - 1];
  if (lastSegment.map === currentMap) {
    const started = new Date(lastSegment.startedAt.replace(" ", "T"));
    const durationMinutes = Math.max(
      lastSegment.durationMinutes,
      Math.round((Date.now() - started.getTime()) / 60_000),
    );
    current = {
      ...lastSegment,
      isCurrent: true,
      endedAt: null,
      durationMinutes,
      endPlayers: livePlayers || lastSegment.endPlayers,
      peakPlayers: Math.max(lastSegment.peakPlayers, livePlayers),
      trend: computeTrend(
        lastSegment.startPlayers,
        livePlayers || lastSegment.endPlayers,
      ),
    };
    historySegments = segments.slice(0, -1);
  } else {
    current = liveStint(currentMap, livePlayers, points[points.length - 1]?.time);
  }

  return {
    currentMap: current,
    mapHistory: filterRecentMapHistory(
      historySegments.reverse().filter((stint) => isRecentMapStint(stint)),
      limit,
    ),
  };
}

function liveStint(
  map: string,
  livePlayers: number,
  since?: string,
): MapStint {
  const startedAt = since ?? new Date().toISOString();
  const started = new Date(startedAt.replace(" ", "T"));
  const durationMinutes = since
    ? Math.max(0, Math.round((Date.now() - started.getTime()) / 60_000))
    : 0;

  return {
    map,
    startedAt,
    endedAt: null,
    durationMinutes,
    peakPlayers: livePlayers,
    startPlayers: livePlayers,
    endPlayers: livePlayers,
    trend: "flat",
    playerCounts: livePlayers > 0 ? [livePlayers] : [],
    isCurrent: true,
  };
}

export function buildHistoryMeta(
  graph: HistoryGraph | null,
): ServerHistoryMeta {
  if (!graph?.points?.length) {
    return { source: "none" };
  }

  return {
    source: "external",
    periodStart: graph.period_start,
    periodEnd: graph.period_end,
    overallTrend: graph.analysis?.averages?.trend,
    trendPercent: graph.analysis?.averages?.deviation_percent,
  };
}

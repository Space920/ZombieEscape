import type { ServerStatus } from "@/types/server";
import type { PeakHit, PeakSummary } from "@/types/server-detail";
import type { SnapshotStore } from "@/lib/map-snapshots";

export type { PeakHit, PeakSummary };

export interface PeakBin {
  sum: number;
  count: number;
  peak: number;
}

export interface PeakProfile {
  samples: number;
  lastAt: string;
  allTimePeak: PeakHit | null;
  byHour: PeakBin[];
  byWeekday: PeakBin[];
  byWeekdayHour: PeakBin[];
}

export interface PeakStore {
  updatedAt: string;
  timezone: "UTC";
  global: PeakProfile;
  servers: Record<string, PeakProfile>;
}

const HOURS = 24;
const DAYS = 7;
const SLOTS = DAYS * HOURS;
const DEDUPE_MS = 8 * 60 * 1000;
const BUCKET_MS = 15 * 60 * 1000;

let store: PeakStore = emptyStore();

function emptyBin(): PeakBin {
  return { sum: 0, count: 0, peak: 0 };
}

function emptyBins(length: number): PeakBin[] {
  return Array.from({ length }, emptyBin);
}

function emptyProfile(): PeakProfile {
  return {
    samples: 0,
    lastAt: "",
    allTimePeak: null,
    byHour: emptyBins(HOURS),
    byWeekday: emptyBins(DAYS),
    byWeekdayHour: emptyBins(SLOTS),
  };
}

function emptyStore(): PeakStore {
  return {
    updatedAt: new Date().toISOString(),
    timezone: "UTC",
    global: emptyProfile(),
    servers: {},
  };
}

function cloneBin(bin: PeakBin | undefined): PeakBin {
  return {
    sum: Number(bin?.sum) || 0,
    count: Number(bin?.count) || 0,
    peak: Number(bin?.peak) || 0,
  };
}

function normalizeBins(list: PeakBin[] | undefined, length: number): PeakBin[] {
  const next = emptyBins(length);
  if (!Array.isArray(list)) return next;
  for (let i = 0; i < Math.min(length, list.length); i++) {
    next[i] = cloneBin(list[i]);
  }
  return next;
}

function normalizeHit(value: unknown): PeakHit | null {
  if (!value || typeof value !== "object") return null;
  const row = value as PeakHit;
  const players = Number(row.players);
  if (!Number.isFinite(players) || players < 0) return null;
  const at = typeof row.at === "string" ? row.at : "";
  if (!Date.parse(at)) return null;
  return {
    players,
    at,
    map: typeof row.map === "string" ? row.map : "",
  };
}

function normalizeProfile(value: unknown): PeakProfile {
  const row = (value ?? {}) as Partial<PeakProfile>;
  return {
    samples: Number(row.samples) || 0,
    lastAt: typeof row.lastAt === "string" ? row.lastAt : "",
    allTimePeak: normalizeHit(row.allTimePeak),
    byHour: normalizeBins(row.byHour, HOURS),
    byWeekday: normalizeBins(row.byWeekday, DAYS),
    byWeekdayHour: normalizeBins(row.byWeekdayHour, SLOTS),
  };
}

function addToBin(bin: PeakBin, players: number) {
  bin.sum += players;
  bin.count += 1;
  bin.peak = Math.max(bin.peak, players);
}

function recordInto(
  profile: PeakProfile,
  sample: { at: string; players: number; map?: string },
): void {
  const players = Math.max(0, Math.round(sample.players));
  const ts = Date.parse(sample.at);
  if (!Number.isFinite(ts)) return;

  if (profile.lastAt) {
    const prev = Date.parse(profile.lastAt);
    if (Number.isFinite(prev) && Math.abs(ts - prev) < DEDUPE_MS) {
      if (
        !profile.allTimePeak ||
        players > profile.allTimePeak.players
      ) {
        profile.allTimePeak = {
          players,
          at: sample.at,
          map: sample.map ?? profile.allTimePeak?.map ?? "",
        };
      }
      return;
    }
  }

  const date = new Date(ts);
  const hour = date.getUTCHours();
  const weekday = date.getUTCDay();
  addToBin(profile.byHour[hour], players);
  addToBin(profile.byWeekday[weekday], players);
  addToBin(profile.byWeekdayHour[weekday * HOURS + hour], players);
  profile.samples += 1;
  profile.lastAt = sample.at;

  if (!profile.allTimePeak || players > profile.allTimePeak.players) {
    profile.allTimePeak = {
      players,
      at: sample.at,
      map: sample.map ?? "",
    };
  }
}

function avgOf(bin: PeakBin): number {
  return bin.count > 0 ? bin.sum / bin.count : 0;
}

function argMax(values: number[]): number | null {
  let best = -1;
  let index: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > best) {
      best = values[i];
      index = i;
    }
  }
  return best > 0 ? index : null;
}

export function summarizePeakProfile(profile: PeakProfile): PeakSummary {
  const source = normalizeProfile(profile);
  const weekdayAvg = source.byWeekday.map((bin) => Math.round(avgOf(bin)));
  const hourAvg = source.byHour.map((bin) => Math.round(avgOf(bin)));
  const slotAvg = source.byWeekdayHour.map((bin) => avgOf(bin));
  const slot = argMax(slotAvg);

  return {
    samples: source.samples,
    weekdaysCovered: source.byWeekday.filter((bin) => bin.count > 0).length,
    allTimePeak: source.allTimePeak,
    busiestWeekday: slot != null ? Math.floor(slot / HOURS) : argMax(weekdayAvg),
    busiestHour: slot != null ? slot % HOURS : argMax(hourAvg),
    weekdayAvg,
    hourAvg,
  };
}

export function hydratePeakStore(incoming: PeakStore | null | undefined): void {
  if (!incoming || typeof incoming !== "object") return;
  const next = normalizeStore(incoming);
  if (next.global.samples >= store.global.samples) {
    store = next;
  }
}

function normalizeStore(incoming: PeakStore): PeakStore {
  const servers: Record<string, PeakProfile> = {};
  for (const [id, profile] of Object.entries(incoming.servers ?? {})) {
    const normalized = normalizeProfile(profile);
    if (normalized.samples > 0) servers[id] = normalized;
  }
  return {
    updatedAt:
      typeof incoming.updatedAt === "string"
        ? incoming.updatedAt
        : new Date().toISOString(),
    timezone: "UTC",
    global: normalizeProfile(incoming.global),
    servers,
  };
}

export function exportPeakStore(): PeakStore {
  return {
    updatedAt: new Date().toISOString(),
    timezone: "UTC",
    global: store.global,
    servers: store.servers,
  };
}

export function recordPeakSamples(servers: ServerStatus[]): void {
  const at = new Date().toISOString();
  let total = 0;

  for (const server of servers) {
    if (!server.online) continue;
    const players = Math.max(0, server.players);
    total += players;
    const profile = store.servers[server.id] ?? emptyProfile();
    recordInto(profile, {
      at: server.lastUpdated || at,
      players,
      map: server.map,
    });
    store.servers[server.id] = profile;
  }

  recordInto(store.global, { at, players: total, map: "" });
}

export function seedPeaksFromSnapshots(snapshots: SnapshotStore): void {
  if (store.global.samples > 0) return;

  const buckets = new Map<number, Map<string, { players: number; map: string }>>();

  for (const [id, list] of Object.entries(snapshots)) {
    if (!Array.isArray(list)) continue;
    const profile = store.servers[id] ?? emptyProfile();
    for (const sample of list) {
      const ts = Date.parse(sample.at);
      if (!Number.isFinite(ts) || sample.players < 0) continue;
      recordInto(profile, sample);
      const bucket = Math.floor(ts / BUCKET_MS);
      const group = buckets.get(bucket) ?? new Map();
      const prev = group.get(id);
      if (!prev || sample.players > prev.players) {
        group.set(id, { players: sample.players, map: sample.map });
      }
      buckets.set(bucket, group);
    }
    if (profile.samples > 0) store.servers[id] = profile;
  }

  const ordered = [...buckets.entries()].sort((a, b) => a[0] - b[0]);
  for (const [bucket, group] of ordered) {
    let total = 0;
    for (const entry of group.values()) total += entry.players;
    recordInto(store.global, {
      at: new Date(bucket * BUCKET_MS).toISOString(),
      players: total,
      map: "",
    });
  }
}

export function peakSummaryFor(serverId: string): PeakSummary | null {
  const profile = store.servers[serverId];
  if (!profile || profile.samples < 1) return null;
  return summarizePeakProfile(profile);
}

export function globalPeakSummary(): PeakSummary {
  return summarizePeakProfile(store.global);
}

export function utcSlotToLocal(weekdayUtc: number, hourUtc: number) {
  const now = new Date();
  const delta = weekdayUtc - now.getUTCDay();
  const date = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + delta,
      hourUtc,
      0,
      0,
      0,
    ),
  );
  return { date, day: date.getDay(), hour: date.getHours() };
}

export function rotateHoursToLocal(hourAvg: number[]): number[] {
  const offset = new Date().getTimezoneOffset() / -60;
  const shift = ((Math.round(offset) % HOURS) + HOURS) % HOURS;
  return hourAvg.map((_, index) => hourAvg[(index - shift + HOURS) % HOURS]);
}

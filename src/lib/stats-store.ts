import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_PLAYER_SAMPLE_MS = 5 * 60_000;

export interface PlayerSnapshot {
  at: string;
  totalPlayers: number;
  onlineServers: number;
}

export interface DailyVisits {
  date: string;
  pageViews: number;
  uniqueHashes: string[];
}

interface StatsStore {
  playerSnapshots: PlayerSnapshot[];
  dailyVisits: DailyVisits[];
}

let writeLock: Promise<void> = Promise.resolve();

function dataDir(): string {
  return process.env.STATS_DATA_DIR || path.join(process.cwd(), ".data");
}

function dataFile(): string {
  return path.join(dataDir(), "stats.json");
}

function hashVisitor(ip: string, userAgent: string, date: string): string {
  const salt = process.env.STATS_SALT || "ze-servers-dev";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${date}:${ip}:${userAgent}`)
    .digest("hex")
    .slice(0, 16);
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyStore(): StatsStore {
  return { playerSnapshots: [], dailyVisits: [] };
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(dataDir(), { recursive: true });
}

async function readStore(): Promise<StatsStore> {
  try {
    const raw = await fs.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw) as StatsStore;
    return {
      playerSnapshots: parsed.playerSnapshots ?? [],
      dailyVisits: parsed.dailyVisits ?? [],
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: StatsStore): Promise<void> {
  await ensureDir();
  await fs.writeFile(dataFile(), JSON.stringify(store, null, 0), "utf8");
}

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function trimStore(store: StatsStore): StatsStore {
  const cutoff = Date.now() - WEEK_MS;

  const playerSnapshots = store.playerSnapshots.filter(
    (s) => new Date(s.at).getTime() >= cutoff,
  );

  const cutoffDate = new Date(cutoff).toISOString().slice(0, 10);
  const dailyVisits = store.dailyVisits.filter((d) => d.date >= cutoffDate);

  return { playerSnapshots, dailyVisits };
}

export async function recordPlayerSnapshot(
  totalPlayers: number,
  onlineServers: number,
): Promise<void> {
  await withLock(async () => {
    const store = trimStore(await readStore());
    const now = Date.now();
    const last = store.playerSnapshots.at(-1);

    if (
      last &&
      now - new Date(last.at).getTime() < MIN_PLAYER_SAMPLE_MS &&
      last.totalPlayers === totalPlayers &&
      last.onlineServers === onlineServers
    ) {
      return;
    }

    store.playerSnapshots.push({
      at: new Date().toISOString(),
      totalPlayers,
      onlineServers,
    });

    await writeStore(store);
  });
}

export async function recordPageVisit(
  ip: string,
  userAgent: string,
): Promise<void> {
  await withLock(async () => {
    const store = trimStore(await readStore());
    const date = todayUtc();
    const hash = hashVisitor(ip, userAgent, date);

    let day = store.dailyVisits.find((d) => d.date === date);
    if (!day) {
      day = { date, pageViews: 0, uniqueHashes: [] };
      store.dailyVisits.push(day);
    }

    day.pageViews += 1;
    if (!day.uniqueHashes.includes(hash)) {
      day.uniqueHashes.push(hash);
    }

    await writeStore(store);
  });
}

export interface WeeklyStatsSummary {
  visitors: number;
  pageViews: number;
  peakPlayers: number;
  avgPlayers: number;
  playerSamples: number;
}

export async function getWeeklyStats(): Promise<WeeklyStatsSummary> {
  const store = trimStore(await readStore());
  const uniqueVisitors = new Set<string>();
  let pageViews = 0;

  for (const day of store.dailyVisits) {
    pageViews += day.pageViews;
    for (const hash of day.uniqueHashes) {
      uniqueVisitors.add(hash);
    }
  }

  const players = store.playerSnapshots.map((s) => s.totalPlayers);
  const peakPlayers = players.length ? Math.max(...players) : 0;
  const avgPlayers = players.length
    ? Math.round(players.reduce((a, b) => a + b, 0) / players.length)
    : 0;

  return {
    visitors: uniqueVisitors.size,
    pageViews,
    peakPlayers,
    avgPlayers,
    playerSamples: store.playerSnapshots.length,
  };
}

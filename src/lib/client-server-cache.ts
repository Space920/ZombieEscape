import type { ServersResponse } from "@/types/server";

const STORAGE_KEY = "ze-servers-cache";
const CLIENT_TTL_MS = 3 * 60_000;

export function readClientServersCache(): ServersResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { at: number; data: ServersResponse };
    if (Date.now() - parsed.at > CLIENT_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function writeClientServersCache(data: ServersResponse): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ at: Date.now(), data }),
    );
  } catch {
    // quota / private mode
  }
}

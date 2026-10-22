import { SITE_URL } from "@/lib/site";
import { COMMUNITIES } from "@/data/communities";

export const SOURCE_LABEL = "unknown_contact_dev";

function readSource(name: string): string | null {
  const value = process.env[name]?.trim();
  if (!value || value === SOURCE_LABEL) return null;
  return value;
}

export function liveFallbackUrl(): string | null {
  return readSource("LIVE_FALLBACK_URL");
}

export function historyGraphUrl(slug: string): string | null {
  const template = readSource("HISTORY_GRAPH_URL");
  if (!template) return null;
  return template.replaceAll("{slug}", slug);
}

export function directoryUrl(): string | null {
  const value = readSource("DIRECTORY_URL");
  if (!value || !/^https?:\/\//i.test(value)) return null;
  return value;
}

export function mapProgressCsvUrl(
  community: "mapeadores" | "gfl",
): string | null {
  return community === "gfl"
    ? readSource("MAP_PROGRESS_GFL_CSV")
    : readSource("MAP_PROGRESS_MAPEADORES_CSV");
}

function communityWebsite(id: keyof typeof COMMUNITIES): string | null {
  return COMMUNITIES[id].website?.replace(/\/$/, "") ?? null;
}

export function gflStatusUrl(): string | null {
  const override = readSource("GFL_STATUS_URL");
  if (override) return override;
  const website = communityWebsite("gfl");
  return website ? `${website}/serverinfo` : null;
}

export function mapeadoresStatusUrl(): string | null {
  const override = readSource("MAPEADORES_STATUS_URL");
  if (override) return override;
  const website = communityWebsite("mapeadores");
  return website ? `${website}/api/server` : null;
}

export function ownHistoryUrl(): string {
  return readSource("OWN_HISTORY_URL") ?? `${SITE_URL}/data/history.json`;
}

export function ownPeaksUrl(): string {
  return readSource("OWN_PEAKS_URL") ?? `${SITE_URL}/data/peaks.json`;
}

export const FETCH_IDENTITY = SOURCE_LABEL;
export const COMMUNITY_USER_AGENT = `ZEServers/1.0 (+${SITE_URL})`;

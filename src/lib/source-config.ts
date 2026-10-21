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

export function mapProgressCsvUrl(
  community: "mapeadores" | "gfl",
): string | null {
  return community === "gfl"
    ? readSource("MAP_PROGRESS_GFL_CSV")
    : readSource("MAP_PROGRESS_MAPEADORES_CSV");
}

export const FETCH_IDENTITY = SOURCE_LABEL;

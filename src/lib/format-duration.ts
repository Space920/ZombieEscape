import { interpolate } from "@/i18n/translate";

export function formatDuration(
  seconds: number,
  _localeTag = "en",
  labels?: {
    dash: string;
    hours: string;
    minutesSeconds: string;
    seconds: string;
  },
): string {
  const dash = labels?.dash ?? "—";
  if (seconds < 0 || !Number.isFinite(seconds)) return dash;
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return labels
      ? interpolate(labels.hours, { h, m })
      : `${h}h ${m}m`;
  }
  if (m > 0) {
    return labels
      ? interpolate(labels.minutesSeconds, { m, s })
      : `${m}m ${s}s`;
  }
  return labels ? interpolate(labels.seconds, { s }) : `${s}s`;
}

export function formatDateTime(isoOrLocal: string, locale = "en"): string {
  const date = new Date(isoOrLocal.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return isoOrLocal;
  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDurationMinutes(
  minutes: number,
  labels?: { min: string; hours: string },
): string {
  if (minutes < 60) {
    return labels ? interpolate(labels.min, { n: minutes }) : `${minutes} min`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return labels
    ? interpolate(labels.hours, { h, m })
    : m > 0
      ? `${h}h ${m}m`
      : `${h}h`;
}

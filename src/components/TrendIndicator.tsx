"use client";

import type { PlayerTrend } from "@/types/server-detail";
import { useTranslations } from "@/i18n/LocaleProvider";

const TREND_ICONS: Record<PlayerTrend, { icon: string; className: string }> = {
  up: { icon: "↑", className: "text-[var(--accent-green)]" },
  down: { icon: "↓", className: "text-ze-red" },
  flat: { icon: "→", className: "text-[var(--text-secondary)]" },
};

interface TrendIndicatorProps {
  trend: PlayerTrend;
  delta?: number;
  compact?: boolean;
}

export default function TrendIndicator({
  trend,
  delta,
  compact = false,
}: TrendIndicatorProps) {
  const t = useTranslations();
  const config = TREND_ICONS[trend];
  const label = t(`trend.${trend}`);
  const deltaLabel =
    delta != null && delta !== 0
      ? ` (${delta > 0 ? "+" : ""}${delta})`
      : "";

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-semibold tabular-nums ${config.className}`}
      title={`${label}${deltaLabel}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {!compact && (
        <span className="text-[11px] font-medium">
          {label}
          {deltaLabel}
        </span>
      )}
      {compact && delta != null && delta !== 0 && (
        <span className="text-[11px]">{deltaLabel.trim()}</span>
      )}
    </span>
  );
}

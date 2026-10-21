"use client";

import { useTranslations } from "@/i18n/LocaleProvider";

interface ServerStatsBarProps {
  online: number;
  players: number;
  loading: boolean;
}

export default function ServerStatsBar({
  online,
  players,
  loading,
}: ServerStatsBarProps) {
  const t = useTranslations();

  const items = [
    {
      value: loading ? t("duration.dash") : players,
      label: t("stats.playersOnline"),
      highlight: true,
    },
    {
      value: loading ? t("duration.dash") : online,
      label: t("stats.serversLive"),
    },
  ];

  return (
    <div
      className="mb-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-[var(--border-subtle)] pb-4 text-sm"
      aria-label={t("stats.ariaLabel")}
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-1.5">
          <span
            className={`text-base font-bold tabular-nums ${
              item.highlight
                ? "text-[var(--accent-green)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {item.value}
          </span>
          <span className="text-[var(--text-secondary)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

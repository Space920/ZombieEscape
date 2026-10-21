"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/LocaleProvider";

interface WeeklyStatsResponse {
  week: {
    visitors: number;
    pageViews: number;
    peakPlayers: number;
    avgPlayers: number;
    playerSamples: number;
  };
}

export default function WeeklyStats() {
  const t = useTranslations();
  const [stats, setStats] = useState<WeeklyStatsResponse["week"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/stats", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: WeeklyStatsResponse | null) => {
        if (!cancelled && data?.week) setStats(data.week);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="mb-4 text-[11px] text-[var(--text-secondary)]/70">
        {t("weeklyStats.loading")}
      </p>
    );
  }

  if (!stats || (stats.visitors === 0 && stats.playerSamples === 0)) {
    return null;
  }

  return (
    <p className="mb-4 text-[11px] text-[var(--text-secondary)]/80">
      {t("weeklyStats.summary", {
        visitors: stats.visitors,
        peak: stats.peakPlayers,
        avg: stats.avgPlayers,
      })}
    </p>
  );
}

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { computeLiveActivity } from "@/lib/live-activity";
import type { ServerStatus } from "@/types/server";
import { useLocale, useTranslations } from "@/i18n/LocaleProvider";

interface ZeLiveActivityProps {
  servers: ServerStatus[];
  lastUpdated: Date | null;
  loading: boolean;
}

export default function ZeLiveActivity({
  servers,
  lastUpdated,
  loading,
}: ZeLiveActivityProps) {
  const t = useTranslations();
  const { localeTag } = useLocale();

  const activity = useMemo(
    () => computeLiveActivity(servers),
    [servers],
  );

  const updatedLabel = useMemo(() => {
    if (!lastUpdated) return null;
    const diffMs = Date.now() - lastUpdated.getTime();
    if (diffMs < 60_000) return t("activity.updatedMoments");
    return t("activity.updatedAt", {
      time: lastUpdated.toLocaleTimeString(localeTag, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }, [lastUpdated, localeTag, t]);

  if (loading && !activity) {
    return (
      <div
        className="mb-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 px-3 py-2.5"
        aria-busy="true"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {t("activity.title")}
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {t("activity.loading")}
        </p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="mb-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 px-3 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {t("activity.title")}
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {t("activity.unavailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        {t("activity.title")}
      </p>
      <p className="mt-1 text-sm text-[var(--text-primary)]">
        {t("activity.summary", {
          players: activity.totalPlayers,
          active: activity.activeServers,
        })}
      </p>
      {activity.busiestServer && activity.busiestServer.players > 0 && (
        <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
          {t("activity.mostActive")}{" "}
          <Link
            href={`/servers/${activity.busiestServer.id}`}
            className="text-[var(--accent-green)] hover:underline"
          >
            {activity.busiestServer.name}
          </Link>
          {" · "}
          {activity.busiestServer.players}{" "}
          {t("activity.players")}
        </p>
      )}
      {activity.topMap && activity.topMap.serverCount > 0 && (
        <p className="mt-0.5 truncate font-mono text-[12px] text-[var(--text-secondary)]">
          {t("activity.topMap")}{" "}
          <span className="text-[var(--accent-green)]/90">{activity.topMap.map}</span>
          {activity.topMap.serverCount > 1 &&
            ` (${activity.topMap.serverCount})`}
        </p>
      )}
      {updatedLabel && (
        <p className="mt-1 text-[11px] text-[var(--text-secondary)]/80">
          {updatedLabel}
        </p>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  COMMUNITY_MAP_SHEETS,
  type MapProgressCommunity,
} from "@/data/community-maps";
import { useCommunityMaps } from "@/hooks/useCommunityMaps";
import { useTranslations } from "@/i18n/LocaleProvider";

interface MapProgressPanelProps {
  community: MapProgressCommunity;
  enabled?: boolean;
  compact?: boolean;
  showTitle?: boolean;
  variant?: "default" | "card";
}

export default function MapProgressPanel({
  community,
  enabled = true,
  compact = false,
  showTitle = true,
  variant = "default",
}: MapProgressPanelProps) {
  const t = useTranslations();
  const sheet = COMMUNITY_MAP_SHEETS[community];
  const { stats, loading, error, refreshing, refresh } = useCommunityMaps(
    community,
    { enabled },
  );

  const isCard = variant === "card";
  const liveNoteKey =
    community === "gfl" ? "mapProgress.liveNoteGfl" : "mapProgress.liveNote";

  return (
    <section className={isCard ? "w-full" : undefined}>
      {!isCard && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {showTitle && (
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              {t("mapProgress.title")}
            </h3>
          )}
          {!compact && (
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className={`text-[11px] text-[var(--accent-green)] hover:underline disabled:opacity-50 ${!showTitle ? "ml-auto" : ""}`}
            >
              {refreshing ? t("detail.refreshing") : t("detail.refresh")}
            </button>
          )}
        </div>
      )}

      {loading && !stats && (
        <p
          className={`text-[var(--text-secondary)] ${isCard ? "text-[11px]" : "text-sm"}`}
        >
          {t("mapProgress.loading")}
        </p>
      )}

      {error && !stats && (
        <p className={`text-ze-amber ${isCard ? "text-[11px]" : "text-sm"}`}>
          {t("mapProgress.error")}
        </p>
      )}

      {stats && (
        <div
          className={
            isCard
              ? "space-y-1.5"
              : "space-y-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-primary)]/40 px-3 py-3"
          }
        >
          {isCard && showTitle && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {t("mapProgress.title")}
              </h4>
              <Link
                href={sheet.pagePath}
                className="text-[10px] font-medium text-[var(--accent-green)] hover:underline"
              >
                {t("mapProgress.viewFullList")}
              </Link>
            </div>
          )}

          <div
            className={`flex flex-wrap gap-x-3 gap-y-0.5 ${isCard ? "text-[11px]" : "text-sm"}`}
          >
            <span>
              <strong className="text-[var(--accent-green)]">{stats.beaten}</strong>{" "}
              <span className="text-[var(--text-secondary)]">
                {t("mapProgress.beaten")}
              </span>
            </span>
            <span>
              <strong className="text-ze-red">{stats.unbeaten}</strong>{" "}
              <span className="text-[var(--text-secondary)]">
                {t("mapProgress.remaining")}
              </span>
            </span>
            <span>
              <strong className="text-[var(--text-primary)]">
                {stats.completionPercent}%
              </strong>{" "}
              <span className="text-[var(--text-secondary)]">
                {t("mapProgress.complete")}
              </span>
            </span>
          </div>

          <div
            className={`overflow-hidden rounded-full bg-[var(--bg-primary)] ${isCard ? "h-1" : "h-1.5"}`}
          >
            <div
              className="h-full rounded-full bg-[var(--accent-green)] transition-all duration-700"
              style={{ width: `${stats.completionPercent}%` }}
            />
          </div>

          {!isCard && (
            <>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {t(liveNoteKey)}
              </p>

              <Link
                href={sheet.pagePath}
                className="inline-block text-sm font-medium text-[var(--accent-green)] hover:underline"
              >
                {t("mapProgress.viewFullList")}
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  );
}

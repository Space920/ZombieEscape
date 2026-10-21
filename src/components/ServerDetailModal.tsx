"use client";

import { useCallback, useEffect, useState } from "react";
import type { ServerStatus } from "@/types/server";
import type { ServerDetailResponse } from "@/types/server-detail";
import { COMMUNITIES } from "@/data/communities";
import CommunityLogo from "./CommunityLogo";
import CommunityLinks from "./CommunityLinks";
import TrendIndicator from "./TrendIndicator";
import MiniSparkline from "./MiniSparkline";
import MapProgressPanel from "./MapProgressPanel";
import { hasMapProgress } from "@/data/community-maps";
import {
  formatDateTime,
  formatDuration,
  formatDurationMinutes,
} from "@/lib/format-duration";
import { useLocale, useTranslations } from "@/i18n/LocaleProvider";
import { getMessages } from "@/i18n/messages";

interface ServerDetailModalProps {
  server: ServerStatus | null;
  onClose: () => void;
}

function MapStintRow({
  stint,
  highlight = false,
}: {
  stint: NonNullable<ServerDetailResponse["currentMap"]>;
  highlight?: boolean;
}) {
  const t = useTranslations();
  const { locale, localeTag } = useLocale();
  const durationLabels = getMessages(locale).duration;
  const delta = stint.endPlayers - stint.startPlayers;

  return (
    <div
      className={`rounded border px-3 py-2.5 ${
        highlight
          ? "border-[var(--border-green)] bg-[var(--accent-green-muted)]"
          : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm text-[var(--text-primary)]">
            {stint.map}
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
            {formatDateTime(stint.startedAt, localeTag)}
            {stint.endedAt
              ? ` → ${formatDateTime(stint.endedAt, localeTag)}`
              : t("detail.untilNow")}
          </p>
        </div>
        <TrendIndicator trend={stint.trend} delta={delta} compact />
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
        <span>
          <strong className="text-[var(--text-primary)]">
            {formatDurationMinutes(stint.durationMinutes, durationLabels)}
          </strong>
          <span className="text-[var(--text-secondary)]">{t("detail.played")}</span>
        </span>
        <span>
          <strong className="text-[var(--accent-green)]">
            {stint.peakPlayers}
          </strong>
          <span className="text-[var(--text-secondary)]">{t("detail.peak")}</span>
        </span>
        <span className="text-[var(--text-secondary)]">
          {t("detail.playersRange", {
            start: stint.startPlayers,
            end: stint.endPlayers || stint.startPlayers,
          })}
        </span>
      </div>

      {stint.playerCounts.length > 1 && (
        <MiniSparkline values={stint.playerCounts} className="mt-2" />
      )}
    </div>
  );
}

export default function ServerDetailModal({
  server,
  onClose,
}: ServerDetailModalProps) {
  const t = useTranslations();
  const { locale, localeTag } = useLocale();
  const durationLabels = getMessages(locale).duration;
  const [detail, setDetail] = useState<ServerDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async (serverId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/servers/${serverId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load server details");
      setDetail(await res.json());
    } catch {
      setError(t("detail.error"));
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!server) return;
    fetchDetail(server.id);
  }, [server, fetchDetail]);

  useEffect(() => {
    if (!server) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [server, onClose]);

  if (!server) return null;

  const community = COMMUNITIES[server.community];
  const detailLive = detail?.server;
  const live =
    detailLive &&
    !detailLive.online &&
    server.online &&
    server.players > 0
      ? server
      : (detailLive ?? server);
  const playerList = detail?.playerList ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("detail.ariaLabel", { name: server.name })}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-label={t("detail.close")}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg border border-[var(--border-green)] bg-[var(--bg-surface)] shadow-[0_0_40px_var(--glow-green)] sm:rounded-lg">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <CommunityLogo communityId={server.community} size="sm" />
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-[var(--text-primary)] sm:text-lg">
                {server.name}
              </h2>
              <p className="text-[12px] text-[var(--text-secondary)]">
                {t("detail.onlineMeta", {
                  community: community.shortLabel,
                  players: live.players,
                  max: live.maxPlayers,
                })}
                {live.ping != null
                  ? t("detail.pingMeta", { ping: Math.round(live.ping) })
                  : ""}
              </p>
              <CommunityLinks
                website={server.website}
                discord={server.discord}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label={t("detail.closeDialog")}
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 sm:px-5">
          {loading && !detail && (
            <p className="text-sm text-[var(--text-secondary)]">
              {t("detail.loading")}
            </p>
          )}

          {error && <p className="mb-4 text-sm text-ze-amber">{error}</p>}

          {detail && (
            <div className="space-y-5">
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  {t("detail.currentMap")}
                </h3>
                {detail.currentMap ? (
                  <MapStintRow stint={detail.currentMap} highlight />
                ) : (
                  <p className="rounded border border-[var(--border-subtle)] px-3 py-2 font-mono text-sm text-[var(--accent-green)]">
                    {live.map}
                  </p>
                )}
              </section>

              <section>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {t("detail.playersOnline", { count: playerList.length })}
                  </h3>
                  {playerList.length === 0 && live.players > 0 && (
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {t("detail.namesHidden")}
                    </span>
                  )}
                </div>
                {playerList.length > 0 ? (
                  <ul className="max-h-48 overflow-y-auto rounded border border-[var(--border-subtle)]">
                    {playerList.map((player) => (
                      <li
                        key={player.name}
                        className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-3 py-2 text-sm last:border-b-0"
                      >
                        <span className="truncate text-[var(--text-primary)]">
                          {player.name}
                        </span>
                        <span className="shrink-0 tabular-nums text-[12px] text-[var(--text-secondary)]">
                          {formatDuration(
                            player.timeSeconds,
                            localeTag,
                            durationLabels,
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {live.online
                      ? t("detail.noPlayerList")
                      : t("detail.serverOffline")}
                  </p>
                )}
              </section>

              {hasMapProgress(server.community) && (
                <MapProgressPanel
                  community={server.community}
                  enabled={!!server}
                />
              )}

              <section>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {t("detail.mapHistory")}
                  </h3>
                  {detail.history.overallTrend && (
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {t("detail.trend24h")}{" "}
                      <strong className="text-[var(--text-primary)]">
                        {detail.history.overallTrend.replace(/_/g, " ")}
                      </strong>
                      {detail.history.trendPercent != null &&
                        ` (${detail.history.trendPercent > 0 ? "+" : ""}${detail.history.trendPercent}%)`}
                    </span>
                  )}
                </div>

                {detail.mapHistory.length > 0 ? (
                  <div className="space-y-2">
                    {detail.mapHistory.map((stint) => (
                      <MapStintRow
                        key={`${stint.map}-${stint.startedAt}`}
                        stint={stint}
                      />
                    ))}
                  </div>
                ) : detail.history.source === "none" ||
                  detail.history.source === "external" ? (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {t("detail.noMapHistory")}
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">
                    {t("detail.noMaps24h")}
                  </p>
                )}

                {detail.history.externalUrl && (
                  <a
                    href={detail.history.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-[var(--accent-green)] hover:underline"
                  >
                    {detail.history.externalLabel ?? t("detail.viewMapHistory")} →
                  </a>
                )}
              </section>
            </div>
          )}
        </div>

        <div className="border-t border-[var(--border-subtle)] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => server && fetchDetail(server.id)}
            disabled={loading}
            className="mr-2 rounded border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--border-green)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            {loading ? t("detail.refreshing") : t("detail.refresh")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
          >
            {t("detail.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

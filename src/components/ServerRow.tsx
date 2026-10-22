"use client";

import Link from "next/link";
import CommunityLinks from "./CommunityLinks";
import RegionFlag from "./RegionFlag";
import FavoriteButton from "./FavoriteButton";
import MapNameLink from "./MapNameLink";
import { useLocale, useTranslations } from "@/i18n/LocaleProvider";
import type { ServerStatus } from "@/types/server";
import { COMMUNITIES } from "@/data/communities";
import {
  steamConnectUrl,
  copyConnectCommand,
  copyServerAddress,
} from "@/lib/connect";
import CommunityCardBackground from "./CommunityCardBackground";

const GAME_STYLES: Record<
  ServerStatus["game"],
  { badge: string; badgeClass: string; borderClass: string }
> = {
  cs2: {
    badge: "CS2",
    badgeClass:
      "bg-[var(--accent-green-muted)] text-[var(--accent-green)] ring-1 ring-[var(--border-green)]",
    borderClass: "border-l-[3px] border-l-[var(--accent-green)]",
  },
  css: {
    badge: "CS:S",
    badgeClass: "bg-ze-amber/15 text-ze-amber ring-1 ring-ze-amber/30",
    borderClass: "border-l-[3px] border-l-ze-amber",
  },
  csgo: {
    badge: "CS:GO",
    badgeClass:
      "bg-[var(--border-subtle)] text-[var(--text-secondary)] ring-1 ring-[var(--border-subtle)]",
    borderClass: "border-l-[3px] border-l-[var(--text-secondary)]",
  },
};

interface ServerRowProps {
  server: ServerStatus;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  onDetails?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onMapFilter?: (map: string) => void;
  popularLabel?: string;
}

export default function ServerRow({
  server,
  onCopy,
  copiedId,
  onDetails,
  isFavorite = false,
  onToggleFavorite,
  onMapFilter,
  popularLabel,
}: ServerRowProps) {
  const t = useTranslations();
  const { regionLabel } = useLocale();
  const community = COMMUNITIES[server.community];
  const connectUrl = steamConnectUrl(server.host, server.port);
  const consoleCmd = copyConnectCommand(server.host, server.port);
  const ipAddress = copyServerAddress(server.host, server.port);
  const isFull =
    server.online &&
    server.maxPlayers > 0 &&
    server.players >= server.maxPlayers;
  const gameStyle = GAME_STYLES[server.game];

  return (
    <article
      className={`relative overflow-hidden ze-card ze-card-hover group flex flex-col gap-2 rounded-md px-2.5 py-2.5 transition-colors sm:px-3.5 ${gameStyle.borderClass} ${
        server.online ? "" : "opacity-55"
      }`}
    >
      <CommunityCardBackground
        communityId={server.community}
        online={server.online}
      />

      <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <div className="min-w-0 flex-1 pr-28 sm:pr-32">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <RegionFlag code={server.region} size="md" />
            {onToggleFavorite && (
              <FavoriteButton
                active={isFavorite}
                onToggle={onToggleFavorite}
                serverName={server.name}
              />
            )}
            <Link
              href={`/servers/${server.id}`}
              className="truncate text-[15px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent-green)] sm:text-[18px]"
            >
              {server.name}
            </Link>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${gameStyle.badgeClass}`}
            >
              {gameStyle.badge}
            </span>
            {popularLabel && (
              <span className="shrink-0 rounded bg-[var(--accent-green)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                {popularLabel}
              </span>
            )}
            {isFull && (
              <span className="text-[11px] font-medium uppercase text-ze-red">
                {t("serverRow.full")}
              </span>
            )}
            {!server.online && (
              <span className="text-[11px] font-medium uppercase text-[var(--text-secondary)]">
                {t("serverRow.offline")}
              </span>
            )}
          </div>

          {onMapFilter ? (
            <MapNameLink map={server.map} onFilter={onMapFilter} />
          ) : (
            <p className="truncate font-mono text-[13px] text-[var(--accent-green)]/85">
              {server.map}
            </p>
          )}

          <p className="truncate text-[12px] text-[var(--text-secondary)]">
            {regionLabel(server.region)} · {community.shortLabel} · {ipAddress}
          </p>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <CommunityLinks website={server.website} discord={server.discord} />
            <span
              className={`font-mono text-[13px] font-bold tabular-nums sm:hidden ${
                server.online && server.players > 0
                  ? "text-[var(--accent-green)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {server.players}/{server.maxPlayers}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:shrink-0">
          <div className="hidden shrink-0 text-right sm:block">
            <p
              className={`font-mono text-[15px] font-bold tabular-nums ${
                server.online && server.players > 0
                  ? "text-[var(--accent-green)]"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {server.players}/{server.maxPlayers}
            </p>
            {server.ping != null && server.online && (
              <p className="text-[13px] text-[var(--text-secondary)]">
                {Math.round(server.ping)}ms
              </p>
            )}
          </div>

          <a
            href={connectUrl}
            className={`rounded-md px-3.5 py-1.5 text-[12px] font-bold transition-[filter,box-shadow] sm:text-[13px] ${
              server.online
                ? "ze-join bg-[var(--accent-green)] text-black hover:brightness-110"
                : "pointer-events-none cursor-not-allowed bg-[var(--border-subtle)] text-[var(--text-secondary)]"
            }`}
            aria-disabled={!server.online}
          >
            {t("serverRow.join")}
          </a>

          {onDetails && (
            <button
              type="button"
              onClick={onDetails}
              className="rounded-md border border-[var(--border-subtle)] px-2.5 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
            >
              {t("serverRow.details")}
            </button>
          )}

          <button
            type="button"
            onClick={() => onCopy(ipAddress, `ip-${server.id}`)}
            aria-label={t("serverRow.copyIpAria", { ip: ipAddress })}
            className="rounded-md border border-[var(--border-subtle)] px-2.5 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
          >
            {copiedId === `ip-${server.id}`
              ? t("serverRow.copied")
              : t("serverRow.copyIp")}
          </button>

          <button
            type="button"
            onClick={() => onCopy(consoleCmd, `cmd-${server.id}`)}
            aria-label={t("serverRow.copyConnect")}
            className="rounded-md border border-[var(--border-subtle)] px-2 py-1.5 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
            title={t("serverRow.copyConnect")}
          >
            {copiedId === `cmd-${server.id}` ? "✓" : "⌘"}
          </button>
        </div>
      </div>
    </article>
  );
}

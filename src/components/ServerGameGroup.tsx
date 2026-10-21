import type { ServerStatus } from "@/types/server";

import ServerRow from "./ServerRow";
import { useTranslations } from "@/i18n/LocaleProvider";

interface ServerGameGroupProps {
  game: "cs2" | "css" | "csgo";
  title: string;
  subtitle: string;
  servers: ServerStatus[];
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  onDetails?: (server: ServerStatus) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onMapFilter: (map: string) => void;
  /** Highlighted “most popular” block */
  featured?: boolean;
  popularLabelFor?: (server: ServerStatus) => string | undefined;
}

const GROUP_STYLES = {
  cs2: {
    panel:
      "border-[var(--border-green)] bg-[color-mix(in_srgb,var(--accent-green)_4%,var(--bg-surface))]",
    badge: "bg-[var(--accent-green-muted)] text-[var(--accent-green)]",
    accent: "text-[var(--accent-green)]",
  },
  css: {
    panel:
      "border-ze-amber/40 bg-[color-mix(in_srgb,#ffb020_6%,var(--bg-surface))]",
    badge: "bg-ze-amber/15 text-ze-amber",
    accent: "text-ze-amber",
  },
  csgo: {
    panel: "border-[var(--border-subtle)] bg-[var(--bg-surface)]",
    badge: "bg-[var(--border-subtle)] text-[var(--text-secondary)]",
    accent: "text-[var(--text-secondary)]",
  },
} as const;

export default function ServerGameGroup({
  game,
  title,
  subtitle,
  servers,
  onCopy,
  copiedId,
  onDetails,
  isFavorite,
  onToggleFavorite,
  onMapFilter,
  featured = false,
  popularLabelFor,
}: ServerGameGroupProps) {
  const t = useTranslations();
  const styles = GROUP_STYLES[game];
  const online = servers.filter((s) => s.online).length;
  const players = servers.reduce((sum, s) => sum + s.players, 0);
  const headingId = featured
    ? `game-group-${game}-featured`
    : `game-group-${game}`;

  return (
    <section
      aria-labelledby={headingId}
      className={`rounded-lg border p-3 sm:p-4 ${
        featured
          ? "border-[var(--accent-green)]/50 bg-[color-mix(in_srgb,var(--accent-green)_8%,var(--bg-surface))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-green)_20%,transparent)]"
          : styles.panel
      }`}
    >
      <header className="mb-3 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id={headingId}
              className="text-base font-bold text-[var(--text-primary)] sm:text-lg"
            >
              {title}
            </h2>
            {featured ? (
              <span className="rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-[var(--accent-green)] text-black">
                {t("gameGroups.featuredBadge")}
              </span>
            ) : (
              <span
                className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${styles.badge}`}
              >
                {game === "css" ? "CS:S" : game === "csgo" ? "CS:GO" : "CS2"}
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] text-[var(--text-secondary)] sm:text-[13px]">
            {subtitle}
          </p>
        </div>
        <p
          className={`shrink-0 text-right text-[12px] sm:text-[13px] ${
            featured ? "text-[var(--accent-green)]" : styles.accent
          }`}
        >
          {t("gameGroups.playersOnline", {
            players,
            online,
            total: servers.length,
          })}
        </p>
      </header>

      <div className="space-y-2.5">
        {servers.map((server) => (
          <ServerRow
            key={server.id}
            server={server}
            onCopy={onCopy}
            copiedId={copiedId}
            onDetails={onDetails ? () => onDetails(server) : undefined}
            isFavorite={isFavorite(server.id)}
            onToggleFavorite={() => onToggleFavorite(server.id)}
            onMapFilter={onMapFilter}
            popularLabel={popularLabelFor?.(server)}
          />
        ))}
      </div>
    </section>
  );
}

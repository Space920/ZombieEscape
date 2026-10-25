"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  CommunityFilter,
  ServerStatus,
  ServersResponse,
  SortOption,
} from "@/types/server";
import { FEATURED_SERVER_IDS } from "@/data/servers";
import { sortServers, computeTotals } from "@/lib/server-sort";
import {
  readClientServersCache,
  writeClientServersCache,
} from "@/lib/client-server-cache";
import { useFavorites } from "@/hooks/useFavorites";
import ServerGameGroup from "./ServerGameGroup";
import ServerControls from "./ServerControls";
import ServerStatsBar from "./ServerStatsBar";
import ServerDetailModal from "./ServerDetailModal";
import { useTranslations } from "@/i18n/LocaleProvider";
import { LIVE_SERVERS_PATH } from "@/lib/live-data-paths";

const REFRESH_INTERVAL = 60_000;
const INITIAL_CS2_VISIBLE = 10;

const FEATURED_ORDER = Object.fromEntries(
  FEATURED_SERVER_IDS.map((id, index) => [id, index]),
) as Record<string, number>;

export default function ServerBrowser() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { favorites, hydrated, toggle, isFavorite } = useFavorites();

  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("most-players");
  const [communityFilter, setCommunityFilter] =
    useState<CommunityFilter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [detailServer, setDetailServer] = useState<ServerStatus | null>(null);
  const [showMoreCs2, setShowMoreCs2] = useState(false);

  const refreshLock = useRef(false);
  const hasLoaded = useRef(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const mapQuery = searchParams.get("map");
    if (mapQuery) setSearch(mapQuery);
  }, [searchParams]);

  useEffect(() => {
    setShowMoreCs2(false);
  }, [search, communityFilter, sortBy]);

  const fetchServers = useCallback(
    async (isManual = false) => {
      if (refreshLock.current) return;
      refreshLock.current = true;

      if (isManual) setRefreshing(true);
      else if (!hasLoaded.current) setLoading(true);

      try {
        const res = await fetch(LIVE_SERVERS_PATH, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch servers");
        const data: ServersResponse = await res.json();
        setServers(data.servers);
        setLastUpdated(new Date(data.updatedAt));
        writeClientServersCache(data);
        setError(null);
        hasLoaded.current = true;
      } catch {
        setError(t("browser.errorUnavailable"));
      } finally {
        setLoading(false);
        setRefreshing(false);
        refreshLock.current = false;
      }
    },
    [t],
  );

  useEffect(() => {
    const cached = readClientServersCache();
    if (cached) {
      setServers(cached.servers);
      setLastUpdated(new Date(cached.updatedAt));
      hasLoaded.current = true;
      setLoading(false);
    }

    fetchServers();
    const interval = setInterval(() => fetchServers(true), REFRESH_INTERVAL);
    const clock = setInterval(() => setNowMs(Date.now()), 30_000);
    return () => {
      clearInterval(interval);
      clearInterval(clock);
    };
  }, [fetchServers]);

  const staleMinutes =
    lastUpdated && nowMs - lastUpdated.getTime() >= 25 * 60_000
      ? Math.max(1, Math.round((nowMs - lastUpdated.getTime()) / 60_000))
      : 0;

  const filtered = useMemo(() => {
    let list = servers;

    if (communityFilter !== "all") {
      list = list.filter((s) => s.community === communityFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.map.toLowerCase().includes(q) ||
          s.community.toLowerCase().includes(q) ||
          `${s.host}:${s.port}`.toLowerCase().includes(q),
      );
    }

    return sortServers(list, sortBy, hydrated ? favorites : []);
  }, [servers, communityFilter, search, sortBy, favorites, hydrated]);

  const cs2Servers = useMemo(
    () => filtered.filter((s) => s.game === "cs2" || s.game === "csgo"),
    [filtered],
  );

  const featuredServers = useMemo(() => {
    const featured = cs2Servers.filter((s) =>
      FEATURED_SERVER_IDS.includes(
        s.id as (typeof FEATURED_SERVER_IDS)[number],
      ),
    );
    return [...featured].sort(
      (a, b) => (FEATURED_ORDER[a.id] ?? 99) - (FEATURED_ORDER[b.id] ?? 99),
    );
  }, [cs2Servers]);

  const forceExpandList =
    communityFilter !== "all" || Boolean(search) || showMoreCs2;

  const { visibleCs2, hiddenCount } = useMemo(() => {
    if (forceExpandList || cs2Servers.length <= INITIAL_CS2_VISIBLE) {
      return { visibleCs2: cs2Servers, hiddenCount: 0 };
    }

    return {
      visibleCs2: cs2Servers.slice(0, INITIAL_CS2_VISIBLE),
      hiddenCount: cs2Servers.length - INITIAL_CS2_VISIBLE,
    };
  }, [cs2Servers, forceExpandList]);

  const cssServers = useMemo(
    () => filtered.filter((s) => s.game === "css"),
    [filtered],
  );

  const displayTotals = useMemo(() => computeTotals(filtered), [filtered]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMapFilter = useCallback((map: string) => {
    setSearch(map);
    document.getElementById("servers")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const popularLabelFor = useCallback(
    (server: ServerStatus) => {
      if (server.id === "gfl") return t("serverRow.popularNa");
      if (server.id === "mapeadores") return t("serverRow.popularEu");
      if (server.id === "possession") return t("serverRow.popularAs");
      return undefined;
    },
    [t],
  );

  const hasData = servers.length > 0;
  const initialLoad = loading && !hasData;

  return (
    <section
      id="servers"
      className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8"
    >
      <ServerStatsBar
        online={displayTotals.online}
        players={displayTotals.players}
        loading={initialLoad}
      />

      <ServerControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        communityFilter={communityFilter}
        onCommunityFilterChange={setCommunityFilter}
        search={search}
        onSearchChange={setSearch}
        onRefresh={() => fetchServers(true)}
        refreshing={refreshing}
        lastUpdated={lastUpdated}
        hasData={hasData}
      />

      {staleMinutes > 0 && (
        <div
          className="mb-4 rounded-lg border border-ze-amber/30 bg-ze-amber/10 px-4 py-2.5 text-sm text-ze-amber"
          role="status"
        >
          {t("browser.staleMaps", { minutes: staleMinutes })}
        </div>
      )}

      {error && (
        <div
          className="mb-4 rounded-lg border border-ze-amber/30 bg-ze-amber/10 px-4 py-2.5 text-sm text-ze-amber"
          role="alert"
        >
          {error}
        </div>
      )}

      {initialLoad ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[3.75rem] animate-pulse rounded-lg bg-ze-surface/60"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-ze-muted">
          <p>{hasData ? t("browser.noMatch") : t("browser.noData")}</p>
          {(communityFilter !== "all" || search) && (
            <button
              type="button"
              onClick={() => {
                setCommunityFilter("all");
                setSearch("");
              }}
              className="mt-3 text-sm text-ze-green hover:underline"
            >
              {t("browser.resetFilters")}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {featuredServers.length > 0 && (
            <ServerGameGroup
              game="cs2"
              featured
              title={t("gameGroups.featuredTitle")}
              subtitle={t("gameGroups.featuredSubtitle")}
              servers={featuredServers}
              onCopy={handleCopy}
              copiedId={copiedId}
              onDetails={setDetailServer}
              isFavorite={isFavorite}
              onToggleFavorite={toggle}
              onMapFilter={handleMapFilter}
              popularLabelFor={popularLabelFor}
            />
          )}

          {visibleCs2.length > 0 && (
            <div className="space-y-3">
              <ServerGameGroup
                game="cs2"
                title={t("gameGroups.cs2Title")}
                subtitle={t("gameGroups.cs2Subtitle")}
                servers={visibleCs2}
                onCopy={handleCopy}
                copiedId={copiedId}
                onDetails={setDetailServer}
                isFavorite={isFavorite}
                onToggleFavorite={toggle}
                onMapFilter={handleMapFilter}
                popularLabelFor={popularLabelFor}
              />

              {hiddenCount > 0 && !showMoreCs2 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowMoreCs2(true)}
                    className="rounded border border-[var(--border-green)] bg-[color-mix(in_srgb,var(--accent-green)_8%,transparent)] px-4 py-2 text-sm font-medium text-[var(--accent-green)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-green)_16%,transparent)]"
                  >
                    {t("browser.showMore", { count: hiddenCount })}
                  </button>
                </div>
              )}
            </div>
          )}

          {cssServers.length > 0 && (
            <ServerGameGroup
              game="css"
              title={t("gameGroups.cssTitle")}
              subtitle={t("gameGroups.cssSubtitle")}
              servers={cssServers}
              onCopy={handleCopy}
              copiedId={copiedId}
              onDetails={setDetailServer}
              isFavorite={isFavorite}
              onToggleFavorite={toggle}
              onMapFilter={handleMapFilter}
            />
          )}
        </div>
      )}

      <ServerDetailModal
        server={detailServer}
        onClose={() => setDetailServer(null)}
      />
    </section>
  );
}

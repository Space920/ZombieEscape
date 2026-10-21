"use client";

import { useMemo, useState } from "react";
import type {
  MapFilter,
  MapSort,
  MapeadoresMap,
} from "@/types/mapeadores-map";
import {
  COMMUNITY_MAP_SHEETS,
  type MapProgressCommunity,
} from "@/data/community-maps";
import CommunityLogo from "./CommunityLogo";
import { useCommunityMaps } from "@/hooks/useCommunityMaps";

interface MapProgressSectionProps {
  community: MapProgressCommunity;
}

export default function MapProgressSection({
  community,
}: MapProgressSectionProps) {
  const sheet = COMMUNITY_MAP_SHEETS[community];
  const { data, stats, error, loading, refreshing, refresh } =
    useCommunityMaps(community);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MapFilter>("all");
  const [sort, setSort] = useState<MapSort>("az");

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.maps;

    if (filter === "beaten") list = list.filter((m) => m.status === "beaten");
    if (filter === "unbeaten")
      list = list.filter((m) => m.status === "unbeaten");

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q));
    }

    const sorted = [...list];
    if (sort === "az") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") sorted.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "status") {
      const order = { unbeaten: 0, removed: 1, beaten: 2 };
      sorted.sort(
        (a, b) =>
          order[a.status] - order[b.status] || a.name.localeCompare(b.name),
      );
    }
    return sorted;
  }, [data, filter, search, sort]);

  return (
    <section id={`${community}-maps`} className="relative z-10">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <CommunityLogo communityId={community} size="lg" />
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{sheet.title}</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {sheet.description}
            </p>
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="mt-2 text-sm text-[var(--accent-green)] hover:underline disabled:opacity-50"
            >
              {refreshing ? "Refreshing…" : "Refresh now"}
            </button>
          </div>
        </div>

        {loading && !data && (
          <div className="space-y-4">
            <div className="h-8 animate-pulse rounded-lg bg-ze-surface" />
            <div className="h-32 animate-pulse rounded-xl bg-ze-surface" />
            <div className="h-64 animate-pulse rounded-xl bg-ze-surface" />
          </div>
        )}

        {error && !data && (
          <div className="rounded-xl border border-ze-amber/30 bg-ze-amber/10 p-6 text-center">
            <p className="text-sm text-ze-amber">{error}</p>
          </div>
        )}

        {stats && (
          <>
            <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
              {[
                {
                  label: "beaten",
                  value: stats.beaten,
                  className: "text-ze-green",
                },
                {
                  label: "remaining",
                  value: stats.unbeaten,
                  className: "text-ze-red",
                },
                {
                  label: "removed",
                  value: stats.removed,
                  className: "text-ze-muted",
                },
                {
                  label: "completion",
                  value: `${stats.completionPercent}%`,
                  className: "text-white",
                },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span
                    className={`text-lg font-bold tabular-nums ${s.className}`}
                  >
                    {s.value}
                  </span>
                  <span className="text-ze-muted">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-ze-muted">
                <span>Map Completion</span>
                <span className="font-mono text-ze-green">
                  {stats.completionPercent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ze-bg">
                <div
                  className="h-full rounded-full bg-ze-green transition-all duration-700"
                  style={{ width: `${stats.completionPercent}%` }}
                  role="progressbar"
                  aria-valuenow={stats.completionPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Map completion percentage"
                />
              </div>
              <p className="mt-1 text-right text-xs text-ze-muted">
                {stats.beaten} / {stats.total} maps beaten
              </p>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <input
                type="search"
                placeholder="Search maps…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search maps"
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--border-green)] focus:outline-none sm:max-w-xs"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as MapSort)}
                aria-label="Sort maps"
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--border-green)] focus:outline-none"
              >
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div
              className="mb-4 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter maps by status"
            >
              {(
                [
                  ["all", "All", stats.total],
                  ["beaten", "Beaten", stats.beaten],
                  ["unbeaten", "Unbeaten", stats.unbeaten],
                ] as const
              ).map(([id, label, count]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  aria-pressed={filter === id}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none sm:text-sm ${
                    filter === id
                      ? "border border-[var(--border-green)] text-[var(--accent-green)]"
                      : "border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            <ul className="max-h-[480px] space-y-0.5 overflow-y-auto rounded border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--bg-surface)_50%,transparent)] p-2 sm:p-3">
              {filtered.length === 0 ? (
                <li className="py-8 text-center text-sm text-ze-muted">
                  No maps match your search.
                </li>
              ) : (
                filtered.map((map) => <MapListItem key={map.name} map={map} />)
              )}
            </ul>

            <div className="mt-6 flex flex-col gap-2 text-xs text-ze-muted sm:flex-row sm:items-center sm:justify-between">
              <p>{sheet.attribution}</p>
              {data?.syncedAt && (
                <span className="tabular-nums">
                  Last synced:{" "}
                  {new Date(data.syncedAt).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function MapListItem({ map }: { map: MapeadoresMap }) {
  const isBeaten = map.status === "beaten";
  const isRemoved = map.status === "removed";

  return (
    <li
      className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${
        isBeaten
          ? "text-ze-green/90"
          : isRemoved
            ? "text-ze-muted/60 line-through"
            : "text-ze-red/90"
      }`}
    >
      <span className="mt-0.5 shrink-0 font-mono text-xs" aria-hidden="true">
        {isBeaten ? "✓" : isRemoved ? "−" : "✕"}
      </span>
      <div className="min-w-0 flex-1">
        <span className="break-all font-mono">{map.name}</span>
        {(map.levels || map.information) && (
          <span className="ml-2 text-xs text-ze-muted">
            {[map.levels, map.information].filter(Boolean).join(" · ")}
          </span>
        )}
        <span className="sr-only">
          {isBeaten ? "Beaten" : isRemoved ? "Removed" : "Unbeaten"}
        </span>
      </div>
    </li>
  );
}

"use client";

import type { CommunityFilter, SortOption } from "@/types/server";
import { COMMUNITY_FILTER_OPTIONS } from "@/data/communities";
import { useLocale, useTranslations } from "@/i18n/LocaleProvider";

interface ServerControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  communityFilter: CommunityFilter;
  onCommunityFilterChange: (filter: CommunityFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  lastUpdated: Date | null;
  hasData: boolean;
}

const SORT_KEYS: { value: SortOption; key: string }[] = [
  { value: "most-players", key: "controls.sortMostPlayers" },
  { value: "least-players", key: "controls.sortLeastPlayers" },
  { value: "favorites-first", key: "controls.sortFavorites" },
  { value: "community", key: "controls.sortCommunity" },
  { value: "name", key: "controls.sortName" },
];

const inputClass =
  "rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-colors focus:border-[var(--border-green)] focus:outline-none";

export default function ServerControls({
  sortBy,
  onSortChange,
  communityFilter,
  onCommunityFilterChange,
  search,
  onSearchChange,
  onRefresh,
  refreshing,
  lastUpdated,
  hasData,
}: ServerControlsProps) {
  const t = useTranslations();
  const { localeTag } = useLocale();

  const timeLabel =
    refreshing && hasData
      ? t("controls.updating")
      : lastUpdated
        ? lastUpdated.toLocaleTimeString(localeTag, {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null;

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-secondary)]">
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.2" />
            <path d="M10.4 10.4 14 14" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          placeholder={t("controls.searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t("controls.searchAria")}
          className={`w-full pl-9 ${inputClass}`}
        />
      </label>

      <select
        value={communityFilter}
        onChange={(e) =>
          onCommunityFilterChange(e.target.value as CommunityFilter)
        }
        aria-label={t("controls.filterAria")}
        className={inputClass}
      >
        <option value="all">{t("controls.allCommunities")}</option>
        {COMMUNITY_FILTER_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label={t("controls.sortAria")}
        className={inputClass}
      >
        {SORT_KEYS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.key)}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        aria-label={t("controls.refreshAria")}
        className={`${inputClass} text-[var(--text-secondary)] transition-colors hover:border-[var(--border-green)] hover:text-[var(--text-primary)] disabled:opacity-50`}
      >
        {refreshing ? "…" : t("controls.refresh")}
      </button>

      {timeLabel && (
        <span
          className="text-xs text-[var(--text-secondary)] tabular-nums sm:ml-auto"
          aria-live="polite"
        >
          {t("controls.updated", { time: timeLabel })}
        </span>
      )}
    </div>
  );
}

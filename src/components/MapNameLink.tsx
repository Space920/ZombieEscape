"use client";

import Link from "next/link";

const INVALID_MAPS = new Set(["—", "Unknown", "???", ""]);

interface MapNameLinkProps {
  map: string;
  onFilter?: (map: string) => void;
}

export default function MapNameLink({ map, onFilter }: MapNameLinkProps) {
  const clickable = Boolean(map && !INVALID_MAPS.has(map));

  if (!clickable) {
    return (
      <span className="truncate font-mono text-[13px] text-[var(--accent-green)]/85">
        {map}
      </span>
    );
  }

  if (onFilter) {
    return (
      <button
        type="button"
        onClick={() => onFilter(map)}
        className="truncate text-left font-mono text-[13px] text-[var(--accent-green)]/85 hover:text-[var(--accent-green)] hover:underline"
        title={`Filter by map: ${map}`}
      >
        {map}
      </button>
    );
  }

  return (
    <Link
      href={`/?map=${encodeURIComponent(map)}#servers`}
      className="truncate font-mono text-[13px] text-[var(--accent-green)]/85 hover:text-[var(--accent-green)] hover:underline"
      title={`Find servers running ${map}`}
    >
      {map}
    </Link>
  );
}

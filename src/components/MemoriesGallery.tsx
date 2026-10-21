"use client";

import { useState } from "react";
import Image from "next/image";
import type { MemoryEntry } from "@/types/memory";
import { INITIAL_MEMORIES_VISIBLE } from "@/data/memories";
import MemoryLightbox from "./MemoryLightbox";

interface MemoriesGalleryProps {
  memories: MemoryEntry[];
}

function MemoryCard({
  entry,
  onClick,
}: {
  entry: MemoryEntry;
  onClick: () => void;
}) {
  const hasMeta = entry.title || entry.year || entry.server || entry.map;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-video overflow-hidden rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-left transition-colors hover:border-[var(--border-green)] focus:outline-none focus:ring-1 focus:ring-[var(--border-green)]"
    >
      <Image
        src={entry.image}
        alt={entry.title ?? "Zombie Escape memory"}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        loading="lazy"
      />
      {hasMeta && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {entry.title && (
            <p className="truncate text-xs font-medium text-white">
              {entry.title}
            </p>
          )}
          <p className="truncate text-[11px] text-[var(--text-secondary)]">
            {[entry.year, entry.server, entry.map].filter(Boolean).join(" · ")}
          </p>
        </div>
      )}
    </button>
  );
}

export default function MemoriesGallery({ memories }: MemoriesGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_MEMORIES_VISIBLE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = memories.slice(0, visibleCount);
  const hasMore = visibleCount < memories.length;

  return (
    <section
      id="memories"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Zombie Escape Memories
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            From the community archive
          </p>
        </div>

        {memories.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            Old screenshots and community moments will be added here soon.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((entry) => (
                <MemoryCard
                  key={entry.image}
                  entry={entry}
                  onClick={() =>
                    setLightboxIndex(memories.indexOf(entry))
                  }
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((c) =>
                      Math.min(c + INITIAL_MEMORIES_VISIBLE, memories.length),
                    )
                  }
                  className="text-sm text-[var(--accent-green)] hover:underline"
                >
                  View more memories
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <MemoryLightbox
          memories={memories}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}

"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import type { MemoryEntry } from "@/types/memory";

interface MemoryLightboxProps {
  memories: MemoryEntry[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function MemoryLightbox({
  memories,
  index,
  onClose,
  onNavigate,
}: MemoryLightboxProps) {
  const entry = memories[index];
  const hasPrev = index > 0;
  const hasNext = index < memories.length - 1;

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    },
    [onClose, onNavigate, index, hasPrev, hasNext],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  if (!entry) return null;

  const meta = [
    entry.title,
    entry.map,
    entry.year,
    entry.server,
    entry.date,
  ].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close lightbox"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 right-0 z-20 rounded-lg border border-ze-border bg-ze-surface px-3 py-1.5 text-sm text-white hover:border-ze-green/40 focus:outline-none focus:ring-2 focus:ring-ze-green/40 sm:-right-2 sm:-top-10"
          aria-label="Close"
        >
          Close
        </button>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {hasPrev && (
            <button
              type="button"
              onClick={() => onNavigate(index - 1)}
              className="absolute left-0 z-20 rounded-lg border border-ze-border bg-ze-surface/90 px-3 py-2 text-sm text-white hover:border-ze-green/40 focus:outline-none focus:ring-2 focus:ring-ze-green/40"
              aria-label="Previous screenshot"
            >
              Previous
            </button>
          )}

          <div className="relative mx-10 max-h-[75vh] w-full overflow-hidden rounded-lg border border-ze-border">
            <Image
              src={entry.image}
              alt={entry.title ?? "Zombie Escape memory"}
              width={1280}
              height={720}
              className="h-auto max-h-[75vh] w-full object-contain"
              unoptimized
              priority
            />
          </div>

          {hasNext && (
            <button
              type="button"
              onClick={() => onNavigate(index + 1)}
              className="absolute right-0 z-20 rounded-lg border border-ze-border bg-ze-surface/90 px-3 py-2 text-sm text-white hover:border-ze-green/40 focus:outline-none focus:ring-2 focus:ring-ze-green/40"
              aria-label="Next screenshot"
            >
              Next
            </button>
          )}
        </div>

        {(meta.length > 0 || entry.description) && (
          <div className="mt-4 text-center">
            {meta.length > 0 && (
              <p className="text-sm font-medium text-white">
                {meta.join(" · ")}
              </p>
            )}
            {entry.description && (
              <p className="mt-1 text-sm text-ze-muted">{entry.description}</p>
            )}
          </div>
        )}

        <p className="mt-2 text-center text-xs text-ze-muted">
          {index + 1} / {memories.length}
        </p>
      </div>
    </div>
  );
}

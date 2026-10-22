"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import PeakHoursPanel from "@/components/PeakHoursPanel";
import { LIVE_PEAKS_PATH } from "@/lib/live-data-paths";
import { summarizePeakProfile, type PeakStore } from "@/lib/peak-stats";
import type { PeakSummary } from "@/types/server-detail";
import { useTranslations } from "@/i18n/LocaleProvider";

export default function PeakHoursToggle() {
  const t = useTranslations();
  const [summary, setSummary] = useState<PeakSummary | null>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    let cancelled = false;
    fetch(LIVE_PEAKS_PATH, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PeakStore | null) => {
        if (cancelled || !data?.global) return;
        const next = summarizePeakProfile(data.global);
        if (next.samples > 0) setSummary(next);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) {
      setBox(null);
      return;
    }

    const update = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const row = rootRef.current?.parentElement?.getBoundingClientRect();
      const width = Math.min(352, window.innerWidth - 16);
      const rightEdge = row?.right ?? rect.right;
      const left = Math.min(
        Math.max(8, rightEdge - width),
        window.innerWidth - width - 8,
      );
      setBox({ top: rect.bottom + 6, left, width });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!summary) return null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className={`rounded-md border bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs transition-colors hover:border-[var(--border-green)] hover:text-[var(--text-primary)] ${
          open
            ? "border-[var(--border-green)] text-[var(--text-primary)]"
            : "border-[var(--border-subtle)] text-[var(--text-secondary)]"
        }`}
      >
        {t("peaks.open")}
      </button>
      {open && box && (
        <div
          id={panelId}
          role="dialog"
          aria-label={t("peaks.detailTitle")}
          className="z-[60] rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-xl"
          style={{
            position: "fixed",
            top: box.top,
            left: box.left,
            width: box.width,
          }}
        >
          <PeakHoursPanel summary={summary} plain />
        </div>
      )}
    </div>
  );
}

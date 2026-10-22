"use client";

import { useMemo } from "react";
import type { PeakSummary } from "@/types/server-detail";
import { useLocale, useTranslations } from "@/i18n/LocaleProvider";
import {
  rotateHoursToLocal,
  utcSlotToLocal,
} from "@/lib/peak-stats";

interface PeakHoursPanelProps {
  summary: PeakSummary | null | undefined;
  title?: string;
  plain?: boolean;
}

const MIN_SAMPLES = 4;
const MIN_WEEKDAYS = 2;

function BarRow({
  values,
  labels,
  highlight,
}: {
  values: number[];
  labels: string[];
  highlight: number | null;
}) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-[3px]" role="img">
      {values.map((value, index) => {
        const height = Math.max(2, Math.round((value / max) * 28));
        const active = highlight === index;
        return (
          <div key={`${labels[index]}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
            <div
              className={`w-full rounded-sm ${
                active
                  ? "bg-[var(--accent-green)]"
                  : "bg-[color-mix(in_srgb,var(--accent-green)_35%,var(--border-subtle))]"
              }`}
              style={{ height }}
              title={`${labels[index]} · ${value}`}
            />
            <span className="truncate text-[9px] leading-none text-[var(--text-secondary)]">
              {labels[index]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function PeakHoursPanel({
  summary,
  title,
  plain = false,
}: PeakHoursPanelProps) {
  const t = useTranslations();
  const { localeTag } = useLocale();

  const view = useMemo(() => {
    if (!summary || summary.samples < 1) return null;

    const weekdayLabels = Array.from({ length: 7 }, (_, day) => {
      const date = new Date(Date.UTC(2026, 5, 7 + day));
      return date.toLocaleDateString(localeTag, {
        weekday: "short",
        timeZone: "UTC",
      });
    });

    const localHours = rotateHoursToLocal(summary.hourAvg);
    const hourLabels = localHours.map((_, hour) =>
      hour % 6 === 0 ? String(hour).padStart(2, "0") : "",
    );

    const slot =
      summary.busiestWeekday != null && summary.busiestHour != null
        ? utcSlotToLocal(summary.busiestWeekday, summary.busiestHour)
        : null;

    const busiestWeekdayLabel = slot
      ? slot.date.toLocaleDateString(localeTag, { weekday: "long" })
      : "";
    const busiestTimeLabel = slot
      ? slot.date.toLocaleTimeString(localeTag, {
          hour: "numeric",
        })
      : "";

    const recordWhen = summary.allTimePeak
      ? new Date(summary.allTimePeak.at).toLocaleString(localeTag, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

    const localHourHighlight =
      slot != null ? slot.hour : argMax(localHours);
    const weekdayHighlight = summary.busiestWeekday;

    return {
      weekdayLabels,
      localHours,
      hourLabels,
      busiestWeekdayLabel,
      busiestTimeLabel,
      recordWhen,
      localHourHighlight,
      weekdayHighlight,
      showPattern:
        summary.samples >= MIN_SAMPLES &&
        summary.weekdaysCovered >= MIN_WEEKDAYS,
    };
  }, [summary, localeTag]);

  if (!summary || !view) return null;

  const heading = title ?? t("peaks.detailTitle");
  const body = (
    <>
      {view.showPattern && view.busiestWeekdayLabel ? (
        <p className="text-sm text-[var(--text-primary)]">
          {t("peaks.busiest", {
            weekday: view.busiestWeekdayLabel,
            time: view.busiestTimeLabel,
          })}
        </p>
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">
          {t("peaks.collecting")}
        </p>
      )}

      {summary.allTimePeak && (
        <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
          {t("peaks.record", {
            players: summary.allTimePeak.players,
            when: view.recordWhen,
          })}
        </p>
      )}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[11px] text-[var(--text-secondary)]">
            {t("peaks.weekdays")}
          </p>
          <BarRow
            values={summary.weekdayAvg}
            labels={view.weekdayLabels}
            highlight={view.weekdayHighlight}
          />
        </div>
        <div>
          <p className="mb-1 text-[11px] text-[var(--text-secondary)]">
            {t("peaks.hours")}
          </p>
          <BarRow
            values={view.localHours}
            labels={view.hourLabels}
            highlight={view.localHourHighlight}
          />
        </div>
      </div>
      <p className="mt-2 text-[11px] text-[var(--text-secondary)]/80">
        {t("peaks.localNote")}
      </p>
    </>
  );

  if (plain) {
    return (
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {heading}
        </p>
        {body}
      </div>
    );
  }

  return (
    <section className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-primary)]/35 px-3 py-2.5">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {heading}
        </h3>
        <span className="text-[11px] text-[var(--text-secondary)]">
          {t("peaks.samples", { count: summary.samples })}
        </span>
      </div>
      {body}
    </section>
  );
}

function argMax(values: number[]): number | null {
  let best = -1;
  let index: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > best) {
      best = values[i];
      index = i;
    }
  }
  return best > 0 ? index : null;
}

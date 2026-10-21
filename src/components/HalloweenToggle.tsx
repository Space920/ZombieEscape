"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/LocaleProvider";
import {
  isHalloweenActive,
  readHalloweenEnabled,
  rememberHalloweenEnabled,
} from "@/lib/halloween";

export default function HalloweenToggle() {
  const t = useTranslations();
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isHalloweenActive());
    setEnabled(readHalloweenEnabled());
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const next = !enabled;
        setEnabled(next);
        rememberHalloweenEnabled(next);
      }}
      className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
      aria-pressed={enabled}
    >
      {enabled ? t("halloween.hide") : t("halloween.show")}
    </button>
  );
}

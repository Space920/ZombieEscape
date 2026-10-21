"use client";

import { LOCALES } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleProvider";

const selectClass =
  "rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--border-green)] focus:outline-none";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">{t("language.label")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        aria-label={t("language.label")}
        className={selectClass}
      >
        {LOCALES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

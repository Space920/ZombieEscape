"use client";

import { useTranslations } from "@/i18n/LocaleProvider";

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  serverName: string;
}

export default function FavoriteButton({
  active,
  onToggle,
  serverName,
}: FavoriteButtonProps) {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={
        active
          ? t("favorites.removeAria", { name: serverName })
          : t("favorites.addAria", { name: serverName })
      }
      aria-pressed={active}
      className={`shrink-0 rounded px-1 py-0.5 text-[14px] leading-none transition-colors ${
        active
          ? "text-[var(--accent-green)]"
          : "text-[var(--text-secondary)]/50 hover:text-[var(--text-secondary)]"
      }`}
      title={active ? t("favorites.remove") : t("favorites.add")}
    >
      {active ? "★" : "☆"}
    </button>
  );
}

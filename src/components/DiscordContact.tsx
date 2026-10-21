"use client";

import DiscordIcon from "./DiscordIcon";
import { useTranslations } from "@/i18n/LocaleProvider";
import { useState } from "react";

export const DISCORD_USERNAME = "spacemonkey716";

export default function DiscordContact() {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(DISCORD_USERNAME);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--text-secondary)]">
      <DiscordIcon className="h-4 w-4 shrink-0 text-[#5865F2]" />
      <span>
        {t("contact.discordLabel")}{" "}
        <span className="font-mono text-[var(--text-primary)]">
          {DISCORD_USERNAME}
        </span>
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("contact.copyAria")}
        className="rounded border border-[var(--border-subtle)] px-2.5 py-1 text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-green)] hover:text-[var(--text-primary)]"
      >
        {copied ? t("contact.copied") : t("contact.copyDiscord")}
      </button>
    </p>
  );
}

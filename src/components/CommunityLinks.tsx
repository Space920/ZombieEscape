"use client";

import DiscordIcon from "./DiscordIcon";
import { useTranslations } from "@/i18n/LocaleProvider";

interface CommunityLinksProps {
  website?: string;
  discord?: string;
}

export default function CommunityLinks({ website, discord }: CommunityLinksProps) {
  const t = useTranslations();
  if (!website && !discord) return null;

  const linkClass =
    "inline-flex items-center gap-1 text-[12px] text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-green)]";

  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {t("links.website")}
        </a>
      )}
      {discord && (
        <a
          href={discord}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <DiscordIcon className="h-3 w-3 text-[#5865F2]" />
          {t("links.discord")}
        </a>
      )}
    </p>
  );
}

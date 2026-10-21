"use client";

import MapProgressPanel from "./MapProgressPanel";
import { hasMapProgress } from "@/data/community-maps";
import { useTranslations } from "@/i18n/LocaleProvider";
import type { CommunityId } from "@/types/server";

interface ServerMapProgressProps {
  community: CommunityId;
}

export default function ServerMapProgress({ community }: ServerMapProgressProps) {
  const t = useTranslations();

  if (hasMapProgress(community)) {
    return (
      <MapProgressPanel community={community} variant="card" compact />
    );
  }

  return (
    <section className="w-full space-y-1.5">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        {t("mapProgress.title")}
      </h4>
      <p className="text-[11px] text-[var(--text-secondary)]">
        {t("mapProgress.missingData")}
      </p>
    </section>
  );
}

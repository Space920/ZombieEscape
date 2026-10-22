"use client";

import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import MapProgressSection from "@/components/MapProgressSection";
import SiteFooter from "@/components/SiteFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PeakHoursToggle from "@/components/PeakHoursToggle";
import { useTranslations } from "@/i18n/LocaleProvider";

export default function MapeadoresMapsPage() {
  const t = useTranslations();

  return (
    <>
      <CursorGlow />
      <div className="relative z-10 border-b border-[var(--border-subtle)]">
        <nav
          aria-label="Page navigation"
          className="mx-auto max-w-5xl px-4 py-3 sm:px-6"
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/#servers"
              className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-green)]"
            >
              {t("nav.backToServers")}
            </Link>
            <div className="flex items-center gap-2">
              <PeakHoursToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </div>
      <main className="relative z-10">
        <MapProgressSection community="mapeadores" />
      </main>
      <SiteFooter />
    </>
  );
}

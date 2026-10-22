"use client";

import Link from "next/link";
import Cs2Logo from "@/components/Cs2Logo";
import HalloweenToggle from "@/components/HalloweenToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PeakHoursToggle from "@/components/PeakHoursToggle";
import { useTranslations } from "@/i18n/LocaleProvider";

export default function Hero() {
  const t = useTranslations();

  return (
    <header className="relative z-10">
      <div className="relative mx-auto max-w-5xl px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <PeakHoursToggle />
          <HalloweenToggle />
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <Cs2Logo size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="ze-title-split text-[1.85rem] leading-[0.95] sm:text-4xl lg:text-[2.85rem]">
              <span className="sr-only">CS2 </span>
              <span className="text-glow text-[var(--accent-green)]">
                Zombie Escape
              </span>
              <span className="text-white"> Servers</span>
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-[15px]">
          {t("hero.subtitle")}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          {t("hero.description")}
        </p>
        <p className="mt-3 text-xs text-[var(--text-secondary)]/90">
          {t("hero.tagline")}
        </p>
        <p className="mt-3">
          <Link
            href="/zombie-escape"
            className="inline-flex items-center rounded-full border border-[var(--border-green)] bg-[var(--accent-green-muted)] px-3 py-1 text-xs font-semibold text-[var(--accent-green)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-green)_18%,transparent)]"
          >
            {t("hero.guideLink")}
          </Link>
        </p>
      </div>
    </header>
  );
}

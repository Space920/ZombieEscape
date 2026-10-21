"use client";

import Link from "next/link";
import Cs2Logo from "@/components/Cs2Logo";
import HalloweenToggle from "@/components/HalloweenToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "@/i18n/LocaleProvider";

export default function Hero() {
  const t = useTranslations();

  return (
    <header className="relative z-10">
      <div className="relative mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-3 flex items-center justify-end gap-2">
          <HalloweenToggle />
          <LanguageSwitcher />
        </div>
        <div className="flex items-start gap-4">
          <Cs2Logo size="lg" className="mt-1" />
          <div className="min-w-0 flex-1">
            <h1 className="ze-title-split text-3xl sm:text-4xl lg:text-[2.75rem]">
              <span className="text-white">CS2 </span>
              <span className="text-white">Zombie </span>
              <span className="text-[var(--accent-green)]">Escape</span>
              <span className="text-white"> Servers</span>
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
              {t("hero.subtitle")}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              {t("hero.description")}
            </p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]/80">
              {t("hero.tagline")}
            </p>
            <p className="mt-2 text-sm">
              <Link
                href="/zombie-escape"
                className="text-[var(--accent-green)] hover:underline"
              >
                {t("hero.guideLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

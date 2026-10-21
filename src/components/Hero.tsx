"use client";

import Link from "next/link";
import Cs2Logo from "@/components/Cs2Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "@/i18n/LocaleProvider";

export default function Hero() {
  const t = useTranslations();

  return (
    <header className="relative z-10 border-b border-[var(--border-subtle)]">
      <div className="relative mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-3 flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="flex items-start gap-4">
          <Cs2Logo size="lg" className="mt-1" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="ze-title-split text-3xl sm:text-4xl lg:text-[2.75rem]">
                <span className="text-white">CS2 </span>
                <span className="text-white">Zombie </span>
                <span className="text-[var(--accent-green)]">Escape</span>
                <span className="text-white"> Servers</span>
              </h1>
              <span className="halloween-only halloween-badge items-center rounded border border-[var(--border-green)] bg-[var(--accent-green-muted)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-green)]">
                {t("halloween.badge")}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
              {t("hero.subtitle")}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              {t("hero.description")}
            </p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]/80">
              {t("hero.tagline")}
            </p>
            <p className="halloween-only mt-1 text-xs text-[var(--text-secondary)]">
              {t("halloween.until")}
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

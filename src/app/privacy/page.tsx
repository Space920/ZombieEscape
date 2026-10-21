"use client";

import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import SiteFooter, { CONTACT_EMAIL } from "@/components/SiteFooter";
import DiscordContact from "@/components/DiscordContact";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "@/i18n/LocaleProvider";

export default function PrivacyPage() {
  const t = useTranslations();

  return (
    <>
      <CursorGlow />
      <div className="relative z-10 border-b border-[var(--border-subtle)]">
        <nav
          aria-label="Page navigation"
          className="mx-auto max-w-3xl px-4 py-3 sm:px-6"
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-green)]"
            >
              {t("nav.backToBrowser")}
            </Link>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          {t("privacy.title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {t("privacy.updated")}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[var(--text-secondary)]">
          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
              {t("privacy.overviewTitle")}
            </h2>
            <p>{t("privacy.overviewText")}</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
              {t("privacy.collectTitle")}
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-[var(--text-primary)]">
                  {t("privacy.serverDataLabel")}
                </strong>{" "}
                {t("privacy.serverDataText")}
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  {t("privacy.browserStorageLabel")}
                </strong>{" "}
                {t("privacy.browserStorageText")}
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  {t("privacy.hostingLogsLabel")}
                </strong>{" "}
                {t("privacy.hostingLogsText")}
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  {t("privacy.visitStatsLabel")}
                </strong>{" "}
                {t("privacy.visitStatsText")}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
              {t("privacy.thirdPartyTitle")}
            </h2>
            <p>{t("privacy.thirdPartyText")}</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
              {t("privacy.notDoTitle")}
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>{t("privacy.notSell")}</li>
              <li>{t("privacy.notPayment")}</li>
              <li>{t("privacy.notProfile")}</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
              {t("privacy.contactTitle")}
            </h2>
            <p>
              {t("privacy.contactText")}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[var(--accent-green)] hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <DiscordContact />
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

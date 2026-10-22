"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/i18n/LocaleProvider";

const CONTACT_EMAIL = "Spacemonkey7716@gmail.com";

const SEO_LINKS = [
  { href: "/cs2-zombie-escape", label: "CS2 ZE" },
  { href: "/zombie-escape", label: "ZE servers" },
  { href: "/mapeadores/maps", label: "Mapeadores maps" },
  { href: "/gfl/maps", label: "GFL maps" },
  { href: "/csgo-zombie-escape", label: "CS:GO ZE" },
] as const;

function DirectoryLink() {
  const t = useTranslations();
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/directory.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { href?: string } | null) => {
        if (cancelled) return;
        if (typeof data?.href === "string" && data.href.startsWith("http")) {
          setHref(data.href);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent-green)]"
    >
      {t("footer.directory")}
    </a>
  );
}

export default function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="relative z-10 border-t border-[var(--border-subtle)] py-5">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <nav aria-label="Site sections" className="mb-3 flex flex-wrap justify-center gap-x-3 gap-y-1">
          {SEO_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--accent-green)]"
            >
              {link.label}
            </Link>
          ))}
          <DirectoryLink />
        </nav>
        <p className="text-xs text-[var(--text-secondary)]">
          {t("footer.disclaimer")}
        </p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">
          <Link
            href="/privacy"
            className="text-[var(--accent-green)] hover:underline"
          >
            {t("footer.privacy")}
          </Link>
          {" · "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[var(--accent-green)] hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  );
}

export { CONTACT_EMAIL };

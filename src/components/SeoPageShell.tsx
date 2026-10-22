import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import SiteFooter from "@/components/SiteFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PeakHoursToggle from "@/components/PeakHoursToggle";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";

interface SeoPageShellProps {
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
}

export default function SeoPageShell({
  breadcrumbs,
  children,
}: SeoPageShellProps) {
  return (
    <>
      <CursorGlow />
      <div className="relative z-10 border-b border-[var(--border-subtle)]">
        <nav
          aria-label="Site navigation"
          className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
        >
          <Link
            href="/"
            className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-green)]"
          >
            ← Live server browser
          </Link>
          <div className="flex items-center gap-2">
            <PeakHoursToggle />
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs items={breadcrumbs} />
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

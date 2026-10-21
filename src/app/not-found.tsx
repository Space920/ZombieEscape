import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <CursorGlow />
      <main className="relative z-10 mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          That page does not exist. Try one of these instead:
        </p>
        <nav
          aria-label="Helpful links"
          className="mt-6 flex flex-col gap-2 text-sm"
        >
          <Link
            href="/#servers"
            className="text-[var(--accent-green)] hover:underline"
          >
            Live ZE server browser
          </Link>
          <Link
            href="/zombie-escape"
            className="text-[var(--accent-green)] hover:underline"
          >
            Zombie Escape guide
          </Link>
          <Link
            href="/mapeadores/maps"
            className="text-[var(--accent-green)] hover:underline"
          >
            Mapeadores map progress
          </Link>
          <Link href="/" className="text-[var(--accent-green)] hover:underline">
            Homepage
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}

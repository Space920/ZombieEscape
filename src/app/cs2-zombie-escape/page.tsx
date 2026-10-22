import type { Metadata } from "next";
import Link from "next/link";
import SeoPageShell from "@/components/SeoPageShell";
import { createPageMetadata } from "@/lib/site";
import { SERVERS } from "@/data/servers";
import { CS2_SERVER_COUNT } from "@/lib/server-seo";

export const metadata: Metadata = createPageMetadata({
  title: "CS2 Zombie Escape Servers & ZE Community",
  description:
    "Browse active CS2 Zombie Escape servers on Source 2 — live player counts, current maps, ZE communities and direct connect.",
  path: "/cs2-zombie-escape",
  keywords: [
    "cs2 zombie escape",
    "zombie escape cs2",
    "cs2 ze",
    "s2 ze",
    "source 2 zombie escape",
    "cs2 ze servers",
  ],
});

export default function Cs2ZombieEscapePage() {
  const cs2Servers = SERVERS.filter((s) => s.game === "cs2");

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Zombie Escape", href: "/zombie-escape" },
        { label: "CS2 Zombie Escape" },
      ]}
    >
      <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
        CS2 <span className="text-[var(--accent-green)]">Zombie Escape</span>
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        CS2 Zombie Escape (CS2 ZE) is the Source 2 continuation of the Counter-Strike
        Zombie Escape scene. ZE Servers tracks {CS2_SERVER_COUNT} active CS2 ZE
        servers with live player counts, current maps and community links — updated
        from real server queries, not static listings.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Source 2 / S2 ZE
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Counter-Strike 2 runs on the Source 2 engine. Players often refer to
          CS2 ZE as S2 ZE or Source 2 Zombie Escape. The communities listed here
          host 24/7 CS2 ZE servers across North America, Europe, Asia and South
          America.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Active CS2 ZE servers
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Open the{" "}
          <Link href="/#servers" className="text-[var(--accent-green)] hover:underline">
            live server browser
          </Link>{" "}
          to join directly, or view individual server pages:
        </p>
        <ul className="space-y-1.5 text-sm">
          {cs2Servers.map((server) => (
            <li key={server.id}>
              <Link
                href={`/servers/${server.id}`}
                className="text-[var(--accent-green)] hover:underline"
              >
                {server.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          CS2 ZE maps &amp; communities
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          CS2 ZE communities share custom workshop maps. Track Mapeadores EU{" "}
          <Link
            href="/mapeadores/maps"
            className="text-[var(--accent-green)] hover:underline"
          >
            Zombie Escape map progress
          </Link>{" "}
          or read about the broader{" "}
          <Link
            href="/csgo-zombie-escape"
            className="text-[var(--accent-green)] hover:underline"
          >
            CS:GO ZE community history
          </Link>
          .
        </p>
      </section>
    </SeoPageShell>
  );
}

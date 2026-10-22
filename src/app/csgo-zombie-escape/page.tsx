import type { Metadata } from "next";
import Link from "next/link";
import SeoPageShell from "@/components/SeoPageShell";
import { createPageMetadata } from "@/lib/site";
import { SERVERS } from "@/data/servers";
import { gameSeoLabel } from "@/lib/server-seo";

export const metadata: Metadata = createPageMetadata({
  title: "CS:GO Zombie Escape Servers, Maps & Communities",
  description:
    "Learn about CS:GO Zombie Escape communities, find active ZE servers on CS2 and CS:S, and browse live player counts and maps.",
  path: "/csgo-zombie-escape",
  keywords: [
    "zombie escape csgo",
    "csgo zombie escape",
    "csgo ze",
    "csgo zombie escape servers",
    "csgo ze servers",
  ],
});

export default function CsgoZombieEscapePage() {
  const cs2Servers = SERVERS.filter((s) => s.game === "cs2" || s.game === "csgo");
  const cssServers = SERVERS.filter((s) => s.game === "css");

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Zombie Escape", href: "/zombie-escape" },
        { label: "CS:GO Zombie Escape" },
      ]}
    >
      <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
        CS:GO <span className="text-[var(--accent-green)]">Zombie Escape</span>
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        CS:GO Zombie Escape (CS:GO ZE) is the game mode that popularised
        custom-map survival on Counter-Strike. Many CS:GO ZE communities have
        since moved to Counter-Strike 2. This browser lists the active servers
        those communities run today — not outdated or offline listings.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Active CS:GO ZE communities on CS2
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {cs2Servers.length} tracked servers on this site run{" "}
          <Link
            href="/cs2-zombie-escape"
            className="text-[var(--accent-green)] hover:underline"
          >
            CS2 Zombie Escape
          </Link>{" "}
          (Source 2), continuing the CS:GO ZE map tradition on the current
          Counter-Strike engine. Check{" "}
          <Link href="/#servers" className="text-[var(--accent-green)] hover:underline">
            live CS:GO ZE-style servers
          </Link>{" "}
          for current player counts and maps.
        </p>
        <ul className="space-y-1.5 text-sm">
          {cs2Servers.map((server) => (
            <li key={server.id}>
              <Link
                href={`/servers/${server.id}`}
                className="text-[var(--accent-green)] hover:underline"
              >
                {server.name}
              </Link>{" "}
              <span className="text-[var(--text-secondary)]">
                ({gameSeoLabel(server.game)})
              </span>
            </li>
          ))}
        </ul>
      </section>

      {cssServers.length > 0 && (
        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Legacy CS:S ZE
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Some communities still host Counter-Strike: Source Zombie Escape
            servers alongside the CS2 transition:
          </p>
          <ul className="space-y-1.5 text-sm">
            {cssServers.map((server) => (
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
      )}

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          CS:GO ZE maps
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          CS:GO ZE communities track map completion together. See the{" "}
          <Link
            href="/mapeadores/maps"
            className="text-[var(--accent-green)] hover:underline"
          >
            Mapeadores ZE map list
          </Link>{" "}
          for beaten and remaining custom maps.
        </p>
      </section>
    </SeoPageShell>
  );
}

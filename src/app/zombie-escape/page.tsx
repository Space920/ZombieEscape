import type { Metadata } from "next";
import Link from "next/link";
import SeoPageShell from "@/components/SeoPageShell";
import JsonLd from "@/components/JsonLd";
import { createPageMetadata, SITE_URL } from "@/lib/site";
import { SERVERS } from "@/data/servers";
import { CS2_SERVER_COUNT, CSS_SERVER_COUNT } from "@/lib/server-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Zombie Escape in Counter-Strike – CS2 & CS:GO ZE Guide",
  description:
    "What is Zombie Escape (ZE)? Learn how ZE rounds work, find active CS2 and CS:GO ZE servers, explore maps and communities on ZE Servers.",
  path: "/zombie-escape",
  keywords: [
    "zombie escape",
    "zombie escape csgo",
    "csgo zombie escape",
    "csgo ze",
    "cs2 zombie escape",
    "cs2 ze",
    "s2 ze",
    "counter-strike zombie escape",
    "ze servers",
    "zombie escape servers",
  ],
});

const FAQ_ITEMS = [
  {
    question: "What does ZE mean in Counter-Strike?",
    answer:
      "ZE stands for Zombie Escape — a custom game mode where human survivors run through maps while infected players chase and convert them. It is one of the most popular community modes in Counter-Strike history.",
  },
  {
    question: "What is Zombie Escape?",
    answer:
      "Zombie Escape is a team-based mode on custom maps. Survivors must reach the end of each map while zombies try to infect them. Rounds are fast, map variety is huge, and communities often beat new maps together over weeks or months.",
  },
  {
    question: "How do I join a CS:GO or CS2 Zombie Escape server?",
    answer:
      "Open the ZE Servers homepage, pick an online server, and click Join to connect through Steam. You can also copy the server IP and paste it into the in-game console with connect host:port.",
  },
  {
    question: "How do I copy a server IP?",
    answer:
      "On the server browser or a server detail page, use the Copy IP button next to any server. The address is copied to your clipboard so you can paste it into Steam or the game console.",
  },
  {
    question: "What are Zombie Escape maps?",
    answer:
      "ZE maps are custom community creations, usually prefixed with ze_. They range from short escape routes to long cinematic adventures. Current maps appear on each server's live status; the Mapeadores community also publishes a public map progress list.",
  },
  {
    question: "Where can I find active Zombie Escape servers?",
    answer:
      "The ZE Servers homepage lists tracked CS2 and CS:S ZE servers with live player counts, current maps and direct connect links. Data refreshes automatically from public game server queries.",
  },
  {
    question: "Is Zombie Escape available in CS2?",
    answer:
      "Yes — most communities tracked on this site run Counter-Strike 2 (Source 2) ZE servers today. One Counter-Strike: Source server (NiDE) is listed separately. Not every historical CS:GO ZE community has moved to CS2 yet; this site only lists servers we actively query.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Zombie Escape Guide",
      item: `${SITE_URL}/zombie-escape`,
    },
  ],
};

export default function ZombieEscapePage() {
  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Zombie Escape Guide" },
      ]}
    >
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
        <span className="text-[var(--accent-green)]">Zombie Escape</span> in
        Counter-Strike
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
        <strong className="text-[var(--text-primary)]">Zombie Escape</strong>{" "}
        (often shortened to <strong className="text-[var(--text-primary)]">ZE</strong>
        ) is a Counter-Strike game mode where survivors run custom maps while
        zombies chase and infect them. ZE Servers is a community-maintained{" "}
        <Link href="/" className="text-[var(--accent-green)] hover:underline">
          live ZE server browser
        </Link>{" "}
        — currently tracking {CS2_SERVER_COUNT} Counter-Strike 2 servers and{" "}
        {CSS_SERVER_COUNT} Counter-Strike: Source server.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          What does ZE mean?
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          ZE is shorthand for Zombie Escape. Players search for it as{" "}
          <em>csgo ze</em>, <em>cs2 ze</em>, <em>s2 ze</em>, or{" "}
          <em>zombie escape servers</em>. The mode itself is the same idea
          across Counter-Strike versions — only the game client changes.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          How a Zombie Escape round works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          At round start, a few players become zombies. Survivors must reach
          checkpoints or the map exit before time runs out. Getting touched by a
          zombie usually infects you. Maps have traps, narrow corridors, and
          scripted events — teamwork and knowing the route matter more than raw
          aim.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          How to find an active ZE server
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Use the{" "}
          <Link href="/#servers" className="text-[var(--accent-green)] hover:underline">
            live ZE server list
          </Link>{" "}
          on the homepage for player counts, current maps, and Join / Copy IP.
          Looking for a busy server?{" "}
          <Link href="/servers/gfl" className="text-[var(--accent-green)] hover:underline">
            GFL
          </Link>{" "}
          is the most popular in America, and{" "}
          <Link
            href="/servers/mapeadores"
            className="text-[var(--accent-green)] hover:underline"
          >
            Mapeadores
          </Link>{" "}
          is the most popular in Europe.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Zombie Escape maps
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          ZE communities create and beat custom maps together. Click any live
          map name in the browser to filter servers running that map. Track
          progress on the{" "}
          <Link
            href="/mapeadores/maps"
            className="text-[var(--accent-green)] hover:underline"
          >
            Mapeadores map list
          </Link>{" "}
          and the{" "}
          <Link
            href="/gfl/maps"
            className="text-[var(--accent-green)] hover:underline"
          >
            GFL map list
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Zombie Escape communities
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Each tracked server belongs to a community such as GFL, Mapeadores,
          UNLOZE, or NiDE. Browse{" "}
          <Link href="/#servers" className="text-[var(--accent-green)] hover:underline">
            active ZE servers
          </Link>{" "}
          or open a community&apos;s dedicated page:
        </p>
        <ul className="space-y-1.5 text-sm">
          {SERVERS.map((server) => (
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
          CS:GO Zombie Escape
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Many players still search for{" "}
          <Link
            href="/csgo-zombie-escape"
            className="text-[var(--accent-green)] hover:underline"
          >
            CS:GO Zombie Escape
          </Link>
          . Most listed communities now run on Counter-Strike 2 — see our{" "}
          <Link
            href="/cs2-zombie-escape"
            className="text-[var(--accent-green)] hover:underline"
          >
            CS2 Zombie Escape
          </Link>{" "}
          page for Source 2 details. This site reflects what is online today,
          not outdated listings.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          CS2 / Source 2 Zombie Escape
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Counter-Strike 2 is the primary platform for modern ZE. The homepage
          lists {CS2_SERVER_COUNT} CS2 servers with live status. Counter-Strike:
          Source servers are shown in a separate section because they require a
          different game client.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Frequently asked questions
        </h2>
        <dl className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question}>
              <dt className="text-sm font-medium text-[var(--text-primary)]">
                {item.question}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </SeoPageShell>
  );
}

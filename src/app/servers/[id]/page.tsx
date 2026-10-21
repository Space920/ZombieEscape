import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeoPageShell from "@/components/SeoPageShell";
import ServerLivePreview from "@/components/ServerLivePreview";
import CommunityLinks from "@/components/CommunityLinks";
import CommunityLogo from "@/components/CommunityLogo";
import { SERVERS } from "@/data/servers";
import { COMMUNITIES, REGION_LABELS } from "@/data/communities";
import { createPageMetadata } from "@/lib/site";
import {
  gameSeoLabel,
  gameZePhrase,
  serverPageDescription,
  serverPageTitle,
} from "@/lib/server-seo";
import { copyServerAddress } from "@/lib/connect";

interface ServerPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return SERVERS.map((server) => ({ id: server.id }));
}

export async function generateMetadata({
  params,
}: ServerPageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = SERVERS.find((s) => s.id === id);
  if (!entry) return {};

  return createPageMetadata({
    title: serverPageTitle(entry),
    description: serverPageDescription(entry),
    path: `/servers/${id}`,
    keywords: [
      "zombie escape server",
      "ze server",
      gameZePhrase(entry.game).toLowerCase(),
      `${COMMUNITIES[entry.community].shortLabel.toLowerCase()} ze`,
    ],
  });
}

export default async function ServerPage({ params }: ServerPageProps) {
  const { id } = await params;
  const entry = SERVERS.find((s) => s.id === id);
  if (!entry) notFound();

  const community = COMMUNITIES[entry.community];
  const address = copyServerAddress(entry.host, entry.port);
  const gameLabel = gameSeoLabel(entry.game);
  const zePhrase = gameZePhrase(entry.game);

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Zombie Escape", href: "/zombie-escape" },
        { label: entry.name },
      ]}
    >
      <div className="mb-4 flex items-center gap-3">
        <CommunityLogo communityId={entry.community} size="md" />
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
            {entry.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {zePhrase} server · {REGION_LABELS[entry.region] ?? entry.region} ·{" "}
            {community.label}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        This {gameLabel} Zombie Escape server is operated by{" "}
        {community.label}.
        {entry.id === "gfl" &&
          " GFL is the most popular ZE server in America."}
        {entry.id === "mapeadores" &&
          " Mapeadores is the most popular ZE server in Europe."}
        {entry.id === "possession" &&
          " Possession is the most popular ZE server in Asia."}{" "}
        Connect at{" "}
        <span className="font-mono text-[var(--text-primary)]">{address}</span>{" "}
        or use the live status below.
      </p>

      <div className="mt-4">
        <CommunityLinks website={entry.website} discord={entry.discord} />
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Live status
        </h2>
        <ServerLivePreview serverId={entry.id} />
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Other ZE servers
        </h2>
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
          {SERVERS.filter((s) => s.id !== entry.id).map((server) => (
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
          More ZE servers
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Browse all{" "}
          <Link href="/#servers" className="text-[var(--accent-green)] hover:underline">
            active Zombie Escape servers
          </Link>
          , explore{" "}
          <Link
            href={entry.game === "cs2" ? "/cs2-zombie-escape" : "/csgo-zombie-escape"}
            className="text-[var(--accent-green)] hover:underline"
          >
            {entry.game === "cs2" ? "CS2 ZE servers" : "CS:GO ZE servers"}
          </Link>
          , or view{" "}
          <Link
            href={
              entry.community === "gfl" ? "/gfl/maps" : "/mapeadores/maps"
            }
            className="text-[var(--accent-green)] hover:underline"
          >
            {entry.community === "gfl"
              ? "GFL map progress"
              : "Zombie Escape maps"}
          </Link>
          .
        </p>
      </section>
    </SeoPageShell>
  );
}

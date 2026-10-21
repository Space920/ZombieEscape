import type { Metadata } from "next";
import { Suspense } from "react";
import ServerBrowser from "@/components/ServerBrowser";
import CursorGlow from "@/components/CursorGlow";
import Hero from "@/components/Hero";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import {
  createPageMetadata,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Zombie Escape Servers",
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <CursorGlow />
      <Hero />
      <main className="relative z-10">
        <Suspense
          fallback={
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
              <div className="h-32 animate-pulse rounded-lg bg-ze-surface/60" />
            </div>
          }
        >
          <ServerBrowser />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

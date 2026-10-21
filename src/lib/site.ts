import type { Metadata } from "next";

/** Production site origin — used for canonical URLs, sitemap, and Open Graph. */
export const SITE_URL = "https://zeservers.com";

export const SITE_NAME = "ZE Servers";

export const DEFAULT_TITLE =
  "CS2 & CS:GO Zombie Escape Servers – Live ZE Server List | ZE Servers";

export const DEFAULT_DESCRIPTION =
  "Browse active CS2 and CS:GO Zombie Escape servers with live player counts, current maps, ZE communities and direct connection details. CS:S servers included when live.";

export const DEFAULT_KEYWORDS = [
  "cs2 zombie escape",
  "zombie escape cs2",
  "cs2 ze",
  "zombie escape servers",
  "ze servers",
  "counter-strike zombie escape",
  "zombie escape csgo",
  "csgo zombie escape",
  "cs:s zombie escape",
  "zombie escape server browser",
];

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords?: string[];
  /** Use for the homepage so the title template is not applied twice. */
  absoluteTitle?: boolean;
};

/** Shared metadata fields for indexable public pages. */
export function createPageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: "/assets/cs2-icon.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/assets/cs2-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/assets/cs2-icon.png",
    apple: "/assets/cs2-icon.png",
  },
};

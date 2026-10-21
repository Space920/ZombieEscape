import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVERS } from "@/data/servers";

export const dynamic = "force-static";

const SEO_PAGES = [
  "/zombie-escape",
  "/csgo-zombie-escape",
  "/cs2-zombie-escape",
  "/mapeadores/maps",
  "/gfl/maps",
  "/privacy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "hourly",
      priority: 1,
    },
    ...SEO_PAGES.map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: path.endsWith("/maps")
        ? ("daily" as const)
        : ("weekly" as const),
      priority:
        path.startsWith("/zombie") ||
        path.includes("csgo") ||
        path.includes("cs2")
          ? 0.9
          : 0.5,
    })),
  ];

  const serverPages: MetadataRoute.Sitemap = SERVERS.map((server) => ({
    url: `${SITE_URL}/servers/${server.id}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...serverPages];
}

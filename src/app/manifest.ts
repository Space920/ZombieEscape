import type { MetadataRoute } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0f0a",
    theme_color: "#39ff14",
    icons: [
      {
        src: "/assets/cs2-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

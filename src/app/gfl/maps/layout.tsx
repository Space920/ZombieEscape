import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "GFL Map Progress",
  description:
    "Track Games For Life (GFL) Zombie Escape map completion — beaten maps, remaining maps, and live progress.",
  path: "/gfl/maps",
  keywords: [
    "GFL",
    "Games For Life",
    "Zombie Escape maps",
    "GFL map list",
    "ZE map progress",
    "CS2 Zombie Escape",
  ],
});

export default function GflMapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

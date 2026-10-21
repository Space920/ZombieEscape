import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Mapeadores Map Progress",
  description:
    "Track Mapeadores EU community map completion — beaten maps, remaining maps, and live progress.",
  path: "/mapeadores/maps",
  keywords: [
    "Mapeadores",
    "Zombie Escape maps",
    "ZE map progress",
    "CS:GO Zombie Escape",
    "community map completion",
  ],
});

export default function MapeadoresMapsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

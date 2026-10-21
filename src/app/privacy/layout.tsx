import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How ZE Servers handles server query data, browser storage, and third-party services when you browse Counter-Strike Zombie Escape servers.",
  path: "/privacy",
  keywords: [
    "ZE Servers privacy",
    "Zombie Escape server browser",
    "Counter-Strike Zombie Escape",
  ],
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

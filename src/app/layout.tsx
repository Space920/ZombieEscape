import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";
import PlausibleAnalytics from "@/components/PlausibleAnalytics";
import VisitBeacon from "@/components/VisitBeacon";
import HalloweenDecor from "@/components/HalloweenDecor";
import { HALLOWEEN_BOOTSTRAP_SCRIPT } from "@/lib/halloween";
import { rootMetadata } from "@/lib/site";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="halloween-theme" strategy="beforeInteractive">
          {HALLOWEEN_BOOTSTRAP_SCRIPT}
        </Script>
        <Providers>
          <VisitBeacon />
          <HalloweenDecor />
          {children}
        </Providers>
        <PlausibleAnalytics />
      </body>
    </html>
  );
}

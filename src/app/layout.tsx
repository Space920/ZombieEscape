import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PlausibleAnalytics from "@/components/PlausibleAnalytics";
import VisitBeacon from "@/components/VisitBeacon";
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
        <Providers>
          <VisitBeacon />
          {children}
        </Providers>
        <PlausibleAnalytics />
      </body>
    </html>
  );
}

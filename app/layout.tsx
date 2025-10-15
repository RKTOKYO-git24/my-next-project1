// /home/ryotaro/dev/mnp-dw-20250821/app/layout.tsx

import "./globals.css";
import React from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ryotkim.com/"),
  title: {
    template:
      "%s | This site is currently under construction as a personal portfolio.",
    default:
      "This site is currently under construction as a personal portfolio.",
  },
  description: " <Next.js + Headless CMS + HubSpot> ",
  openGraph: {
    title: "RYOTKIM.COM",
    description:
      "It is sinking—not with a splash, but in silence, so gently that no one even notices.",
    images: ["/ogp.png"],
  },
  alternates: {
    canonical: "https://www.ryotkim.com/",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
        <Footer />
        {/* --- Analytics セクション --- */}
        <Analytics /> {/* ✅ Vercel Analytics */}
        <SpeedInsights />
        <GoogleAnalytics gaId="1SVCPQJ5D7" /> {/* ✅ GA4 */}
      </body>
    </html>
  );
}
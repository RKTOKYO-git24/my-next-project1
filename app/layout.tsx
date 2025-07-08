import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* ここにfaviconなどのlinkタグを入れる */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
      <GoogleAnalytics gaId="1SVCPQJ5D7" />
    </html>
  );
}

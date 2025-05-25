import "./globals.css";
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
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

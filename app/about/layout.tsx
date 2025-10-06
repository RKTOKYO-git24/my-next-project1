// app/about/layout.tsx
import React from "react";
import type { Metadata } from "next";
import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

export const metadata: Metadata = {
  title: "メンバー | RYOTKIM.COM",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="about-layout-wrapper w-full flex flex-col items-center overflow-visible bg-transparent">
      {/* Heroセクション */}
      <div className="w-full relative z-[1]">
        <Hero title="About" sub="Profile" />
      </div>

      {/* Sheetセクション */}
      <div className="w-full bg-white relative z-[2] -mt-[1px] rounded-t-[12px] shadow-sm">
        <Sheet>{children}</Sheet>
      </div>
    </section>
  );
}

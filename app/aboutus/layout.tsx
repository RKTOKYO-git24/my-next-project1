// /home/ryotaro/dev/mnp-dw-20250821/app/aboutus/layout.tsx

import React from "react";
import Sheet from "@/app/_components/Sheet";
import Hero from "@/app/_components/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メンバー",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero title="About Us" sub="Members" />
      <Sheet>{children}</Sheet>
    </>
  );
}

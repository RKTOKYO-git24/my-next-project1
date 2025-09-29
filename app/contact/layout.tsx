import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get in Touch",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero
        title="Get in Touch"
        sub="I’d be happy to hear from you regarding any questions, projects, or collaborations."
      />
      <Sheet>{children}</Sheet>
    </>
  );
}

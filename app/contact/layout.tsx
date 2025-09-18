import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Me",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero
        title="Contact Us."
        sub="Our team of experts would love to chat with you"
      />
      <Sheet>{children}</Sheet>
    </>
  );
}

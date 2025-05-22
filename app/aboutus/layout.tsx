import React from "react";
import Sheet from "@/app/_components/Sheet";
import Hero from "@/app/_components/Hero";

export const metadata = {
  title: "メンバー",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero title="About Us" sub="Members" />
      <Sheet>{children}</Sheet>;
    </>
  );
}

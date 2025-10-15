// app/_components/ConditionalHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Header2 from "./Header2";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isPhysna = pathname.startsWith("/physna-v3");

  return isPhysna ? <Header2 /> : <Header />;
}
// /home/ryotaro/dev/mnp-dw-20250821/app/physna-v3/search/page.tsx

"use client";

import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function MatchesPage() {
  return (
    <Suspense fallback={<div style={{ padding: "1rem" }}>Loading search...</div>}>
      <SearchClient />
    </Suspense>
  );
}

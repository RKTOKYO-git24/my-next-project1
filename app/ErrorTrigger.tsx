// /home/ryotaro/dev/mnp-dw-20250821/app/ErrorTrigger.tsx

"use client";

import { useEffect } from "react";

export default function ErrorTrigger() {
  useEffect(() => {
    throw new Error("Sentry クライアントテストエラー");
  }, []);

  return <p>エラーを発生させています...</p>;
}

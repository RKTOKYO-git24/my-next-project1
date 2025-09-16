// /home/ryotaro/dev/mnp-dw-20250821/app/global-error.tsx

"use client";

import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // Sentry に送信
  Sentry.captureException(error);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}

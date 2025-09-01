// /home/ryotaro/dev/mnp-dw-20250821/app/error.tsx

'use client';

export default function GlobalError({
  error,
}: { error: Error & { digest?: string } }) {
  console.error('GlobalError:', {
    name: error.name,
    message: error.message,
    digest: (error as any).digest,
    stack: error.stack,
  });
  return <html><body>Something went wrong.</body></html>;
}

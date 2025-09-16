// /home/ryotaro/dev/mnp-dw-20250821/app/error.tsx

'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // console.error('GlobalError:', {
  //  name: error.name,
  //  message: error.message,
  //  digest: (error as any).digest,
  //  stack: error.stack,
  //});

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#333',
      }}
    >
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}

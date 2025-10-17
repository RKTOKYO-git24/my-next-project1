"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultClient() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const key = searchParams.get("key");
    if (!key) return;

    const stored = sessionStorage.getItem(key);
    if (stored) {
      const data = JSON.parse(stored);
      setResults(Array.isArray(data.matches) ? data.matches : []);
      sessionStorage.removeItem(key);
    }
  }, [searchParams]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Results ({results.length})
      </h2>

      {results.length === 0 ? (
        <div className="text-gray-600 mt-10">
          <h3 className="text-lg font-semibold mb-2">No matching results</h3>
          <p>No results found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((m, i) => {
            const assetId = m.asset?.id;
            const thumbnailUrl = assetId
              ? `/api/physna-v3/thumbnail/${assetId}`
              : "/no-image.png";

            const rawScore = Number(m.score);
            const shown =
              rawScore <= 1 ? (rawScore * 100).toFixed(1) : rawScore.toFixed(1);
            const scoreLabel = `Score: ${shown}`;

            return (
              <div
                key={i}
                className="border rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <img
                  src={thumbnailUrl}
                  alt={m.asset?.name || "thumbnail"}
                  className="w-full h-40 object-contain mb-2 bg-gray-100"
                  onError={(e) => ((e.currentTarget.src = "/no-image.png"))}
                />
                <p className="font-medium text-sm text-gray-800 truncate">
                  {m.asset?.path || m.asset?.name || "(No name)"}
                </p>
                <p className="text-xs text-gray-500">{scoreLabel}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

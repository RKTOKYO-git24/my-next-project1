"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VisualSearchResultPage() {
  const params = useSearchParams();
  const key = params.get("key");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!key) return;
    const stored = sessionStorage.getItem(key);
    if (!stored) return;

    try {
      const data = JSON.parse(stored);
      setResults(data.matches || []);
    } catch (err) {
      console.error("Failed to parse stored result", err);
    }
  }, [key]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Visual Search Results ({results.length} matches)
      </h2>

      {loading ? (
        <p>Loading search results...</p>
      ) : results.length === 0 ? (
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
            const shown = !Number.isNaN(rawScore)
              ? rawScore <= 1
                ? (rawScore * 100).toFixed(1)
                : rawScore.toFixed(1)
              : null;

            return (
              <div
                key={i}
                className="border rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <img
                  src={thumbnailUrl}
                  alt={m.asset?.name || "thumbnail"}
                  className="w-full h-40 object-contain mb-2 bg-gray-100"
                  onError={(e) => (e.currentTarget.src = "/no-image.png")}
                />
                <p className="font-medium text-sm text-gray-800 truncate">
                  {m.asset?.path || m.asset?.name || "(No name)"}
                </p>
                {shown && (
                  <p className="text-xs text-gray-500">Score: {shown}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

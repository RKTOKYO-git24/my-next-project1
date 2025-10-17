"use client";
import { useEffect, useState } from "react";

export default function VisualSearchResultPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("visualSearchFile");
    if (stored) {
      setFileBase64(stored);
      runSearch(stored);
    }
  }, []);

  const runSearch = async (base64: string) => {
    setLoading(true);
    try {
      const blob = await fetch(base64).then((r) => r.blob());
      const formData = new FormData();
      // ルート側で 'files' に詰め替えるので、ここは 'file' 1つでOK
      formData.append("file", blob, "upload.png");

      const res = await fetch("/api/physna-v3/visual-search", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setResults(Array.isArray(data.matches) ? data.matches : []);
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

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

            // スコアは返ってくれば表示、なければ非表示
            let scoreLabel: string | null = null;
            const rawScore = Number(m.score);
            if (!Number.isNaN(rawScore)) {
              const shown =
                rawScore <= 1 ? (rawScore * 100).toFixed(1) : rawScore.toFixed(1);
              scoreLabel = `Score: ${shown}`;
            }

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
                {scoreLabel && (
                  <p className="text-xs text-gray-500">{scoreLabel}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

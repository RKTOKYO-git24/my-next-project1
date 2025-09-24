// /home/ryotaro/dev/mnp-dw-20250821/app/physna-v3/search/SearchClient.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const assetId = searchParams.get("assetId");
  const [threshold, setThreshold] = useState<number>(
    parseInt(searchParams.get("threshold") || "80", 10)
  );
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleThresholdChange = (value: number) => {
    setThreshold(value);
    if (assetId) {
      router.replace(
        `/physna-v3/search?assetId=${assetId}&threshold=${value}`,
        { scroll: false }
      );
    }
  };

  useEffect(() => {
    if (!assetId) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/physna-v3/matches/${assetId}?threshold=${threshold}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setMatches(Array.isArray(data) ? data : data.matches ?? []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("fetch matches error:", err);
          setMatches([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [assetId, threshold]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Find Matches</h1>

      <label>
        Threshold: {threshold}%
        <input
          type="range"
          min="0"
          max="100"
          value={threshold}
          onChange={(e) => handleThresholdChange(parseInt(e.target.value, 10))}
        />
      </label>

      {loading ? (
        <p>Loading matches...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {matches.length === 0 && <li>No matches found.</li>}
          {matches.map((m) => (
            <li
              key={m.asset.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                padding: "0.5rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <img
                src={`/api/physna-v3/thumbnail/${m.asset.id}`}
                alt={m.asset.path}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginRight: "1rem",
                  border: "1px solid #ccc",
                  backgroundColor: "#f9f9f9",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/100x100?text=No+Img";
                }}
              />
              <div>
                <a
                  href={`/physna-v3/detail/${m.asset.id}`}
                  style={{ fontWeight: "bold", display: "block" }}
                >
                  {m.asset.path || m.asset.id}
                </a>
                <div style={{ fontSize: "0.85em", color: "#555" }}>
                  UUID: {m.asset.id}
                </div>
                {m.matchPercentage && (
                  <div style={{ fontSize: "0.9em", marginTop: "0.3rem" }}>
                    Match: {m.matchPercentage.toFixed(1)}%
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

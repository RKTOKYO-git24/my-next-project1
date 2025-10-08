"use client";

import { useEffect, useState } from "react";

type Props = {
  folderId: string;
};

export default function AssetStatusChart({ folderId }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      if (!folderId) return;
      try {
        const res = await fetch(
          `/api/physna-v3/asset-state?folderId=${encodeURIComponent(folderId)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        console.log("✅ Asset state response:", json);
        setData(json);
      } catch (err: any) {
        console.error("❌ AssetStatusChart error:", err);
        setError(err.message);
      }
    }

    fetchStatus();
  }, [folderId]);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!data) return <p>Loading asset status...</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>📊 Asset Status</h3>
      <ul>
        <li>Total Assets: {data.stats.totalAssets}</li>
        <li>Finished: {data.stats.finished}</li>
        <li>In Progress: {data.stats.inProgress}</li>
      </ul>
    </div>
  );
}

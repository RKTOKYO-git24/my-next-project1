// /home/ryotaro/dev/mnp-dw-20250821/app/physna-v3/page.tsx

"use client";

import { useEffect, useState } from "react";

export default function PhysnaAssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch("/api/physna-v3/assets");
        if (!res.ok) throw new Error("Failed to fetch assets");
        const data = await res.json();
        setAssets(data.assets || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Physna v3 Assets</h1>
      {assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Path</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>State</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {asset.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {asset.path}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {asset.type}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {asset.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

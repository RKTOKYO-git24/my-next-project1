// /home/ryotaro/dev/mnp-dw-20250821/app/physna-v3/detail/[assetId]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PhysnaAssetDetailPage() {
  const params = useParams();
  const assetId = (params as { assetId?: string })?.assetId; // 👈 型を安全に取得
  const [asset, setAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assetId) return;
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/physna-v3/assets/${assetId}`);
        if (!res.ok) throw new Error("Failed to fetch asset");
        const data = await res.json();
        setAsset(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [assetId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!asset) return <p className="p-6">Asset not found.</p>;

  return (
    <main className="p-6 space-y-4">
      {/* サムネイル */}
      <img
        src={`/api/physna-v3/thumbnail/${assetId}`} // 👈 asset.id ではなく assetId を直指定
        alt={asset.name || asset.path}
        className="w-full h-60 object-contain bg-gray-100"
      />

      <h1 className="text-lg font-bold">{asset.name || asset.path}</h1>
      <p className="text-sm text-gray-600">UUID: {asset.id}</p>
      <p className="text-sm text-gray-600">状態: {asset.state}</p>

      <button
        onClick={() => alert(`matches for ${asset.id}`)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        =matches=
      </button>

      <div className="text-sm text-gray-600">
        {asset.metadata && Object.keys(asset.metadata).length > 0 ? (
          <pre>{JSON.stringify(asset.metadata, null, 2)}</pre>
        ) : (
          <p>No metadata</p>
        )}
      </div>

      <a
        href={`/api/physna-v3/assets/${asset.id}/file`}
        className="inline-block bg-green-500 text-white px-4 py-2 rounded"
      >
        Download File
      </a>
    </main>
  );
}

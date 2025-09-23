"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PhysnaAssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/physna-v3/assets?page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch assets");
        const data = await res.json();

        // Physna API のレスポンスが { assets: [], total: number } の形式なら total を見て判定する
        setAssets(data.assets || []);
        setHasMore((data.assets || []).length === 20); // 20件埋まっていれば「次へ」がある
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [page]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Physna v3 Assets</h1>

      {assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <div className="grid gap-4">
          {assets.map((asset) => {
            const detailUrl = `/physna-v3/detail/${asset.id}`;

            return (
              <div
                key={asset.id}
                className="border rounded-lg p-3 shadow-sm bg-white flex flex-col"
              >
                {/* サムネイル */}
                <Link href={detailUrl}>
                  <img
                    src={`/api/physna-v3/thumbnail/${asset.id}`}
                    alt={asset.name || asset.path.split("/").pop()}
                    className="w-full h-40 object-contain mb-2 bg-gray-100"
                  />
                </Link>

                {/* ファイル名 */}
                <Link href={detailUrl} className="font-medium break-words mb-1">
                  {asset.name || asset.path.split("/").pop()}
                </Link>

                {/* ASM / State / Metadata */}
                <div className="text-sm text-gray-600 mb-2">
                  {asset.isAssembly && <span className="mr-2">🔧 ASM</span>}
                  状態: {asset.state}
                  <br />
                  {asset.metadata && (
                    <span>Meta: {JSON.stringify(asset.metadata)}</span>
                  )}
                </div>

                {/* matchesボタン */}
                <button
                  onClick={() => alert(`matches for ${asset.id}`)}
                  className="mt-auto bg-blue-500 text-white py-1 rounded"
                >
                  matches
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ページネーション */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← 前へ
        </button>

        <span className="px-4 py-2">Page {page}</span>

        <button
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          次へ →
        </button>
      </div>
    </main>
  );
}

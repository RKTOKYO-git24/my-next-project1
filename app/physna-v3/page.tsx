"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type GlobalAssetStatus = {
  total: number;
  indexing: number;
  finished: number;
  failed: number;
  unsupported: number;
  "no-3d-data": number;
  other: number;
};

export default function PhysnaBrowserPage() {
  const [contents, setContents] = useState<any[]>([]);
  const [globalStatus, setGlobalStatus] = useState<GlobalAssetStatus>({
    total: 0,
    indexing: 0,
    finished: 0,
    failed: 0,
    unsupported: 0,
    "no-3d-data": 0,
    other: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ✅ フォルダ・アセット一覧取得（既存）
        const res = await fetch(`/api/physna-v3/assets?page=${page}&perPage=20`);
        if (!res.ok) throw new Error("Failed to fetch contents");
        const data = await res.json();
        setContents(data.contents || []);
        setHasMore((data.pageData?.endIndex || 0) < (data.pageData?.total || 0));

        // ✅ テナント全体のAsset Statusをフォルダ指定なしで取得
        const statusRes = await fetch(`/api/physna-v3/asset-state`);
        if (!statusRes.ok) throw new Error("Failed to fetch global asset-state");
        const sdata = await statusRes.json();

        setGlobalStatus({
          total:
            (sdata.indexing || 0) +
            (sdata.finished || 0) +
            (sdata.failed || 0) +
            (sdata.unsupported || 0) +
            (sdata["no-3d-data"] || 0),
          indexing: sdata.indexing || 0,
          finished: sdata.finished || 0,
          failed: sdata.failed || 0,
          unsupported: sdata.unsupported || 0,
          "no-3d-data": sdata["no-3d-data"] || 0,
          other: 0,
        });
      } catch (err) {
        console.error("❌ fetchData error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  if (loading) return <p className="p-6">Loading...</p>;

  const folders = contents.filter((c) => c.contentType === "folder");
  const assets = contents.filter((c) => c.contentType === "asset");

  const percent = (v: number) =>
    globalStatus.total ? Math.round((v / globalStatus.total) * 100) : 0;

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-xl font-bold mb-4">SOLIZE 3D Search Demo</h1>

      {/* 📊 Tenant全体ステータス */}
      <section className="bg-gray-50 p-4 rounded-lg border shadow-sm">
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <span role="img" aria-label="chart">
            📊
          </span>
          Tenant-wide Asset Status
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-green-700">{globalStatus.finished}</p>
            <p className="text-xs text-gray-600">Finished</p>
            <p className="text-[10px] text-gray-500">{percent(globalStatus.finished)}%</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-700">{globalStatus.indexing}</p>
            <p className="text-xs text-gray-600">Indexing</p>
            <p className="text-[10px] text-gray-500">{percent(globalStatus.indexing)}%</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-700">{globalStatus.failed}</p>
            <p className="text-xs text-gray-600">Failed</p>
            <p className="text-[10px] text-gray-500">{percent(globalStatus.failed)}%</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-700">{globalStatus.unsupported}</p>
            <p className="text-xs text-gray-600">Unsupported</p>
            <p className="text-[10px] text-gray-500">{percent(globalStatus.unsupported)}%</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">
              {globalStatus["no-3d-data"]}
            </p>
            <p className="text-xs text-gray-600">No 3D Data</p>
            <p className="text-[10px] text-gray-500">{percent(globalStatus["no-3d-data"])}%</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-700">{globalStatus.total}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
        </div>

        {/* 小さめプログレスバー */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-green-500 transition-all"
            style={{ width: `${percent(globalStatus.finished)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {percent(globalStatus.finished)}% Finished
        </p>
      </section>

      {/* 📂 Folders */}
      <section>
        <h2 className="text-lg font-semibold mb-2">📂 Folders</h2>
        {folders.length === 0 ? (
          <p>No folders found.</p>
        ) : (
          <ul className="grid gap-2">
            {folders.map((folder) => (
              <li
                key={folder.id}
                className="border rounded-lg p-3 shadow-sm bg-white flex justify-between items-center hover:bg-gray-50"
              >
                <Link
                  href={`/physna-v3/folder/${folder.id}`}
                  className="font-medium text-blue-700 hover:underline"
                >
                  {folder.name}
                </Link>
                <span className="text-sm text-gray-600">
                  {folder.assetsCount} files / {folder.foldersCount} folders
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 📄 Assets */}
      <section>
        <h2 className="text-lg font-semibold mb-2">📄 Assets</h2>
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
                  <Link href={detailUrl}>
                    <img
                      src={`/api/physna-v3/thumbnail/${asset.id}`}
                      alt={asset.name || asset.path?.split("/").pop()}
                      className="w-full h-36 object-contain mb-2 bg-gray-100"
                    />
                  </Link>
                  <Link
                    href={detailUrl}
                    className="font-medium break-words mb-1"
                  >
                    {asset.name || asset.path?.split("/").pop()}
                  </Link>
                  <div className="text-sm text-gray-600">
                    {asset.isAssembly && <span className="mr-2">🔧 ASM</span>}
                    状態: {asset.state}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 🔁 Pagination */}
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
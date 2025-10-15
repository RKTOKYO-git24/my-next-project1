"use client";

import { useEffect, useState } from "react";

export default function PhysnaIdReportPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(100);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/physna-v3/all-assets?page=${page}&perPage=${perPage}`);
        if (!res.ok) throw new Error("Failed to fetch paginated assets");
        const data = await res.json();
        setAssets(data.assets || []);
        setHasMore((data.pageData?.endIndex || 0) < (data.pageData?.total || 0));
      } catch (err) {
        console.error("❌ fetchPage error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [page, perPage]);

  /** ✅ CSV ダウンロード処理 */
  const handleDownloadCSV = () => {
    if (assets.length === 0) return alert("データがありません");

    const headers = ["Folder Path", "Asset Name", "Asset ID", "State"];
    const rows = assets.map((a) => [
      `"${a.folderPath}"`,
      `"${a.assetName}"`,
      `"${a.id}"`,
      `"${a.state}"`,
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const now = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `physna_id_report_page${page}_${now}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6 space-y-4">
      {/* 🔁 ページネーション（上部） */}
      <div className="flex justify-between items-center mt-16 mb-4">
        <div className="flex items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            ← 前へ
          </button>
          <span className="text-sm text-gray-700 font-medium">
            Page {page}
          </span>
          <button
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            次へ →
          </button>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🆔 Physna Asset ID Report
          </h1>
          <button
            onClick={handleDownloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ⬇ CSVダウンロード
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        全フォルダ・アセットのIDと状態をページ単位で一覧表示
      </p>

      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full border-collapse text-sm font-sans">
          <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="border px-3 py-2 text-left">フォルダパス</th>
              <th className="border px-3 py-2 text-left">アセット名</th>
              <th className="border px-3 py-2 text-left">Asset ID</th>
              <th className="border px-3 py-2 text-left">状態</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => (
              <tr
                key={a.id}
                className={`${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="border px-3 py-1.5 font-mono text-gray-700">
                  {a.folderPath}
                </td>
                <td className="border px-3 py-1.5 font-mono text-gray-700">
                  {a.assetName}
                </td>
                <td className="border px-3 py-1.5 font-mono text-gray-700">
                  {a.id}
                </td>
                <td
                  className={`border px-3 py-1.5 font-semibold ${
                    a.state === "finished"
                      ? "text-green-700"
                      : a.state === "indexing"
                      ? "text-blue-600"
                      : "text-red-700"
                  }`}
                >
                  {a.state}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

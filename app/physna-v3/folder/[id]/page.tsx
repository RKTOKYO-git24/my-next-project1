"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// 🧭 パンくずリスト
function Breadcrumbs({ folderId }: { folderId: string }) {
  const [crumbs, setCrumbs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      let currentId: string | null = folderId;
      const stack: { id: string; name: string }[] = [];

      try {
        while (currentId) {
          const res = await fetch(`/api/physna-v3/folders/${currentId}`);
          if (!res.ok) break;
          const data = await res.json();

          const folderName =
            data.name || data.folderName || data.label || "(unnamed folder)";

          stack.unshift({ id: data.id, name: folderName });
          currentId = data.parentFolderId || null;
        }
      } catch (e) {
        console.error("Breadcrumb fetch error:", e);
      }

      setCrumbs([{ id: "root", name: "Home" }, ...stack]);
    };

    fetchBreadcrumbs();
  }, [folderId]);

  return (
    <nav className="mb-4 text-sm text-gray-700">
      {crumbs.map((c, i) => (
        <span key={`${c.id}-${i}`}>
          {i > 0 && " / "}
          {c.id === "root" ? (
            <Link href="/physna-v3" className="text-blue-600 hover:underline">
              {c.name}
            </Link>
          ) : (
            <Link
              href={`/physna-v3/folder/${c.id}`}
              className="text-blue-600 hover:underline"
            >
              {c.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

// ✅ ステータスタイプ定義
type AssetStatus = {
  total: number;
  indexing: number;
  finished: number;
  failed: number;
  unsupported: number;
  "no-3d-data": number;
  other: number;
};

export default function FolderContentsPage() {
  const params = useParams<{ id: string }>();
  const folderId = params.id;

  const [folders, setFolders] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<AssetStatus>({
    total: 0,
    indexing: 0,
    finished: 0,
    failed: 0,
    unsupported: 0,
    "no-3d-data": 0,
    other: 0,
  });

  const [folderName, setFolderName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ✅ フォルダ詳細を取得（folderName取得用）
        const folderRes = await fetch(`/api/physna-v3/folders/${folderId}`);
        const folderData = await folderRes.json();
        const name =
          folderData.name ||
          folderData.folderName ||
          folderData.displayName ||
          folderData.label ||
          "(unknown)";
        setFolderName(name);

        // ✅ フォルダの中身を取得（サブフォルダ＋アセット）
        const res = await fetch(
          `/api/physna-v3/folders/${folderId}/contents?page=${page}`
        );
        if (!res.ok) throw new Error("Failed to fetch folder contents");
        const data = await res.json();

        const folderItems = (data.contents || []).filter(
          (c: any) => c.contentType === "folder"
        );
        const assetItems = (data.contents || []).filter(
          (c: any) => c.contentType === "asset"
        );

        setFolders(folderItems);
        setAssets(assetItems);
        setHasMore(page < (data.pageData?.lastPage || 1));

        // 🛠 修正ポイント①:
        // フォルダ全体のAsset StatusをPhysnaのassets/state APIから取得する
        const statusRes = await fetch(
          `/api/physna-v3/asset-state?folderName=${encodeURIComponent(name)}`
        );
        if (statusRes.ok) {
          const sdata = await statusRes.json();
          setStatus({
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
        } else {
          console.warn("Failed to fetch asset-state");
        }
      } catch (err) {
        console.error("❌ fetchData error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderId, page]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6">
      <Breadcrumbs folderId={folderId} />

      <h1 className="text-xl font-bold mb-4">Folder Contents</h1>

      {/* 📊 Asset Status */}
      {/* 🛠 修正ポイント②: ここで全アセットの正しい統計を表示 */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📊 Asset Status</h2>
        <div className="p-3 bg-gray-50 border rounded-lg shadow-sm">
          <p>Total Assets: {status.total}</p>
          <ul className="mt-2 list-disc ml-5 text-sm space-y-1">
            <li className="text-yellow-700">🟡 Indexing: {status.indexing}</li>
            <li className="text-green-700">🟢 Finished: {status.finished}</li>
            <li className="text-red-700">🔴 Failed: {status.failed}</li>
            <li className="text-gray-700">⚪ Unsupported: {status.unsupported}</li>
            <li className="text-gray-500">
              ⚫ No-3d-data: {status["no-3d-data"]}
            </li>
            <li className="text-blue-700">🔵 Other: {status.other}</li>
          </ul>
        </div>
      </section>

      {/* 📂 フォルダ一覧 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">📂 Subfolders</h2>
        {folders.length === 0 ? (
          <p>No subfolders found.</p>
        ) : (
          <ul className="grid gap-2">
            {folders.map((folder) => (
              <li
                key={folder.id}
                className="border rounded-lg p-3 shadow-sm bg-white flex justify-between"
              >
                <Link
                  href={`/physna-v3/folder/${folder.id}`}
                  className="font-medium"
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

      {/* 📄 アセット一覧 */}
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
                      className="w-full h-40 object-contain mb-2 bg-gray-100"
                    />
                  </Link>

                  <Link
                    href={detailUrl}
                    className="font-medium break-words mb-1"
                  >
                    {asset.name || asset.path?.split("/").pop()}
                  </Link>

                  <div className="text-sm text-gray-600 mb-2">
                    {asset.isAssembly && <span className="mr-2">🔧 ASM</span>}
                    STATUS: {asset.state}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 🔁 ページネーション */}
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

// /home/ryotaro/dev/mnp-dw-20250821/app/physna-v3/folder/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// パンくずリスト
function Breadcrumbs({ folderId }: { folderId: string }) {
  const [crumbs, setCrumbs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      let currentId: string | null = folderId;
      const stack: any[] = [];

      try {
        while (currentId) {
          const res = await fetch(`/api/physna-v3/folders/${currentId}`);
          if (!res.ok) break;
          const data = await res.json();
          stack.unshift(data); // 先頭に追加
          currentId = data.parentFolderId || null;
        }
      } catch (e) {
        console.error("Breadcrumb fetch error:", e);
      }

      // Home を先頭に追加
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

export default function FolderContentsPage() {
  const params = useParams<{ id: string }>();
  const folderId = params.id;

  const [folders, setFolders] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [folderId, page]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6">
      {/* パンくずリスト */}
      <Breadcrumbs folderId={folderId} />

      <h1 className="text-xl font-bold mb-4">Folder Contents</h1>

      {/* フォルダ一覧 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">📂 Folders</h2>
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

      {/* アセット一覧 */}
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
                    状態: {asset.state}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

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

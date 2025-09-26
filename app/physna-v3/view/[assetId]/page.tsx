"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PhysnaAssetViewPage() {
  const params = useParams();
  const assetId = (params as { assetId?: string })?.assetId;
  const [viewerToken, setViewerToken] = useState<string | null>(null);
  const router = useRouter();

  const tenantId = "133d8364-5fdf-478b-95d8-5039f254bf55"; // 実環境に合わせて固定 or APIから取得

  useEffect(() => {
  const fetchToken = async () => {
    const res = await fetch("/api/physna-v3/viewer-token", { method: "POST" });
    const data = await res.json();
    setViewerToken(data.token);
  };
  fetchToken();
}, []);


  if (!viewerToken) return <p className="p-6">Loading viewer...</p>;

  const viewerUrl = `https://app-api.physna.com/v3/tenants/${tenantId}/viewer/asset?assetId=${assetId}&token=${viewerToken}`;

  return (
    <main className="p-6 space-y-4">
      <button
        onClick={() => router.back()}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        ← 戻る
      </button>

      <h1 className="text-lg font-bold">3D Viewer</h1>

      <iframe
        src={viewerUrl}
        className="w-full h-[600px] border rounded"
        allowFullScreen
      />
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PhysnaItem } from "@/types/physna";

export default function PhysnaPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PhysnaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"search" | "results">("search");

  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/physna/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setResults(data.items || []);
      setView("results");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (modelId: string) => {
    router.push(`/physna/${modelId}/matches`);
  };

  if (view === "search") {
    return (
      <div className="p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Physna Search</h1>
        <p className="text-gray-600 mb-6">
          This is a prototype interface for internal evaluation and feedback.
        </p>
        <input
          className="border p-2 mr-2 w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        {loading && <p className="mt-4 text-gray-500">Loading...</p>}
        {error && <p className="mt-4 text-red-500">Error: {error}</p>}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <button
        onClick={() => setView("search")}
        className="text-green-700 underline mb-4"
      >
        ← Back to search
      </button>

      <h2 className="text-xl font-bold mb-4">Search Results</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100 text-left">
              <th className="px-4 py-2">Thumbnail</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">File Name</th>
              <th className="px-4 py-2">File Type</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Assembly</th>
              <th className="px-4 py-2">Units</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Surface Area</th>
              <th className="px-4 py-2">Volume</th>
              <th className="px-4 py-2">Max Length</th>
              <th className="px-4 py-2">Folder ID</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={item.id || index} className="border-b text-sm align-top">
                <td className="px-4 py-2">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt="thumbnail"
                      width={80}
                      height={80}
                      className="rounded opacity-70"
                      title="Viewer not yet available"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-2">{item.name || "—"}</td>
                <td className="px-4 py-2">{item.fileName || "—"}</td>
                <td className="px-4 py-2">{item.fileType || "—"}</td>
                <td className="px-4 py-2">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US")
                  : "—"}
                </td>
                <td className="px-4 py-2">{item.isAssembly ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{item.units || "—"}</td>
                <td className="px-4 py-2">{item.state || "—"}</td>
                <td className="px-4 py-2">
                  {item.geometry?.surfaceArea?.toFixed(0).toLocaleString() || "—"}mm²
                </td>
                <td className="px-4 py-2">
                  {item.geometry?.modelVolume?.toFixed(0).toLocaleString() || "—"}mm³
                </td>
                <td className="px-4 py-2">
                  {item.geometry?.obbMaxLength?.toFixed(0).toLocaleString() || "—"}mm
                </td>
                <td className="px-4 py-2">{item.folderId ?? "—"}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-xs text-blue-600 no-underline hover:underline"
                    onClick={() => handleMatchClick(item.id)}
                  >
                    matches
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

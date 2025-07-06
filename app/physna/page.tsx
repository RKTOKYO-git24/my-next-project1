"use client";

import { useState } from "react";
import Image from "next/image";
import { PhysnaItem } from "@/types/physna";

export default function PhysnaPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PhysnaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"search" | "results">("search");

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
      console.log("Fetched data", data);

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

  if (view === "search") {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Physna Search</h1>
          <p className="text-gray-600">This is a prototype interface for internal evaluation and feedback.</p>
        </div>
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

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((item, index) => {
          const id = item?.id?.toString?.() ?? `no-id-${index}`;

          return (
            <li key={id} className="border rounded-xl shadow p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                {item.name ?? "No name"}
              </h3>

              {item.thumbnailUrl && (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.name ?? "image"}
                  width={200}
                  height={200}
                  className="rounded mb-4"
                />
              )}

              {/* Model File Data */}
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">File:</span> {item.fileName ?? "—"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Type:</span> {item.fileType ?? "—"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Created:</span>{" "}
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>

              {/* Model Types */}
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Assembly:</span>{" "}
                  {item.isAssembly ? "Yes" : "No"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Units:</span> {item.units ?? "—"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">State:</span> {item.state ?? "—"}
                </p>
              </div>

              {/* Geometrical Data */}
              <div className="mb-2">
                {item.geometry?.surfaceArea && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Surface Area:</span>{" "}
                    {item.geometry.surfaceArea.toFixed(2)} mm²
                  </p>
                )}
                {item.geometry?.modelVolume && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Volume:</span>{" "}
                    {item.geometry.modelVolume.toFixed(2)} mm³
                  </p>
                )}
              </div>

              {/* Folder */}
              {item.folder?.name && (
                <p className="text-sm text-gray-500 italic">
                  Folder: {item.folder.name}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// app/physna/page.tsx
"use client";

import { useState } from "react";

export default function PhysnaPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"search" | "results">("search");

  console.log("Current view:", view);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (view === "search") {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Physna Search</h1>
          <p className="text-gray-600">これはトライアル画面です。</p>
        </div>
        <input
          className="border p-2 mr-2 w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models..."
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
      <ul className="space-y-4">
        {results.map((item) => (
          <li key={item.id} className="border p-4 rounded shadow">
            <p className="font-semibold text-gray-800">{item.name}</p>
            {item.thumbnailUrl && (
              <img
                src={item.thumbnailUrl}
                alt={item.name}
                className="mt-2 w-full max-w-sm rounded"
              />
            )}
            {item.folder && (
              <p className="text-sm text-gray-600 mt-1">
                Folder: {item.folder.name}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

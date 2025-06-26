// app/physna/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

// 1. 型定義
interface PhysnaItem {
  id: string;
  name: string;
  thumbnailUrl?: string;
  folder?: {
    name: string;
  };
}

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

 <ul className="space-y-4">
  {results.map((item, index) => {
    const id = item?.id?.toString?.() ?? `no-id-${index}`;
  
     console.log("thumbnailUrl:", item.thumbnailUrl);
  
    return (
      <li key={id} className="border p-4 rounded shadow">
        <p className="font-semibold text-gray-800">{item.name ?? "No name"}</p>

        {item.thumbnailUrl && (
          <Image
            src={item.thumbnailUrl}
            alt={item.name ?? "image"}
            width={200}
            height={200}
            className="mt-2 w-full max-w-sm rounded"
          />
        )}
        {item.folder?.name && (
          <p className="text-sm text-gray-600 mt-1">
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

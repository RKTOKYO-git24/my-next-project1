// /app/physna/[id]/matches/page.tsx
import { PhysnaMatch, PhysnaModel } from "@/types/physna";
import Link from "next/link";

interface MatchPageProps {
  params: { id: string };
}

interface RawPhysnaMatch {
  matchedModel: PhysnaModel;
  matchPercentage: number;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = params;

  let matches: PhysnaMatch[] = [];
  let errorMessage: string | null = null;

  try {
    // ✅ 相対URLに変更
    const res = await fetch(
      `/api/legacy/physna-v2/models/${id}/matches`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API request failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    matches = (data.matches ?? []).map((match: RawPhysnaMatch) => ({
      matchPercentage: match.matchPercentage,
      matchedModel: {
        ...match.matchedModel,
        thumbnailUrl: match.matchedModel.thumbnail ?? "",
      },
    }));
  } catch (err: any) {
    errorMessage = err.message ?? "Unknown error occurred.";
  }

  return (
    <div className="p-4">
      <Link href="/physna" className="text-green-700 underline">
        ← Back to search
      </Link>
      <h1 className="text-xl font-bold mb-6">
        Matches for model: {id}
      </h1>

      {errorMessage ? (
        <p className="text-red-600">Failed to load matches: {errorMessage}</p>
      ) : matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <div className="overflow-x-auto">
          {/* 表の描画部分はそのまま */}
        </div>
      )}
    </div>
  );
}

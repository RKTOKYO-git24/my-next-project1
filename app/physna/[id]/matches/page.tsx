import { PhysnaMatch, PhysnaItem, PhysnaModel } from "@/types/physna";
import Link from "next/link"; // サーバーでもOK（Next.js 13以降）

type MatchPageProps = {
  params: {
    id: string;
  };
};

interface RawPhysnaMatch {
  matchedModel: PhysnaModel;
  matchPercentage: number;
}

export default async function MatchPage({ params }: MatchPageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/physna/models/${params.id}/matches`,
    { cache: "no-store" }
  );
  const data = await res.json();

  const matches: PhysnaMatch[] = (data.matches ?? []).map((match: RawPhysnaMatch) => ({
    matchPercentage: match.matchPercentage,
    matchedModel: {
      ...match.matchedModel,
      thumbnailUrl: match.matchedModel.thumbnail ?? "", // PhysnaModelにはある
    },
  }));

  return (
    <div className="p-4">
      <Link href="/physna" className="text-green-700 underline">
    ← Back to search
    </Link>
      <h1 className="text-xl font-bold mb-6">Matches for model: {params.id}</h1>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Thumbnail</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">File Name</th>
                <th className="p-2 border">File Type</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Is Assembly</th>
                <th className="p-2 border">Units</th>
                <th className="p-2 border">Surface Area</th>
                <th className="p-2 border">Model Volume</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">matches</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match, index) => {
                const model = match.matchedModel;
                return (
                  <tr key={index} className="border-t">
                    <td className="p-2 border">
                      {model.thumbnailUrl ? (
                        <img
                          src={model.thumbnailUrl}
                          alt="Thumbnail"
                          className="w-16 h-16 object-contain"
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-black">{model.name ?? "N/A"}</td>
                    <td className="px-4 py-2 text-black">{model.fileName ?? "N/A"}</td>
                    <td className="px-4 py-2">{model.fileType ?? "N/A"}</td>
                    <td className="p-2 border">
                    {model.createdAt
                      ? new Date(model.createdAt).toLocaleDateString()
                      : "—"}
                    </td>
                    <td className="px-4 py-2">{model.isAssembly ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{model.units ?? "N/A"}</td>
                    <td className="px-4 py-2">
                      {model.geometry?.surfaceArea?.toFixed(0).toLocaleString() ?? "N/A"}mm²
                    </td>
                    <td className="px-4 py-2">
                      {model.geometry?.modelVolume?.toFixed(0).toLocaleString() ?? "N/A"}mm³
                    </td>
                    <td className="px-4 py-2">
                      {(match.matchPercentage * 100).toFixed(0)}%
                    </td>
                    <td className="px-4 py-2">
                      {model.id ? (
                        <a
                          href={`/physna/${model.id}/matches`}
                          className="text-blue-600 hover:underline"
                        >
                          matches
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

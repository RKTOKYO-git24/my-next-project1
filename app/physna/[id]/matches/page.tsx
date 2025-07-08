type MatchPageProps = {
  params: {
    id: string;
  };
};

type MatchResult = {
  matchedModel: {
    name: string;
    thumbnailUrl?: string;
  };
  matchPercentage: number;
};

export default async function MatchPage({ params }: MatchPageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/physna/models/${params.id}/matches`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const matches = data.matches ?? [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Matches for model: {params.id}</h1>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((match: MatchResult, index: number) => (
            <li key={index} className="border rounded p-4 shadow">
              <div className="flex items-center space-x-4">
                {match.matchedModel?.thumbnailUrl && (
                  <img
                    src={match.matchedModel.thumbnailUrl}
                    alt="Thumbnail"
                    className="w-24 h-24 object-contain"
                  />
                )}
                <div>
                  <div>
                    <strong>Name:</strong> {match.matchedModel?.name ?? "N/A"}
                  </div>
                  <div>
                    <strong>Score:</strong>{" "}
                    {typeof match.matchPercentage === "number"
                      ? (match.matchPercentage * 100).toFixed(2) + "%"
                      : "N/A"}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

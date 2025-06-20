import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing or invalid query" }, { status: 400 });
    }

    const token = await getAccessToken();

    const url = new URL(`${process.env.PHYSNA_API_BASE}/models`);
    url.searchParams.set("search", query); // ← ✅ここが重要！
  //  console.log("🔍 Final URL to fetch:", url.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Physna ${res.status}: ${err}` }, { status: res.status });
    }

    const data = await res.json();
  //  console.log("🧾 Physna API raw response:", data);
  
    return NextResponse.json({ items: data.models || [] });

  } catch (err: any) {
    return NextResponse.json({ error: `Unexpected error: ${err.message}` }, { status: 500 });
  }
}

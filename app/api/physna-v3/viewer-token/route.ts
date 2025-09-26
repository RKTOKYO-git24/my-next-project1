import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/physna-v3/auth";

export async function POST() {
  try {
    // Cognito から access_token を取得
    const accessToken = await getAccessToken();

    // Physna Viewer Token をリクエスト
    const response = await fetch("https://app-api.physna.com/v3/viewer/token", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        {
          error: "Failed to fetch viewer token",
          details: text,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data); // { token: "..." }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

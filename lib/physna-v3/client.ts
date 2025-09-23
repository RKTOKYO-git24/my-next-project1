// lib/physna-v3/client.ts
import { getAccessToken } from "./auth";

export async function physnaFetch(path: string, options: RequestInit = {}): Promise<any> {
  const token = await getAccessToken();
  const apiBase = process.env.PHYSNA_V3_API_BASE!;
  const url = `${apiBase}${path}`;
  console.log("Physna API Request:", url);

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  console.log("Physna API Response:", res.status, text);

  if (!res.ok) {
    throw new Error(`Physna API error ${res.status}: ${text}`);
  }

  return JSON.parse(text);
}

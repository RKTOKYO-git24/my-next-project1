// lib/physna-v3/auth.ts
let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const basicAuth = Buffer.from(
    `${process.env.PHYSNA_V3_CLIENT_ID}:${process.env.PHYSNA_V3_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(process.env.PHYSNA_V3_TOKEN_ENDPOINT!, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  cachedToken = json.access_token;
  tokenExpiry = now + json.expires_in * 1000 - 10_000;

  console.log("New token acquired, expires in", json.expires_in, "seconds");
  return cachedToken;
}

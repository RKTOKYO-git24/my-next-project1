let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  // Basic認証用のヘッダーを先に作成
  const basicAuth = Buffer.from(
    `${process.env.PHYSNA_V2_CLIENT_ID}:${process.env.PHYSNA_V2_CLIENT_SECRET}`
  ).toString("base64");

  // 🔽 ログ出力を basicAuth 定義の後に記述
  //console.log("🔧 Token endpoint:", process.env.PHYSNA_V2_TOKEN_ENDPOINT);
  //console.log("🔧 Client ID:", process.env.PHYSNA_V2_CLIENT_ID);
  //console.log("🔧 Scope:", process.env.PHYSNA_V2_SCOPES);
  //console.log("🔧 Body:", new URLSearchParams({
  //  grant_type: "client_credentials",
  //  client_id: process.env.PHYSNA_V2_CLIENT_ID!,
  //  client_secret: process.env.PHYSNA_V2_CLIENT_SECRET!,
  //  scope: process.env.PHYSNA_V2_SCOPES!,
  //}).toString());

  const res = await fetch(process.env.PHYSNA_V2_TOKEN_ENDPOINT!, {
  method: "POST",
  headers: {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "client_credentials",
    scope: process.env.PHYSNA_V2_SCOPES!,
  }),
});

const text = await res.text();
// console.log("🔑 Raw token response:", text);
// console.log("🔍 Raw response text:", text); // 👈 これ追加
const contentType = res.headers.get("content-type");

if (!res.ok || !contentType || !contentType.includes("application/json")) {
  throw new Error(`❌ Failed to obtain access token (non-JSON): ${res.status}\n${text}`);
}

let json;
try {
  json = JSON.parse(text);
} catch (err) {
  throw new Error(`❌ JSON parse failed: ${err}\nRaw response: ${text}`);
}

cachedToken = json.access_token;
tokenExpiry = now + (json.expires_in * 1000) - 10_000; // 10秒前に再取得

return cachedToken!; // ✅ ここで全経路カバー
}

// /app/_libs/payload.ts

import type { NextRequest } from "next/server";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v.replace(/\/$/, "");
}

function getApiBase() {
  const publicApi = process.env.NEXT_PUBLIC_PAYLOAD_API?.replace(/\/$/, "");
  const serverApi = process.env.NEXT_SERVER_PAYLOAD_API?.replace(/\/$/, "");
  // サーバーは内部URL必須、クライアントは public
  if (typeof window === "undefined") return serverApi || publicApi || null;
  return publicApi || null;
}

function ensureAbsoluteUrlOnServer(pathOrUrl: string): string {
  if (typeof window !== "undefined") return pathOrUrl; // クライアントはそのまま
  try {
    // すでに絶対URLならそのまま
    new URL(pathOrUrl);
    return pathOrUrl;
  } catch {
    // 相対URLならベース必須
    const base = getApiBase();
    if (!base) {
      throw new Error(
        `Payload API base URL is not configured on server (NEXT_SERVER_PAYLOAD_API or NEXT_PUBLIC_PAYLOAD_API).`
      );
    }
    return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  }
}

function imageUrl(file: any | undefined): string | undefined {
  if (!file) return;
  if (file.url) return file.url;
  if (file.filename) {
    const base = getApiBase();
    // base がない場合は undefined 返す（UI 側でフォールバック）
    return base ? `${base.replace(/\/api$/, "")}/media/${file.filename}` : undefined;
  }
}

// ===== Types =====
export type News = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail?: {
    url?: string;
    alt: string;
    width?: number;
    height?: number;
  };
  publishedAt: string | null;
  revisedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  // Payload 側の構造に合わせて適宜調整
  content: any;
  category: any;
  status: string;
};

// ===== Mappers =====
function mapNewsDoc(d: any): News {
  const tn = d?.thumbnail;
  return {
    id: d.id,
    title: d.title,
    slug: d.slug,
    description: d.excerpt ?? '',
    thumbnail: tn
      ? {
          url: imageUrl(tn),
          alt: tn.alt ?? '',
          width: tn.width,
          height: tn.height,
        }
      : undefined,
    publishedAt: d.publishedDate ?? d.createdAt ?? d.updatedAt ?? null,
    revisedAt: d.updatedAt ?? null,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
    content: d.content,
    category: d.category,
    status: d.status,
  };
}

// ===== APIs =====
export async function getNewsList(params: {
  limit: number;
  page?: number;
  q?: string;
  category?: string;
}): Promise<{ contents: News[]; totalCount: number }> {
  const { limit, page = 1, q, category } = params;
  const base = getApiBase();

  const sp = new URLSearchParams();
  sp.set('limit', String(limit));
  sp.set('page', String(page));
  sp.set('depth', '1');
  if (q) sp.set('where[title][contains]', q);
  if (category) sp.set('where[category][equals]', category);

  const url = `${base}/news?${sp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    // デバッグしやすいように URL を含める
    throw new Error(`Failed to fetch news list: ${res.status} (${url})`);
  }

  const data = await res.json();
  return {
    contents: (data?.docs ?? []).map(mapNewsDoc),
    totalCount: data?.totalDocs ?? data?.total ?? 0,
  };
}

export async function getNewsDetail(slug: string): Promise<News | null> {
  const base = getApiBase();

  const sp = new URLSearchParams();
  sp.set('where[slug][equals]', slug);
  sp.set('depth', '1');

  const url = `${base}/news?${sp.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch news detail: ${res.status} (${url})`);
  }

  const data = await res.json();
  const doc = (data?.docs ?? [])[0];
  return doc ? mapNewsDoc(doc) : null;
}

// /home/ryotaro/dev/mnp-dw-20250821/app/news/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail } from "lib/payload";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";
import { normalizeError } from "lib/utils";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// ✅ props.params を Promise として受け取る
type Props = { params: Promise<{ slug: string }> };

// 404 は通常フロー、その他はログを残す
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params; // 👈 await で展開
    const data = await getNewsDetail(slug);

    if (!data) {
      return { title: "News not found", description: "Not found", robots: { index: false } };
    }
    return {
      title: data.title,
      description: data.description,
      openGraph: {
        title: data.title,
        description: data.description,
        images: data.thumbnail?.url ? [data.thumbnail.url] : [],
      },
    };
  } catch (e) {
    const { slug } = await params;
    const err = normalizeError(e);
    console.error(`[generateMetadata] getNewsDetail(${slug}) failed:`, err);
    return { title: "News not found", description: "Not found", robots: { index: false } };
  }
}

export default async function Page({ params }: Props) {
  try {
    const { slug } = await params; // 👈 await で展開
    const data = await getNewsDetail(slug);

    if (!data) notFound(); // 404 へ
    return (
      <>
        <Article data={data} />
        <div className={styles.footer}>
          <ButtonLink href="/news">To News List</ButtonLink>
        </div>
      </>
    );
  } catch (e) {
    const { slug } = await params;
    const err = normalizeError(e);
    console.error(`[Page] getNewsDetail(${slug}) failed:`, err);
    // 取得失敗は 404 にせず 500 系へ流すほうが原因が見えやすい
    throw err;
  }
}

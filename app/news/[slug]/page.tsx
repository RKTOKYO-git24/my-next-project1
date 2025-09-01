// /home/ryotaro/dev/mnp-dw-20250821/app/news/[slug]/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/payload";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";
import { normalizeError } from "@/app/_libs/utils";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = { params: { slug: string } };

// 404 は通常フロー、その他はログを残す
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const data = await getNewsDetail(params.slug);
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
    const err = normalizeError(e);
    console.error(`[generateMetadata] getNewsDetail(${params.slug}) failed:`, err);
    return { title: "News not found", description: "Not found", robots: { index: false } };
  }
}

export default async function Page({ params }: Props) {
  try {
    const data = await getNewsDetail(params.slug);
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
    const err = normalizeError(e);
    console.error(`[Page] getNewsDetail(${params.slug}) failed:`, err);
    // 取得失敗は 404 にせず 500 系へ流すほうが原因が見えやすい
    throw err;
  }
}
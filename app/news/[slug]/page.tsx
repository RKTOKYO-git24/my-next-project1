import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsDetail } from "lib/payload";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";
import { normalizeError } from "lib/utils";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const data = await getNewsDetail(slug);

    if (!data) {
      return {
        title: "News not found",
        description: "Not found",
        robots: { index: false },
      };
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
    return {
      title: "News not found",
      description: "Not found",
      robots: { index: false },
    };
  }
}

export default async function Page({ params }: Props) {
  try {
    const { slug } = await params;
    const data = await getNewsDetail(slug);

    if (!data) notFound();

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
    throw err;
  }
}

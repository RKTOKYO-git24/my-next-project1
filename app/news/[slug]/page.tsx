import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

// Fix: `PageProps` should be properly typed as Next.js expects
interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const data = await getNewsDetail(params.slug).catch(() => null);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    title: data.title,
    description: data.description,
  };
}

export default async function Page({ params }: PageProps) {
  const data = await getNewsDetail(params.slug).catch(notFound);

  if (!data) {
    return null; // Handle this as an empty state or fallback
  }

  return (
    <>
      <Article data={data} />
      <div className={styles.footer}>
        <ButtonLink href="/news">ニュース一覧へ</ButtonLink>
      </div>
    </>
  );
}

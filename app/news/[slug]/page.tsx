import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

// Next.js 15 requires generating static params or data fetching using new methods
export async function generateStaticParams() {
  const slugs = await getNewsDetail(); // Or fetch all slugs or relevant dynamic routes
  return slugs.map((slug) => ({
    slug: slug, // Adjust this as per your data structure
  }));
}

// Page component now receives params in the correct structure
type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
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

export default async function Page({ params }: Props) {
  const data = await getNewsDetail(params.slug).catch(notFound);

  if (!data) {
    return null; // Fallback or 404
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

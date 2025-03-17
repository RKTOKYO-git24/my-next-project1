import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

// The params are automatically passed in the component by Next.js for dynamic routes
type Props = {
  params: {
    slug: string; // `slug` will be passed dynamically based on your URL structure
  };
};

// Generate Metadata (Optional, for SEO/meta tags)
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

// Page Component where dynamic params (slug) are passed automatically
export default async function Page({ params }: Props) {
  const data = await getNewsDetail(params.slug).catch(notFound); // Fetch data based on the slug

  if (!data) {
    return null; // Show fallback or error state
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

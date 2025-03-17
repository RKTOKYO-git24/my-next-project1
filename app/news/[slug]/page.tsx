import { notFound } from "next/navigation";
import { getNewsDetail } from "@/app/_libs/microcms";
import Article from "@/app/_components/Article";
import ButtonLink from "@/app/_components/ButtonLink";
import styles from "./page.module.css";

type Props = {
  params: {
    slug: string;
  };
};

// If you're using server-side rendering (SSR) and fetching data on the server-side
export async function generateMetadata({ params }: Props) {
  const data = await getNewsDetail(params.slug).catch(() => null);

  if (!data) {
    return {
      notFound: true, // Use the notFound flag if data is missing
    };
  }

  // Set dynamic metadata if the data exists (optional, if you need dynamic meta tags)
  return {
    title: data.title,
    description: data.description,
  };
}

export default async function Page({ params }: Props) {
  const data = await getNewsDetail(params.slug).catch(notFound); // Use notFound to return 404 if data is missing

  if (!data) {
    // Optional: Add additional handling for missing data here
    return null;
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

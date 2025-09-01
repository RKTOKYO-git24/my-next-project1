// /home/ryotaro/dev/mnp-dw-20250821/app/news/p/[current]/page.tsx

import { notFound } from "next/navigation";
import { getNewsList } from "@/app/_libs/payload"; // ← payload版を使う
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import { NEWS_LIST_LIMIT } from "@/app/_constants";

type Props = {
  params: { current: string }; // ← Promiseではない
};

export default async function Page({ params }: Props) {
  const current = parseInt(params.current, 10);
  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  // payload.ts の getNewsList は page を受け取る
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    page: current,
  });

  if (!news || news.length === 0) {
    notFound();
  }

  return (
    <>
      <NewsList news={news} />
      <Pagination totalCount={totalCount} current={current} />
    </>
  );
}

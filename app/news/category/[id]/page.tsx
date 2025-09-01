// /home/ryotaro/dev/mnp-dw-20250821/app/news/category/[id]/page.tsx

import { notFound } from "next/navigation";
import { getNewsList } from "@/app/_libs/payload"; // ← microcms ではなく payload を使う
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import Category from "@/app/_components/Category";
import { NEWS_LIST_LIMIT } from "@/app/_constants";

type Props = {
  params: { id: string }; // ← Promiseではない
};

export default async function Page({ params }: Props) {
  const categoryId = params.id;

  // payload.ts の getNewsList は category を equals で絞り込むオプション対応済み
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    page: 1,               // 必要なら pagenationをクエリから受ける
    category: categoryId,  // ← これで where[category][equals]=... に変換される
  });

  if (!news || news.length === 0) {
    notFound();
  }

  return (
    <>
      <p>
        List of <Category category={categoryId} />
      </p>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        basePath={`/news/category/${categoryId}`}
      />
    </>
  );
}

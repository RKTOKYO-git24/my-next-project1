// /app/news/category/[id]/p/[current]/page.tsx
import { notFound } from "next/navigation";
import { getNewsList } from "lib/payload";
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import Category from "@/app/_components/Category";
import { NEWS_LIST_LIMIT } from "@/app/_constants";

type Props = {
  params: { id: string; current: string };
};

export default async function Page({ params }: Props) {
  const categoryId = params.id;                 // 例: "technology"
  const currentPage = Number.parseInt(params.current, 10);
  if (Number.isNaN(currentPage) || currentPage < 1) notFound();

  // Payload 版 API（page/limit/category を使う）
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    page: currentPage,
    category: categoryId,
  });

  if (!news || news.length === 0) notFound();

  return (
    <>
      <p>List of <Category category={categoryId} /></p>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        current={currentPage}
        basePath={`/news/category/${categoryId}`}
      />
    </>
  );
}

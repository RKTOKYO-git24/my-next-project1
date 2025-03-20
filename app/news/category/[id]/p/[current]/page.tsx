import { notFound } from "next/navigation";
import { getCategoryDetail, getNewsList } from "@/app/_libs/microcms";
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import { NEWS_LIST_LIMIT } from "@/app/_constants";

// Correctly type the params as a resolved object
type Props = {
  params: Promise<{
    id: string;
    current: string;
  }>;
};

export default async function Page({ params }: Props) {
  // No need to resolve the params promise manually anymore, just access the properties

  const { id, current } = await params;

  // Parse 'current' to integer and handle invalid values
  const currentPage = parseInt(current, 5); // base 10 is generally better for parsing numbers

  if (Number.isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // Fetch category details
  const category = await getCategoryDetail(id).catch(notFound);

  // Fetch the list of news based on pagination
  const { contents: news, totalCount } = await getNewsList({
    filters: `category[equals]${category.id}`,
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (currentPage - 1),
  });

  // If no news found, trigger 'notFound' error
  if (news.length === 0) {
    notFound();
  }

  return (
    <>
      <NewsList news={news} />
      <Pagination
        totalCount={totalCount}
        current={currentPage}
        basePath={`/news/category/${category.id}`}
      />
    </>
  );
}

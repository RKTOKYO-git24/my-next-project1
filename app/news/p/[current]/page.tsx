import { notFound } from "next/navigation";
import { getNewsList } from "@/app/_libs/microcms";
import NewsList from "@/app/_components/NewsList";
import Pagination from "@/app/_components/Pagination";
import { NEWS_LIST_LIMIT } from "@/app/_constants";

// Correctly type the params as a Promise
type Props = {
  params: Promise<{
    current: string;
  }>;
};

export default async function Page({ params }: Props) {
  // Resolve params Promise
  const resolvedParams = await params;

  // Parse 'current' to integer and handle invalid values
  const current = parseInt(resolvedParams.current, 5);

  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  // Fetch the list of news based on pagination
  const { contents: news, totalCount } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
    offset: NEWS_LIST_LIMIT * (current - 1),
  });

  // If no news found, trigger 'notFound' error
  if (news.length === 0) {
    notFound();
  }

  return (
    <>
      <NewsList news={news} />
      <Pagination totalCount={totalCount} current={current} />
    </>
  );
}

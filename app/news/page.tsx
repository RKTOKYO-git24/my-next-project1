import { getNewsList } from "@/app/_libs/microcms";
import NewsList from "@/app/_components/NewsList";
import { NEWS_LIST_LIMIT } from "../_constants";

export default async function Page() {
  const { contents: news } = await getNewsList({
    limit: NEWS_LIST_LIMIT,
  });

  return <NewsList news={news} />;
}

// /app/news/layout.tsx
import { headers } from "next/headers";
import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default async function NewsLayout({ children }: Props) {
  // リクエストヘッダから Host を取得
  const h = await headers(); // 👈 await を追加
  const host = h.get("host") || "";

  // 初期値は NEWS としておき、環境ごとに切り替える
  let subTitle = "NEWS";

  if (host.includes("sna-physna.vercel.app")) {
    subTitle = "SNA-PHYSNA NEWS";
  } else if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    subTitle = "LOCAL DEV";
  }

  return (
    <>
      <Hero title="News" sub={subTitle} />
      <Sheet>{children}</Sheet>
    </>
  );
}

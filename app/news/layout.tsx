import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";
import { title } from "process";

export const metadata = {
  title: "News",
};

type Props = {
  children: React.ReactNode;
};

export const revalidate = 60;

export default function NewsLayout({ children }: Props) {
  return (
    <>
      <Hero title="News" sub="RYOTKIM NEWS" />
      <Sheet>{children}</Sheet>
    </>
  );
}

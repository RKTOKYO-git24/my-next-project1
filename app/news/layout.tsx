// /mnt/c/Users/ryota/Documents/GitHub/my-next-project/app/news/layout.tsx

'use client'; // ファイルの先頭に入れることで、クライアントサイドレンダリングに切り替えます（これがないと window は使えません）

import React, { useEffect, useState } from "react";
import Hero from "@/app/_components/Hero";
import Sheet from "@/app/_components/Sheet";

type Props = {
  children: React.ReactNode;
};

export default function NewsLayout({ children }: Props) {
  const [subTitle, setSubTitle] = useState('RYOTKIM NEWS');

  useEffect(() => {
    const host = window.location.hostname; // 現在アクセスされているドメイン（ホスト名）を取得

    if (host.includes('sna-physna.vercel.app')){
      setSubTitle('SNA-PHYSNA NEWS');
      } else if (host === 'localhost' || host === '127.0.0.1') {
      setSubTitle('LOCAL DEV');
    }
  }, []);

  return (
    <>
    <Hero title="News" sub={subTitle} />
    <Sheet>{children}</Sheet>
    </>
  );
}
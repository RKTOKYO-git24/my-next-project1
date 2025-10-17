import "@/app/globals.css";
import Header2 from "@/app/_components/Header2"; // 🟩 ヘッダーを明示的に読み込み

export const metadata = {
  title: "Physna v3 Browser",
};

export default function PhysnaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* 🟦 固定ヘッダー */}
        <Header2 />

        {/* 🟩 ヘッダー高さぶん（約60px）の余白を確保 */}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}

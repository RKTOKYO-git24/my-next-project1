import "@/app/globals.css";

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
        {/* ❌ Header2 は削除！ ConditionalHeaderが出す */}
        <main>{children}</main>
      </body>
    </html>
  );
}

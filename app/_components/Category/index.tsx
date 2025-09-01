// /home/ryotaro/dev/mnp-dw-20250821/app/_components/Category/index.tsx

import styles from "./index.module.css";

type CategoryObj = { name: string }; // microCMS時代の互換
type Props = {
  category: string | CategoryObj;
};

// Payload の select 値 → 表示ラベルの対応
const LABELS: Record<string, string> = {
  technology: "Technology",
  japan: "Japan",
  usa: "U.S.A.",
  update: "Update",
  private: "Private",
};

export default function Category({ category }: Props) {
  const label =
    typeof category === "string"
      ? LABELS[category] ?? category
      : category.name;

  return <span className={styles.category}>{label}</span>;
}

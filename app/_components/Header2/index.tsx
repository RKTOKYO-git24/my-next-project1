"use client";
import Link from "next/link";
import { useRef } from "react";
import styles from "./index.module.css";
import { ImagePlus } from "lucide-react";
import runVisualSearch from "@/app/physna-v3/search/VisualSearch";

export default function Header2() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await runVisualSearch(file);
    if (!data) return;

    // ✅ sessionStorage に保存してURLを短くする
    const key = `visualSearch_${Date.now()}`;
    sessionStorage.setItem(key, JSON.stringify(data));

    // 🚀 クエリにはキーだけ渡す
    window.location.href = `/physna-v3/search/result?key=${key}`;
  };

  return (
    <>
      <header className={styles.header}>
        <Link href="/physna-v3">
          <img src="/logo-sna.svg" alt="SNA Logo" className={styles.logo} />
        </Link>

        <div className={styles.rightArea}>
          <ImagePlus
            className={styles.uploadIcon}
            onClick={handleClick}
            size={28}
          />
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </header>

      <div className={styles.spacer}></div>
    </>
  );
}

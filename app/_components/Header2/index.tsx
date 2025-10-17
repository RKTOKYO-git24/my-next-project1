"use client";
import Link from "next/link";
import styles from "./index.module.css";

export default function Header2() {
  return (
    <>
      {/* 固定ヘッダー */}
      <header className={styles.header}>
        <Link href="/physna-v3">
          <img
            src="/logo-sna.svg"
            alt="SNA Logo"
            className={styles.logo}
          />
        </Link>
      </header>

      {/* 🟩 ヘッダー高さぶんのダミー余白 */}
      <div className={styles.spacer}></div>
    </>
  );
}

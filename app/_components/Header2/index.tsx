"use client";
import Link from "next/link";
import styles from "./index.module.css";

export default function Header2() {
  return (
    <header className={styles.header}>
      <Link href="/physna-v3">
        <img
          src="/logo-sna.svg"
          alt="SNA Logo"
          className={styles.logo}
        />
      </Link>
    </header>
  );
}

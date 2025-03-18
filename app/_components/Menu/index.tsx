"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import cx from "classnames";
import styles from "./index.module.css";

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  // Function to close the menu after clicking a link
  const handleLinkClick = () => {
    setOpen(false); // Close the menu when a link is clicked
  };

  return (
    <div>
      <nav className={cx(styles.nav, isOpen && styles.open)}>
        <ul className={styles.items}>
          <li>
            <Link href="/news" onClick={handleLinkClick}>
              NEWS
            </Link>
          </li>
          <li>
            <Link href="/members" onClick={handleLinkClick}>
              MEMBERS
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={handleLinkClick}>
              CONTACT US
            </Link>
          </li>
        </ul>
        <button className={cx(styles.button, styles.close)} onClick={close}>
          <Image
            src="/close.svg"
            alt="閉じる"
            width={24}
            height={24}
            priority
          />
        </button>
      </nav>
      <button className={styles.button} onClick={open}>
        <Image src="/menu.svg" alt="メニュー" width={24} height={24} />
      </button>
    </div>
  );
}

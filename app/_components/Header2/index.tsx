"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import styles from "./index.module.css";
import { useRef } from "react";

export default function Header2() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/gif"];
    if (!allowed.includes(file.type)) {
      alert("Only .jpg / .jpeg / .png / .gif are supported.");
      return;
    }

    // 画像をBase64に変換してsessionStorageに保存
    const reader = new FileReader();
    reader.onload = async () => {
      sessionStorage.setItem("visualSearchFile", reader.result as string);
      router.push("/physna-v3/search/result");
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className={styles.header}>
      <Link href="/physna-v3">
        <img src="/logo-sna.svg" alt="SNA Logo" className={styles.logo} />
      </Link>
      <div className={styles.rightArea}>
        <ImagePlus
          size={28}
          className={styles.uploadIcon}
          onClick={() => fileInputRef.current?.click()}
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
  );
}

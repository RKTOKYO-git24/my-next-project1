"use client";

// ⚠️ この関数は純粋なAPI呼び出し専用。
// router は使わない。呼び出し元（Header2）でハンドリングする。
export default async function VisualSearch(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("対応形式は .jpg / .jpeg / .png / .gif のみです。");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/physna-v3/visual-search", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

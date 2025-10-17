// "use client" は不要

export default async function runVisualSearch(file: File): Promise<any> {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    alert("Only .jpg, .jpeg, .png, .gif formats are supported.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/physna-v3/visual-search", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    console.error("❌ Upload failed:", res.status);
    alert("Upload failed.");
    return null;
  }

  return await res.json();
}

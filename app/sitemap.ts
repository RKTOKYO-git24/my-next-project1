// /home/ryotaro/dev/mnp-dw-20250821/app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  return [
    {
      url: "https://www.ryotkim.com/",
      lastModified: now,
    },
  ];
}

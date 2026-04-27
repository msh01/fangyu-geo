import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import path from "node:path";
import { getFangyuSections } from "@/lib/fangyu-data";
import { getSectionPath } from "@/lib/section-routes";
import { SITE_URL } from "@/lib/site-metadata";

function getContentLastModified() {
  return statSync(path.join(process.cwd(), "读史方舆纪要-各区域序.md")).mtime;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = getFangyuSections();
  const lastModified = getContentLastModified();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...sections.map((section) => ({
      url: `${SITE_URL}${getSectionPath(section)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

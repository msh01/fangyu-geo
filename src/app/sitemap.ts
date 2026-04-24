import type { MetadataRoute } from "next";
import { getFangyuSections } from "@/lib/fangyu-data";
import { getSectionPath } from "@/lib/section-routes";
import { SITE_URL } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = getFangyuSections();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...sections.map((section) => ({
      url: `${SITE_URL}${getSectionPath(section)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

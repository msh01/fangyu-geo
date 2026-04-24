import { FangyuExplorer } from "@/components/fangyu-explorer";
import { getFangyuSections, getProvinceOverviewSection } from "@/lib/fangyu-data";
import { getSectionPath } from "@/lib/section-routes";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site-metadata";

export default function Home() {
  const sections = getFangyuSections();
  const overviewSection = getProvinceOverviewSection(sections);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "zh-CN",
      },
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        applicationCategory: "EducationalApplication",
        inLanguage: "zh-CN",
        keywords: SITE_KEYWORDS.join(", "),
        about: sections.slice(0, 12).map((section) => ({
          "@type": "Thing",
          name: section.displayTitle,
          description: section.analysis.thesis,
        })),
        isBasedOn: {
          "@type": "Book",
          name: "读史方舆纪要",
        },
      },
      {
        "@type": "ItemList",
        name: "地缘形势章节",
        itemListElement: sections.map((section, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: section.displayTitle,
          url: `${SITE_URL}${getSectionPath(section)}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <FangyuExplorer sections={sections} overviewSection={overviewSection} initialSelectedId={overviewSection.id} />
    </>
  );
}

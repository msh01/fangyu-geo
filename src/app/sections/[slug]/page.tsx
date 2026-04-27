import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FangyuExplorer } from "@/components/fangyu-explorer";
import { SeoSectionArticle } from "@/components/seo-content";
import { findSectionBySlug, getFangyuSections, getProvinceOverviewSection } from "@/lib/fangyu-data";
import { getSectionPath } from "@/lib/section-routes";
import { SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site-metadata";

type SectionPageProps = {
  params: Promise<{ slug: string }>;
};

function getSectionOrThrow(slug: string) {
  const sections = getFangyuSections();
  const section = findSectionBySlug(sections, slug);

  if (!section) {
    notFound();
  }

  return { sections, section };
}

function sectionDescription(section: ReturnType<typeof getFangyuSections>[number]) {
  return `解析《读史方舆纪要》中${section.displayTitle}：${section.analysis.thesis}`;
}

export function generateStaticParams() {
  return getFangyuSections().map((section) => ({
    slug: section.slug,
  }));
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { section } = getSectionOrThrow(slug);
  const path = getSectionPath(section);
  const description = sectionDescription(section);

  return {
    title: section.displayTitle,
    description,
    keywords: [
      ...SITE_KEYWORDS,
      section.title,
      section.displayTitle,
      ...section.analysis.themes,
      ...section.analysis.places.map((place) => place.name),
    ],
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "article",
      locale: "zh_CN",
      url: path,
      siteName: SITE_NAME,
      title: `${section.displayTitle} | ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${section.displayTitle} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug } = await params;
  const { sections, section } = getSectionOrThrow(slug);
  const overviewSection = getProvinceOverviewSection(sections);
  const sectionUrl = `${SITE_URL}${getSectionPath(section)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: section.displayTitle,
    name: section.displayTitle,
    url: sectionUrl,
    description: sectionDescription(section),
    inLanguage: "zh-CN",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    isBasedOn: {
      "@type": "Book",
      name: "读史方舆纪要",
    },
    about: [
      ...section.analysis.themes.map((theme) => ({
        "@type": "Thing",
        name: theme,
      })),
      ...section.analysis.places.map((place) => ({
        "@type": "Place",
        name: place.name,
        description: place.role,
        geo: {
          "@type": "GeoCoordinates",
          longitude: place.coordinates[0],
          latitude: place.coordinates[1],
        },
      })),
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
      <FangyuExplorer sections={sections} overviewSection={overviewSection} initialSelectedId={section.id} />
      <SeoSectionArticle section={section} />
    </>
  );
}

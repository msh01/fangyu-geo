import type { FangyuSection } from "@/lib/fangyu-data";
import { getSectionPath } from "@/lib/section-routes";
import { SITE_NAME } from "@/lib/site-metadata";

type SeoSectionListProps = {
  sections: FangyuSection[];
};

type SeoSectionArticleProps = {
  section: FangyuSection;
};

function placeList(section: FangyuSection) {
  return section.analysis.places.map((place) => place.name).join("、");
}

export function SeoHomeContent({ sections }: SeoSectionListProps) {
  const provinceSections = sections.filter((section) => section.title !== "历代州域形势纪要序");

  return (
    <section className="border-t border-[#dad7cb] bg-[#fbfaf6] px-4 py-10 text-[#202320] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-sm text-[#7a3c2e]">读史方舆纪要 / 历史地理 / 地缘形势</p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#171916] sm:text-3xl">
          {SITE_NAME}：从《读史方舆纪要》推演各省地缘形势
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#555951]">
          本站把《读史方舆纪要》各区域序转化为地图、拓扑网络、指标图和原文阅读视图，用来观察中国古代地缘形势、
          都邑选择、山川险要、交通通道、边防压力与攻守关系。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {provinceSections.map((section) => (
            <article key={section.id} className="border border-[#d8d2c4] bg-white p-5">
              <h3 className="text-lg font-semibold text-[#171916]">
                <a className="hover:text-[#9f3f30]" href={getSectionPath(section)}>
                  {section.displayTitle}
                </a>
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#555951]">{section.analysis.summary}</p>
              <p className="mt-3 text-sm leading-7 text-[#6a6e65]">
                关键词：{section.analysis.themes.join("、")}；相关地名：{placeList(section)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeoSectionArticle({ section }: SeoSectionArticleProps) {
  return (
    <article className="border-t border-[#dad7cb] bg-[#fbfaf6] px-4 py-10 text-[#202320] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-sm text-[#7a3c2e]">读史方舆纪要区域解析</p>
        <h1 className="mt-3 text-2xl font-semibold leading-tight text-[#171916] sm:text-3xl">
          {section.displayTitle}
        </h1>
        <p className="mt-4 text-base leading-8 text-[#555951]">{section.analysis.summary}</p>
        <p className="mt-4 text-base leading-8 text-[#555951]">
          {section.displayTitle}的核心判断是：{section.analysis.thesis}
        </p>
        <dl className="mt-6 grid gap-4 border-y border-[#d8d2c4] py-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-[#171916]">形势类型</dt>
            <dd className="mt-1 text-[#555951]">{section.analysis.posture}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#171916]">主题关键词</dt>
            <dd className="mt-1 text-[#555951]">{section.analysis.themes.join("、")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#171916]">相关时代</dt>
            <dd className="mt-1 text-[#555951]">{section.analysis.periods.join("、")}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#171916]">关键地名</dt>
            <dd className="mt-1 text-[#555951]">{placeList(section)}</dd>
          </div>
        </dl>
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-[#171916]">原文摘录</h2>
          <p className="mt-3 text-base leading-8 text-[#555951]">{section.excerpt}...</p>
        </section>
      </div>
    </article>
  );
}

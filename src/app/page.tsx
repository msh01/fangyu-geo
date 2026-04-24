import { FangyuExplorer } from "@/components/fangyu-explorer";
import { getFangyuSections, getProvinceOverviewSection } from "@/lib/fangyu-data";

export default function Home() {
  const sections = getFangyuSections();
  const overviewSection = getProvinceOverviewSection(sections);

  return <FangyuExplorer sections={sections} overviewSection={overviewSection} />;
}

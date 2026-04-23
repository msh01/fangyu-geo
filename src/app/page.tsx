import { FangyuExplorer } from "@/components/fangyu-explorer";
import { getFangyuSections } from "@/lib/fangyu-data";

export default function Home() {
  const sections = getFangyuSections();

  return <FangyuExplorer sections={sections} />;
}

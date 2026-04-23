import { readFileSync } from "node:fs";
import path from "node:path";

export type Place = {
  name: string;
  coordinates: [number, number];
  role: string;
};

export type SectionAnalysis = {
  summary: string;
  thesis: string;
  posture: "攻取" | "守御" | "攻守兼备" | "总论";
  strategicWeight: number;
  defensibility: number;
  mobility: number;
  risk: number;
  themes: string[];
  periods: string[];
  places: Place[];
};

export type FangyuSection = {
  id: string;
  order: number;
  title: string;
  displayTitle: string;
  text: string;
  excerpt: string;
  wordCount: number;
  analysis: SectionAnalysis;
};

const SOURCE_FILE = "读史方舆纪要-各区域序.md";

const analysisByTitle: Record<string, SectionAnalysis> = {
  历代州域形势纪要序: {
    summary: "以州域和形势的互相转化总摄全书，强调制度疆域有定，而形势随治乱、人事、攻守而变。",
    thesis: "州域只是棋盘，形势才是用兵治乱的活法。",
    posture: "总论",
    strategicWeight: 82,
    defensibility: 62,
    mobility: 78,
    risk: 70,
    themes: ["州域", "形势", "治乱循环", "天下大势"],
    periods: ["上古", "历代"],
    places: [
      { name: "九州", coordinates: [103.8, 35.4], role: "州域总论的象征中心" },
    ],
  },
  北直方舆纪要序: {
    summary: "围绕燕都是否可为帝都展开辩难，肯定其制北边之势，也反复指出弃大宁、开平、辽左后京师孤露的危险。",
    thesis: "燕京可以建都，但不能孤都；北方屏障一失，形胜反成国患。",
    posture: "守御",
    strategicWeight: 96,
    defensibility: 72,
    mobility: 68,
    risk: 92,
    themes: ["京师", "边防", "燕云", "开平大宁", "都城选择"],
    periods: ["辽", "金", "元", "明"],
    places: [
      { name: "北京", coordinates: [116.4074, 39.9042], role: "燕都与京师核心" },
      { name: "大宁", coordinates: [118.9, 41.6], role: "北边屏障" },
      { name: "开平", coordinates: [115.9, 42.3], role: "漠南支点" },
      { name: "辽阳", coordinates: [123.2369, 41.2672], role: "辽左根本" },
    ],
  },
  南直方舆纪要序: {
    summary: "论证东南并非只能偏安，关键在江汉上游与淮泗门户；南直的价值在于兼具财赋、江防和北伐通道。",
    thesis: "守江不在江南，守淮不在淮南；东南形势系于上游与两淮。",
    posture: "攻守兼备",
    strategicWeight: 94,
    defensibility: 78,
    mobility: 82,
    risk: 76,
    themes: ["江淮", "东南财赋", "上游", "两淮", "北伐"],
    periods: ["楚汉", "六朝", "宋", "明"],
    places: [
      { name: "南京", coordinates: [118.7969, 32.0603], role: "东南都会" },
      { name: "淮泗", coordinates: [117.2, 33.5], role: "北向门户" },
      { name: "采石", coordinates: [118.48, 31.69], role: "江防要渡" },
    ],
  },
  山东方舆纪要序: {
    summary: "山东与京师犬牙相错，漕渠贯穿其间，既是唇齿之助，也是切断南北命脉的肘腋之患。",
    thesis: "山东不足恃险自守，却足以因漕运和海路牵动京师。",
    posture: "攻守兼备",
    strategicWeight: 88,
    defensibility: 56,
    mobility: 84,
    risk: 86,
    themes: ["漕运", "齐鲁", "京师肘腋", "海运", "山东用兵"],
    periods: ["春秋战国", "唐末", "元末", "明初"],
    places: [
      { name: "济南", coordinates: [117.1201, 36.6512], role: "山东腹地" },
      { name: "临清", coordinates: [115.705, 36.838], role: "漕渠节点" },
      { name: "登莱", coordinates: [120.75, 37.8], role: "海防与辽东通道" },
    ],
  },
  山西方舆纪要序: {
    summary: "以太行、大河、雁门等层层险阻说明山西形势完固，可制河北、关中与河洛，是关中之外最可倚重之地。",
    thesis: "山西的价值在于既能自固，又可分向关中、河北、河洛。",
    posture: "攻守兼备",
    strategicWeight: 90,
    defensibility: 91,
    mobility: 73,
    risk: 64,
    themes: ["太行", "雁门", "大河", "晋国", "表里山河"],
    periods: ["春秋", "战国", "秦汉", "五代"],
    places: [
      { name: "太原", coordinates: [112.5489, 37.8706], role: "山西都会" },
      { name: "雁门关", coordinates: [112.88, 39.18], role: "北门险隘" },
      { name: "壶关", coordinates: [113.2, 36.1], role: "太行出口" },
    ],
  },
  河南方舆纪要序: {
    summary: "河南居天下之中，河洛为都会正脉，却也因四面受敌而不能只凭山川险固自守。",
    thesis: "中原贵在控四方之会，不贵退藏险僻。",
    posture: "攻守兼备",
    strategicWeight: 91,
    defensibility: 58,
    mobility: 92,
    risk: 88,
    themes: ["河洛", "中原", "四战之地", "都邑", "天下之中"],
    periods: ["周", "汉魏", "隋唐", "宋金"],
    places: [
      { name: "洛阳", coordinates: [112.454, 34.6197], role: "河洛都会" },
      { name: "开封", coordinates: [114.3076, 34.7972], role: "汴梁平原都会" },
      { name: "潼关", coordinates: [110.25, 34.56], role: "关中东门" },
    ],
  },
  陕西方舆纪要序: {
    summary: "陕西据上游而制天下命脉，关中、陇右、河西一动常足以酿成天下大势之变。",
    thesis: "关中是天下头项，得之者可以制人，失控者也最易为天下祸端。",
    posture: "攻取",
    strategicWeight: 97,
    defensibility: 88,
    mobility: 81,
    risk: 90,
    themes: ["关中", "上游", "秦陇", "边患", "王业根本"],
    periods: ["周", "秦", "汉", "唐", "明末"],
    places: [
      { name: "西安", coordinates: [108.9398, 34.3416], role: "关中核心" },
      { name: "陇右", coordinates: [104.6, 35.6], role: "西北边陲" },
      { name: "汉中", coordinates: [107.0238, 33.0675], role: "巴蜀入关通道" },
    ],
  },
  四川方舆纪要叙: {
    summary: "反复驳斥蜀可坐守之说，认为四川必须以战为守，作为取关中、控江汉、争天下的先资。",
    thesis: "蜀非坐守之国；恃险自足，终必门户洞开。",
    posture: "攻取",
    strategicWeight: 89,
    defensibility: 83,
    mobility: 66,
    risk: 84,
    themes: ["巴蜀", "剑阁", "瞿塘", "汉中", "以战为守"],
    periods: ["秦", "汉", "蜀汉", "宋", "明初"],
    places: [
      { name: "成都", coordinates: [104.0668, 30.5728], role: "蜀中根本" },
      { name: "剑阁", coordinates: [105.52, 32.29], role: "栈道险口" },
      { name: "瞿塘峡", coordinates: [109.54, 31.04], role: "江道门户" },
    ],
  },
  湖广方舆纪要序: {
    summary: "辨析武昌、荆州、襄阳三要，最终突出襄阳为天下腰膂，武昌为东南上流，荆州为全楚之中。",
    thesis: "楚地形势如鼎足，而襄阳最能决定东南存亡和北向进取。",
    posture: "攻守兼备",
    strategicWeight: 93,
    defensibility: 82,
    mobility: 85,
    risk: 82,
    themes: ["襄阳", "武昌", "荆州", "江汉", "上流"],
    periods: ["楚", "三国", "六朝", "南宋", "元"],
    places: [
      { name: "襄阳", coordinates: [112.1224, 32.0089], role: "天下腰膂" },
      { name: "武汉", coordinates: [114.3054, 30.5931], role: "江汉水要" },
      { name: "荆州", coordinates: [112.2397, 30.3352], role: "全楚之中" },
    ],
  },
  江西方舆纪要叙: {
    summary: "江西处江湖之间，承接吴楚、闽粤与上游，虽不为天下根本，却是东南运转和江防支撑。",
    thesis: "江西的战略性在于转输、江湖与东南腹地的联络。",
    posture: "守御",
    strategicWeight: 76,
    defensibility: 63,
    mobility: 74,
    risk: 62,
    themes: ["江湖", "鄱阳", "东南腹地", "转输", "吴楚"],
    periods: ["六朝", "唐宋", "明"],
    places: [
      { name: "南昌", coordinates: [115.8582, 28.6829], role: "江西都会" },
      { name: "鄱阳湖", coordinates: [116.28, 29.08], role: "江湖枢纽" },
    ],
  },
  浙江方舆纪要叙: {
    summary: "浙江凭江海、山岭与财赋为东南重地，强在富庶与海防，弱在局促一隅。",
    thesis: "浙江可为东南资储，不足独任天下攻守。",
    posture: "守御",
    strategicWeight: 72,
    defensibility: 66,
    mobility: 70,
    risk: 58,
    themes: ["钱塘", "海防", "财赋", "吴越", "东南"],
    periods: ["吴越", "宋", "明"],
    places: [
      { name: "杭州", coordinates: [120.1551, 30.2741], role: "钱塘都会" },
      { name: "宁波", coordinates: [121.5503, 29.8746], role: "海防门户" },
    ],
  },
  福建方舆纪要叙: {
    summary: "福建山海阻隔，内足自保，外通海洋；其患与利都在海路、岛屿和闽粤交界。",
    thesis: "福建险在山海，活路也在山海。",
    posture: "守御",
    strategicWeight: 70,
    defensibility: 80,
    mobility: 55,
    risk: 69,
    themes: ["闽中", "山海", "海防", "岛屿", "闽粤"],
    periods: ["唐宋", "明"],
    places: [
      { name: "福州", coordinates: [119.2965, 26.0745], role: "闽中都会" },
      { name: "泉州", coordinates: [118.6757, 24.8741], role: "海路门户" },
    ],
  },
  广东方舆纪要叙: {
    summary: "广东远处岭南，却以海口、南越旧地和交广门户关系边海安全，是南疆联络的关键。",
    thesis: "广东不在中原争衡中心，却是岭南和海路的门户。",
    posture: "守御",
    strategicWeight: 74,
    defensibility: 68,
    mobility: 72,
    risk: 67,
    themes: ["岭南", "南越", "海口", "交广", "边疆"],
    periods: ["秦汉", "唐宋", "明"],
    places: [
      { name: "广州", coordinates: [113.2644, 23.1291], role: "岭南都会" },
      { name: "韶关", coordinates: [113.5975, 24.8104], role: "岭南北门" },
    ],
  },
  广西方舆纪要叙: {
    summary: "广西联通湖广、广东、云南和交趾，重在边徼山路与羁縻控制，形势偏向边防治理。",
    thesis: "广西的战略价值在通西南、制交趾、安诸峒。",
    posture: "守御",
    strategicWeight: 69,
    defensibility: 73,
    mobility: 57,
    risk: 70,
    themes: ["西南边徼", "交趾", "山路", "羁縻", "岭南"],
    periods: ["秦汉", "唐宋", "明"],
    places: [
      { name: "桂林", coordinates: [110.2902, 25.2736], role: "广西山水要地" },
      { name: "南宁", coordinates: [108.3669, 22.817], role: "通交广门户" },
    ],
  },
  云南方舆纪要序: {
    summary: "云南处西南极边，山川环结，连接滇黔、巴蜀、交趾与缅甸，关键在远驭和边防。",
    thesis: "云南贵在羁控西南门户，不能只作化外看待。",
    posture: "守御",
    strategicWeight: 73,
    defensibility: 82,
    mobility: 46,
    risk: 78,
    themes: ["西南", "滇池", "边防", "蛮夷", "远驭"],
    periods: ["汉唐", "元", "明"],
    places: [
      { name: "昆明", coordinates: [102.8329, 24.8801], role: "滇中核心" },
      { name: "大理", coordinates: [100.2676, 25.6065], role: "西南旧国根本" },
    ],
  },
  贵州方舆纪要叙: {
    summary: "贵州介于湖广、四川、云南、广西之间，虽山险地瘠，却是西南诸路的扣合之处。",
    thesis: "贵州不是富庶腹地，而是西南通道的锁钥。",
    posture: "守御",
    strategicWeight: 71,
    defensibility: 79,
    mobility: 50,
    risk: 72,
    themes: ["西南通道", "苗疆", "山险", "滇黔", "川楚"],
    periods: ["元", "明"],
    places: [
      { name: "贵阳", coordinates: [106.6302, 26.647], role: "黔中核心" },
      { name: "遵义", coordinates: [106.9274, 27.7257], role: "川黔通道" },
    ],
  },
  川渎异同序: {
    summary: "以川渎异同收束地理辨析，强调水道名称、源流和历史记载之间需要互证。",
    thesis: "山川名实不可混同，地理判断必须先辨源流。",
    posture: "总论",
    strategicWeight: 66,
    defensibility: 55,
    mobility: 76,
    risk: 52,
    themes: ["水道", "源流", "名实", "地理考证"],
    periods: ["历代"],
    places: [
      { name: "黄河", coordinates: [110.0, 36.2], role: "大川考证对象" },
      { name: "长江", coordinates: [112.5, 30.5], role: "大江水道" },
    ],
  },
};

function fallbackAnalysis(title: string): SectionAnalysis {
  return {
    summary: `${title}的结构化理解尚待补充。`,
    thesis: "待进一步校订。",
    posture: "总论",
    strategicWeight: 60,
    defensibility: 60,
    mobility: 60,
    risk: 60,
    themes: ["待校订"],
    periods: ["历代"],
    places: [],
  };
}

function sectionId(title: string, order: number) {
  return `${String(order).padStart(2, "0")}-${title.replace(/[^\p{Letter}\p{Number}]+/gu, "-")}`;
}

function toDisplayTitle(title: string) {
  const displayTitles: Record<string, string> = {
    历代州域形势纪要序: "历代州域形势",
    北直方舆纪要序: "北直地缘形势",
    南直方舆纪要序: "南直地缘形势",
    山东方舆纪要序: "山东地缘形势",
    山西方舆纪要序: "山西地缘形势",
    河南方舆纪要序: "河南地缘形势",
    陕西方舆纪要序: "陕西地缘形势",
    四川方舆纪要叙: "四川地缘形势",
    湖广方舆纪要序: "湖广地缘形势",
    江西方舆纪要叙: "江西地缘形势",
    浙江方舆纪要叙: "浙江地缘形势",
    福建方舆纪要叙: "福建地缘形势",
    广东方舆纪要叙: "广东地缘形势",
    广西方舆纪要叙: "广西地缘形势",
    云南方舆纪要序: "云南地缘形势",
    贵州方舆纪要叙: "贵州地缘形势",
    川渎异同序: "川渎源流辨析",
  };

  return displayTitles[title] ?? title.replace(/方舆纪要[序叙]$/, "地缘形势").replace(/[序叙]$/, "");
}

export function getFangyuSections(): FangyuSection[] {
  const sourcePath = path.join(process.cwd(), SOURCE_FILE);
  const markdown = readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "");
  const matches = [...markdown.matchAll(/^##\s+(\d+)\.\s+(.+)$/gm)];

  return matches.map((match, index) => {
    const next = matches[index + 1];
    const order = Number(match[1]);
    const title = match[2].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? markdown.length;
    const text = markdown.slice(start, end).trim();
    const analysis = analysisByTitle[title] ?? fallbackAnalysis(title);

    return {
      id: sectionId(title, order),
      order,
      title,
      displayTitle: toDisplayTitle(title),
      text,
      excerpt: text.slice(0, 96),
      wordCount: Array.from(text.replace(/\s+/g, "")).length,
      analysis,
    };
  });
}

export function getAllPlaces(sections: FangyuSection[]) {
  const places = new Map<string, Place & { sections: string[] }>();

  for (const section of sections) {
    for (const place of section.analysis.places) {
      const current = places.get(place.name);
      if (current) {
        current.sections.push(section.title);
      } else {
        places.set(place.name, { ...place, sections: [section.title] });
      }
    }
  }

  return [...places.values()];
}

import type { FangyuSection } from "@/lib/fangyu-data";

export type TopologyNodeKind = "core" | "shield" | "gate" | "base" | "route" | "threat" | "resource";
export type TopologyEdgeKind = "control" | "support" | "threaten" | "supply" | "offense";

export type TopologyNode = {
  id: string;
  label: string;
  kind: TopologyNodeKind;
  x: number;
  y: number;
  note: string;
  evidence: string;
};

export type TopologyEdge = {
  id: string;
  source: string;
  target: string;
  kind: TopologyEdgeKind;
  label: string;
  pressure: number;
  note: string;
};

export type TopologyModel = {
  title: string;
  doctrine: string;
  verdict: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
};

type ModelSeed = {
  title: string;
  doctrine: string;
  verdict: string;
  nodes: Array<Omit<TopologyNode, "x" | "y">>;
  edges: Array<Omit<TopologyEdge, "id">>;
};

const layout = [
  [560, 320],
  [510, 95],
  [770, 210],
  [750, 515],
  [380, 540],
  [300, 260],
  [560, 610],
] as const;

function makeModel(seed: ModelSeed): TopologyModel {
  const nodes = seed.nodes.map((node, index) => ({
    ...node,
    x: layout[index]?.[0] ?? 560,
    y: layout[index]?.[1] ?? 320,
  }));

  return {
    title: seed.title,
    doctrine: seed.doctrine,
    verdict: seed.verdict,
    nodes,
    edges: seed.edges.map((edge) => ({
      ...edge,
      id: `${edge.source}-${edge.target}-${edge.label}`,
    })),
  };
}

const models: Record<string, ModelSeed> = {
  北直方舆纪要序: {
    title: "北直：燕都边防拓扑",
    doctrine: "燕京的帝都价值不在城池本身，而在大宁、开平、辽左等外屏是否完整。",
    verdict: "外屏断裂时，京师从制边核心变成孤露节点。",
    nodes: [
      { id: "beijing", label: "北京/燕京", kind: "core", note: "京师核心", evidence: "燕都者，辽、金、元之故都也" },
      { id: "kaiping", label: "开平", kind: "shield", note: "漠南支点", evidence: "弃开平" },
      { id: "liaoyang", label: "辽阳", kind: "gate", note: "辽左根本", evidence: "视辽左如秦越" },
      { id: "desert", label: "沙碛北边", kind: "threat", note: "边患直压", evidence: "苦寒沙碛之地" },
      { id: "daning", label: "大宁", kind: "shield", note: "东北屏障", evidence: "弃大宁" },
      { id: "zhongyuan", label: "中原", kind: "resource", note: "财赋腹地", evidence: "挽输悬远" },
    ],
    edges: [
      { source: "kaiping", target: "beijing", kind: "support", label: "漠南表里", pressure: 90, note: "开平与燕京形援相属，是都燕外层支架。" },
      { source: "daning", target: "beijing", kind: "support", label: "东北翼蔽", pressure: 86, note: "大宁丢失使燕京东北屏障内缩。" },
      { source: "liaoyang", target: "beijing", kind: "support", label: "辽左策应", pressure: 74, note: "辽阳失联，东翼不再呼吸相闻。" },
      { source: "desert", target: "beijing", kind: "threaten", label: "边患直压", pressure: 92, note: "北边压力直达京师，守势成本暴增。" },
      { source: "zhongyuan", target: "beijing", kind: "supply", label: "挽输供亿", pressure: 78, note: "京师依赖中原供给，距离放大治理成本。" },
    ],
  },
  南直方舆纪要序: {
    title: "南直：江淮攻守拓扑",
    doctrine: "南直的根本不是守江口，而是同时握住江汉上游、淮泗门户和东南财赋。",
    verdict: "江汉失则长江制于人，淮泗失则北向无门，财赋失则东南不能久持。",
    nodes: [
      { id: "nanjing", label: "南京", kind: "core", note: "东南都会", evidence: "金陵可为创业之地" },
      { id: "jianghan", label: "江汉", kind: "gate", note: "上游命门", evidence: "江东之形势系于楚、蜀" },
      { id: "huaissi", label: "淮泗", kind: "gate", note: "北伐门户", evidence: "欲规中原者，必得淮、泗" },
      { id: "zhongyuan", label: "中原", kind: "threat", note: "北面压力", evidence: "两淮皆战场也" },
      { id: "caishi", label: "采石/长江", kind: "shield", note: "江防要渡", evidence: "径向采石" },
      { id: "wealth", label: "江淮财赋", kind: "resource", note: "资储根本", evidence: "扬州富庶常甲天下" },
    ],
    edges: [
      { source: "jianghan", target: "nanjing", kind: "support", label: "上游支撑", pressure: 88, note: "上游在手，江防才由我控制。" },
      { source: "huaissi", target: "nanjing", kind: "offense", label: "北向进取", pressure: 84, note: "淮泗决定东南是否能问中原。" },
      { source: "zhongyuan", target: "huaissi", kind: "threaten", label: "战场压迫", pressure: 82, note: "北方压力首先压在两淮。" },
      { source: "caishi", target: "nanjing", kind: "support", label: "江渡守御", pressure: 76, note: "江防是守成底线，不是全部战略。" },
      { source: "wealth", target: "nanjing", kind: "supply", label: "财赋输送", pressure: 90, note: "东南富庶支撑长期战守。" },
    ],
  },
  山东方舆纪要序: {
    title: "山东：漕运肘腋拓扑",
    doctrine: "山东不是深险割据之地，而是京师漕渠、海路和齐鲁动员的肘腋节点。",
    verdict: "山东若顺，则为京师唇齿；山东若乱，则南北咽喉可被截断。",
    nodes: [
      { id: "shandong", label: "山东", kind: "core", note: "京师肘腋", evidence: "犬牙相错" },
      { id: "canal", label: "漕渠", kind: "route", note: "南北咽喉", evidence: "漕渠中贯于山东" },
      { id: "denglai", label: "登莱", kind: "gate", note: "海防海道", evidence: "登、莱、旅顺间" },
      { id: "beijing", label: "京师", kind: "base", note: "供给目标", evidence: "能为京师患者" },
      { id: "qilu", label: "齐鲁", kind: "resource", note: "动员腹地", evidence: "齐为最强" },
      { id: "pirates", label: "岛屿蜂起", kind: "threat", note: "海道扰动", evidence: "所在蜂起" },
    ],
    edges: [
      { source: "canal", target: "shandong", kind: "supply", label: "漕运贯通", pressure: 92, note: "山东控制漕渠即控制京师供给命脉。" },
      { source: "shandong", target: "beijing", kind: "threaten", label: "肘腋逼近", pressure: 86, note: "山东动乱可快速逼近燕京。" },
      { source: "denglai", target: "beijing", kind: "threaten", label: "海道牵制", pressure: 74, note: "登莱海路可扰天津、旅顺之线。" },
      { source: "qilu", target: "shandong", kind: "support", label: "齐鲁动员", pressure: 78, note: "齐鲁人地支撑山东成为攻势节点。" },
      { source: "pirates", target: "denglai", kind: "threaten", label: "海岛扰运", pressure: 72, note: "岛屿凭依会破坏海运替代方案。" },
    ],
  },
  山西方舆纪要序: {
    title: "山西：表里山河拓扑",
    doctrine: "山西以太行、大河、雁门构成封闭防御，同时又可东出河北、西制关中、南临河洛。",
    verdict: "山西强在攻守兼备；只守则变成山地割据，能出则为天下枢纽。",
    nodes: [
      { id: "shanxi", label: "山西", kind: "core", note: "表里山河", evidence: "山西之形势最为完固" },
      { id: "yanmen", label: "雁门", kind: "gate", note: "北门险隘", evidence: "雁门为之内险" },
      { id: "taihang", label: "太行", kind: "shield", note: "东面屏障", evidence: "太行为之屏障" },
      { id: "guanzhong", label: "关中", kind: "base", note: "西向牵制", evidence: "泾、渭之间，可折棰而下" },
      { id: "hebei", label: "河北", kind: "route", note: "东出战场", evidence: "下壶关、邯郸、井陉而东" },
      { id: "nomad", label: "大漠", kind: "threat", note: "北方压力", evidence: "大漠、阴山为之外蔽" },
    ],
    edges: [
      { source: "yanmen", target: "shanxi", kind: "support", label: "北门锁钥", pressure: 88, note: "雁门决定北境内险是否成立。" },
      { source: "taihang", target: "shanxi", kind: "support", label: "太行屏蔽", pressure: 86, note: "太行让山西对河北有屏障优势。" },
      { source: "shanxi", target: "guanzhong", kind: "offense", label: "西临关中", pressure: 78, note: "山西可沿河势威胁关中。" },
      { source: "shanxi", target: "hebei", kind: "offense", label: "东出井陉", pressure: 82, note: "太行诸口给予山西向东机动能力。" },
      { source: "nomad", target: "yanmen", kind: "threaten", label: "北患压门", pressure: 76, note: "大漠压力首先落在雁门线。" },
    ],
  },
  河南方舆纪要序: {
    title: "河南：中原四会拓扑",
    doctrine: "中原不是闭门自守之地，而是四方通会之枢。河南必须把河洛、汴梁、潼关、南阳诸线连成可进可退的权力网络。",
    verdict: "若只寻险固而弃都会，则等于放弃中原的战略价值；若能掌握关河门户和四向通道，则可居中制外。",
    nodes: [
      { id: "henan", label: "河南", kind: "core", note: "权御核心", evidence: "河南居天下之中" },
      { id: "luoyang", label: "洛阳", kind: "base", note: "河洛都会", evidence: "河洛为都会正脉" },
      { id: "kaifeng", label: "开封", kind: "base", note: "汴梁平原都会", evidence: "汴梁平原都会" },
      { id: "guanzhong", label: "关中", kind: "gate", note: "西向根本", evidence: "潼关为关中东门" },
      { id: "nanyang", label: "南阳/宛", kind: "route", note: "南北折冲", evidence: "彼宛者" },
      { id: "hebei", label: "河北", kind: "threat", note: "肩背之虑", evidence: "四面受敌" },
    ],
    edges: [
      { source: "luoyang", target: "henan", kind: "control", label: "都邑正脉", pressure: 82, note: "河洛赋予河南居中号令的能力。" },
      { source: "kaifeng", target: "henan", kind: "supply", label: "平原转输", pressure: 66, note: "汴梁线强化交通供给，也增加四战风险。" },
      { source: "guanzhong", target: "henan", kind: "support", label: "关河屏障", pressure: 74, note: "潼关是河南西向安全阀。" },
      { source: "nanyang", target: "henan", kind: "offense", label: "南道进退", pressure: 69, note: "南阳线既可通荆襄，也可能反噬中原。" },
      { source: "hebei", target: "henan", kind: "threaten", label: "北面压迫", pressure: 78, note: "河北不稳，河南即暴露肩背。" },
    ],
  },
  陕西方舆纪要序: {
    title: "陕西：关中上游拓扑",
    doctrine: "陕西据天下上游，关中、汉中、陇右、河西共同构成王业根本和边患策源地。",
    verdict: "得关中者可制人，失控关陇者也最易酿成天下祸端。",
    nodes: [
      { id: "guanzhong", label: "关中", kind: "core", note: "天下头项", evidence: "制天下之命者也" },
      { id: "longyou", label: "陇右", kind: "shield", note: "西北外屏", evidence: "羌、胡构乱于西垂" },
      { id: "hanzhong", label: "汉中", kind: "gate", note: "巴蜀入关", evidence: "入关而王汉中" },
      { id: "zhongyuan", label: "中原", kind: "route", note: "东向争衡", evidence: "东向以争河、洛" },
      { id: "hexii", label: "河西", kind: "resource", note: "边塞资储", evidence: "河西、陇右" },
      { id: "rebels", label: "边卒悍起", kind: "threat", note: "晚季祸端", evidence: "犷夫悍卒奋臂而起" },
    ],
    edges: [
      { source: "longyou", target: "guanzhong", kind: "support", label: "西北屏障", pressure: 86, note: "陇右安则关中外翼稳。" },
      { source: "hanzhong", target: "guanzhong", kind: "support", label: "南门锁钥", pressure: 82, note: "汉中是巴蜀入关与关中南保的枢纽。" },
      { source: "guanzhong", target: "zhongyuan", kind: "offense", label: "东出河洛", pressure: 91, note: "关中成势后天然东向争天下。" },
      { source: "hexii", target: "guanzhong", kind: "supply", label: "边塞资储", pressure: 72, note: "河西支撑西北纵深和边塞调度。" },
      { source: "rebels", target: "guanzhong", kind: "threaten", label: "内外激变", pressure: 90, note: "边患与兵变会从关陇放大为天下祸。" },
    ],
  },
  四川方舆纪要叙: {
    title: "四川：巴蜀攻守拓扑",
    doctrine: "四川的险不是坐守资本，而是出击关中、江汉之前的战守支架。",
    verdict: "以战为守则蜀强，以守废战则蜀亡。",
    nodes: [
      { id: "chengdu", label: "成都", kind: "core", note: "蜀中根本", evidence: "直指成都矣" },
      { id: "jiange", label: "剑阁", kind: "gate", note: "栈道险口", evidence: "剑阁不为固矣" },
      { id: "qutang", label: "瞿塘", kind: "gate", note: "江道门户", evidence: "瞿塘亦不能守矣" },
      { id: "jianghan", label: "江汉", kind: "route", note: "东出上游", evidence: "吴楚之喉吭也" },
      { id: "hanzhong", label: "汉中", kind: "route", note: "北出关中", evidence: "都南郑，出陈仓" },
      { id: "enemy", label: "分道入蜀", kind: "threat", note: "多路破险", evidence: "此以分道亡蜀者也" },
    ],
    edges: [
      { source: "jiange", target: "chengdu", kind: "support", label: "栈道守门", pressure: 75, note: "剑阁是北门，但不是绝对保险。" },
      { source: "qutang", target: "chengdu", kind: "support", label: "江道守门", pressure: 72, note: "瞿塘守不住，水路可破腹心。" },
      { source: "chengdu", target: "hanzhong", kind: "offense", label: "北伐关中", pressure: 88, note: "蜀的主动性在北出汉中。" },
      { source: "chengdu", target: "jianghan", kind: "offense", label: "东控江汉", pressure: 70, note: "巴蜀可牵动吴楚上游。" },
      { source: "enemy", target: "chengdu", kind: "threaten", label: "分道压境", pressure: 84, note: "敌若多路并入，蜀险被拆解。" },
    ],
  },
  湖广方舆纪要序: {
    title: "湖广：江汉三要拓扑",
    doctrine: "襄阳、武昌、荆州不是并列点位，而是天下、东南、全楚三层尺度的枢纽。",
    verdict: "襄阳失则东南腰膂折，武昌失则江汉上流危，荆州失则全楚中轴断。",
    nodes: [
      { id: "xiangyang", label: "襄阳", kind: "core", note: "天下腰膂", evidence: "襄阳者，天下之腰膂也" },
      { id: "wuchang", label: "武昌", kind: "gate", note: "东南水要", evidence: "东南得之而存" },
      { id: "jingzhou", label: "荆州", kind: "shield", note: "全楚之中", evidence: "荆州者，全楚之中也" },
      { id: "jianghan", label: "江汉", kind: "route", note: "上流通道", evidence: "江、汉之冲" },
      { id: "zhongyuan", label: "中原", kind: "threat", note: "北方压力", evidence: "中原有之可以并东南" },
    ],
    edges: [
      { source: "xiangyang", target: "wuchang", kind: "control", label: "北控东南", pressure: 92, note: "襄阳陷则武昌不得独安。" },
      { source: "jingzhou", target: "wuchang", kind: "support", label: "上游支撑", pressure: 76, note: "荆州提供楚中纵深。" },
      { source: "jianghan", target: "wuchang", kind: "supply", label: "水路转输", pressure: 82, note: "江汉水道决定东南上流安危。" },
      { source: "zhongyuan", target: "xiangyang", kind: "threaten", label: "中原南压", pressure: 88, note: "北方若据襄阳，东南腰膂即断。" },
    ],
  },
  江西方舆纪要叙: {
    title: "江西：江湖转输拓扑",
    doctrine: "江西不以割据险固见长，而以鄱阳、赣江、长江联络吴楚闽粤，是东南转输节点。",
    verdict: "江西稳，则东南腹地与上游可通；江西乱，则江湖之间的补给和策应断裂。",
    nodes: [
      { id: "jiangxi", label: "江西", kind: "core", note: "江湖枢纽", evidence: "江湖之间" },
      { id: "poyang", label: "鄱阳湖", kind: "route", note: "湖口枢纽", evidence: "鄱阳" },
      { id: "ganjiang", label: "赣江", kind: "route", note: "南北水道", evidence: "江湖" },
      { id: "wuchang", label: "武昌/上游", kind: "gate", note: "楚地上游", evidence: "承接吴楚" },
      { id: "fujian", label: "闽粤", kind: "resource", note: "东南侧翼", evidence: "闽粤" },
      { id: "cutoff", label: "江湖断裂", kind: "threat", note: "转输风险", evidence: "转输" },
    ],
    edges: [
      { source: "poyang", target: "jiangxi", kind: "supply", label: "湖口汇流", pressure: 82, note: "鄱阳湖决定江西水上调度能力。" },
      { source: "ganjiang", target: "jiangxi", kind: "supply", label: "南北转输", pressure: 76, note: "赣江贯通腹地和江口。" },
      { source: "jiangxi", target: "wuchang", kind: "support", label: "上游策应", pressure: 70, note: "江西可支撑江汉上游联络。" },
      { source: "fujian", target: "jiangxi", kind: "support", label: "闽粤侧翼", pressure: 64, note: "江西兼作东南内陆纽带。" },
      { source: "cutoff", target: "poyang", kind: "threaten", label: "水道断裂", pressure: 62, note: "江湖线断则转输体系失效。" },
    ],
  },
  浙江方舆纪要叙: {
    title: "浙江：钱塘海防拓扑",
    doctrine: "浙江是东南资储和海防节点，强在钱塘都会、海道门户和富庶供给，弱在局促不能独任天下攻守。",
    verdict: "浙江可厚东南之资，不宜孤立成国；必须与江淮、福建海防互为表里。",
    nodes: [
      { id: "zhejiang", label: "浙江", kind: "core", note: "东南资储", evidence: "东南资储" },
      { id: "hangzhou", label: "杭州/钱塘", kind: "base", note: "钱塘都会", evidence: "钱塘" },
      { id: "ningbo", label: "宁波", kind: "gate", note: "海道门户", evidence: "海防门户" },
      { id: "jianghuai", label: "江淮", kind: "route", note: "北向联络", evidence: "东南" },
      { id: "wealth", label: "财赋", kind: "resource", note: "富庶资粮", evidence: "财赋" },
      { id: "sea", label: "海上扰动", kind: "threat", note: "沿海风险", evidence: "海防" },
    ],
    edges: [
      { source: "hangzhou", target: "zhejiang", kind: "control", label: "都会聚合", pressure: 78, note: "杭州聚合浙江政治与财赋。" },
      { source: "ningbo", target: "zhejiang", kind: "support", label: "海门守御", pressure: 72, note: "宁波线决定浙江外海安全。" },
      { source: "wealth", target: "zhejiang", kind: "supply", label: "财赋供给", pressure: 84, note: "浙江战略价值首先体现在资储。" },
      { source: "zhejiang", target: "jianghuai", kind: "support", label: "东南联络", pressure: 68, note: "浙江必须接入江淮体系才有大局意义。" },
      { source: "sea", target: "ningbo", kind: "threaten", label: "海防压力", pressure: 66, note: "海上扰动会直压浙江门户。" },
    ],
  },
  福建方舆纪要叙: {
    title: "福建：山海隔绝拓扑",
    doctrine: "福建的地缘逻辑是山海双重结构：内以山岭自保，外以海道通达，风险也从海岛和闽粤边界进入。",
    verdict: "福建可以自保一隅，但若海道失控或山路被断，则内外互援不足。",
    nodes: [
      { id: "fujian", label: "福建", kind: "core", note: "闽中山海", evidence: "山海阻隔" },
      { id: "fuzhou", label: "福州", kind: "base", note: "闽中都会", evidence: "闽中都会" },
      { id: "quanzhou", label: "泉州", kind: "gate", note: "海路门户", evidence: "海路门户" },
      { id: "mountains", label: "闽山", kind: "shield", note: "内陆屏障", evidence: "山海" },
      { id: "guangdong", label: "闽粤通道", kind: "route", note: "南向边路", evidence: "闽粤" },
      { id: "islands", label: "海岛扰动", kind: "threat", note: "外海风险", evidence: "岛屿" },
    ],
    edges: [
      { source: "mountains", target: "fujian", kind: "support", label: "山岭自保", pressure: 80, note: "山岭提供强防御，但削弱机动。" },
      { source: "quanzhou", target: "fujian", kind: "supply", label: "海道通达", pressure: 70, note: "泉州海路让福建不只是闭塞山地。" },
      { source: "fuzhou", target: "fujian", kind: "control", label: "闽中聚合", pressure: 72, note: "福州承担内政和海防调度。" },
      { source: "fujian", target: "guangdong", kind: "support", label: "闽粤联络", pressure: 58, note: "南向通道决定岭南侧翼。" },
      { source: "islands", target: "quanzhou", kind: "threaten", label: "海岛扰路", pressure: 69, note: "岛屿风险首先冲击海路门户。" },
    ],
  },
  广东方舆纪要叙: {
    title: "广东：岭南海口拓扑",
    doctrine: "广东远离中原主战场，但以岭南北门、广州海口和交广通道控制南疆与海路。",
    verdict: "广东的战略意义不在北争天下，而在稳定岭南、接海路、控南徼。",
    nodes: [
      { id: "guangdong", label: "广东", kind: "core", note: "岭南门户", evidence: "岭南" },
      { id: "guangzhou", label: "广州", kind: "base", note: "南海都会", evidence: "岭南都会" },
      { id: "shaoguan", label: "韶关", kind: "gate", note: "岭南北门", evidence: "岭南北门" },
      { id: "sea", label: "海口", kind: "route", note: "海道贸易", evidence: "海口" },
      { id: "jiaozhi", label: "交趾", kind: "threat", note: "南徼压力", evidence: "交广" },
      { id: "wealth", label: "南越旧地", kind: "resource", note: "岭南资储", evidence: "南越" },
    ],
    edges: [
      { source: "guangzhou", target: "guangdong", kind: "control", label: "都会聚合", pressure: 80, note: "广州聚合岭南政治、财赋与海路。" },
      { source: "shaoguan", target: "guangdong", kind: "support", label: "北门守御", pressure: 76, note: "韶关线决定广东与内地的门户安全。" },
      { source: "sea", target: "guangdong", kind: "supply", label: "海路通达", pressure: 72, note: "海口让广东成为南海通道。" },
      { source: "jiaozhi", target: "guangdong", kind: "threaten", label: "南徼牵制", pressure: 68, note: "交趾方向影响岭南安定。" },
      { source: "wealth", target: "guangdong", kind: "supply", label: "岭南资储", pressure: 66, note: "南越旧地提供地方支撑。" },
    ],
  },
  广西方舆纪要叙: {
    title: "广西：西南边徼拓扑",
    doctrine: "广西是湖广、广东、云南、交趾之间的山路扣合点，治理难点在诸峒和边徼通道。",
    verdict: "广西若稳，则岭南西路可通；广西若乱，则西南与交广互相牵动。",
    nodes: [
      { id: "guangxi", label: "广西", kind: "core", note: "西南扣合", evidence: "通西南、制交趾" },
      { id: "guilin", label: "桂林", kind: "base", note: "山水要地", evidence: "广西山水要地" },
      { id: "nanning", label: "南宁", kind: "gate", note: "通交广门户", evidence: "通交广门户" },
      { id: "yunnan", label: "云南", kind: "route", note: "西向联络", evidence: "云南" },
      { id: "jiaozhi", label: "交趾", kind: "threat", note: "南疆压力", evidence: "交趾" },
      { id: "dong", label: "诸峒", kind: "shield", note: "羁縻治理", evidence: "安诸峒" },
    ],
    edges: [
      { source: "guilin", target: "guangxi", kind: "control", label: "山地聚合", pressure: 72, note: "桂林聚合北部山路和岭南西路。" },
      { source: "nanning", target: "guangxi", kind: "support", label: "南门守御", pressure: 74, note: "南宁线决定通交趾的边防弹性。" },
      { source: "guangxi", target: "yunnan", kind: "support", label: "西向联络", pressure: 62, note: "广西连接云南，形成西南横向通道。" },
      { source: "jiaozhi", target: "nanning", kind: "threaten", label: "交趾压力", pressure: 70, note: "交趾方向首先压迫南宁门户。" },
      { source: "dong", target: "guangxi", kind: "support", label: "羁縻稳定", pressure: 68, note: "诸峒治理决定广西内部稳定。" },
    ],
  },
  云南方舆纪要序: {
    title: "云南：西南远驭拓扑",
    doctrine: "云南处西南极边，价值在于滇中核心、滇西旧国、黔桂通道和外夷边防的远程控制。",
    verdict: "云南不能作化外看待；不控滇黔桂缅通道，西南边防就失去纵深。",
    nodes: [
      { id: "yunnan", label: "云南", kind: "core", note: "西南极边", evidence: "不能只作化外看待" },
      { id: "kunming", label: "昆明", kind: "base", note: "滇中核心", evidence: "滇中核心" },
      { id: "dali", label: "大理", kind: "base", note: "西向旧国", evidence: "西南旧国根本" },
      { id: "guizhou", label: "贵州", kind: "route", note: "黔中入滇", evidence: "滇黔" },
      { id: "myanmar", label: "缅甸/外夷", kind: "threat", note: "西南边患", evidence: "边防" },
      { id: "guangxi", label: "广西", kind: "gate", note: "东南侧门", evidence: "连接滇黔、巴蜀、交趾" },
    ],
    edges: [
      { source: "kunming", target: "yunnan", kind: "control", label: "滇中聚合", pressure: 82, note: "昆明是云南行政与军防核心。" },
      { source: "dali", target: "yunnan", kind: "support", label: "滇西支撑", pressure: 70, note: "大理线提供西向纵深。" },
      { source: "guizhou", target: "yunnan", kind: "supply", label: "黔滇通道", pressure: 76, note: "黔中通道决定中原能否远驭云南。" },
      { source: "myanmar", target: "dali", kind: "threaten", label: "外夷边压", pressure: 78, note: "西南外压会先触动滇西。" },
      { source: "guangxi", target: "yunnan", kind: "support", label: "桂滇互援", pressure: 64, note: "广西是云南东南侧翼。" },
    ],
  },
  贵州方舆纪要叙: {
    title: "贵州：西南锁钥拓扑",
    doctrine: "贵州不是富庶腹地，而是四川、湖广、云南、广西之间的山地锁钥。",
    verdict: "贵州稳则西南诸路相通，贵州乱则川楚滇桂彼此隔断。",
    nodes: [
      { id: "guizhou", label: "贵州", kind: "core", note: "西南锁钥", evidence: "西南通道的锁钥" },
      { id: "guiyang", label: "贵阳", kind: "base", note: "黔中核心", evidence: "黔中核心" },
      { id: "zunyi", label: "遵义", kind: "gate", note: "川黔通道", evidence: "川黔通道" },
      { id: "huguang", label: "湖广", kind: "route", note: "东向出口", evidence: "川楚" },
      { id: "yunnan", label: "云南", kind: "route", note: "西向联络", evidence: "滇黔" },
      { id: "miao", label: "苗疆", kind: "threat", note: "山地治理", evidence: "苗疆" },
    ],
    edges: [
      { source: "guiyang", target: "guizhou", kind: "control", label: "黔中聚合", pressure: 78, note: "贵阳承担贵州山地通道调度。" },
      { source: "zunyi", target: "guizhou", kind: "support", label: "川黔锁钥", pressure: 76, note: "遵义线连接四川，是北向门户。" },
      { source: "guizhou", target: "huguang", kind: "support", label: "东向楚路", pressure: 66, note: "湖广方向决定贵州与内地联络。" },
      { source: "guizhou", target: "yunnan", kind: "support", label: "西向滇路", pressure: 68, note: "贵州是远驭云南的中继。" },
      { source: "miao", target: "guizhou", kind: "threaten", label: "山地扰动", pressure: 72, note: "苗疆不稳，山路交通和羁縻治理受阻。" },
    ],
  },
};

const specificModels = Object.fromEntries(Object.entries(models).map(([title, seed]) => [title, makeModel(seed)])) as Record<string, TopologyModel>;

export function getTopologyModel(section: FangyuSection): TopologyModel {
  const specific = specificModels[section.title];
  if (specific) return specific;

  const core = section.title.replace("方舆纪要", "").replace("序", "").replace("叙", "");
  return makeModel({
    title: `${core}总论拓扑`,
    doctrine: section.analysis.thesis,
    verdict: section.analysis.summary,
    nodes: [
      { id: "core", label: core, kind: "core", note: "论证核心", evidence: section.analysis.thesis },
      { id: "form", label: "形势", kind: "route", note: "变动之法", evidence: "形势" },
      { id: "domain", label: "州域", kind: "base", note: "疆理之迹", evidence: "州域" },
      { id: "risk", label: "治乱", kind: "threat", note: "成败之机", evidence: "治乱" },
    ],
    edges: [
      { source: "form", target: "core", kind: "control", label: "形势制衡", pressure: section.analysis.strategicWeight, note: "形势决定州域如何被使用。" },
      { source: "domain", target: "core", kind: "support", label: "疆域承载", pressure: section.analysis.defensibility, note: "疆域提供制度和空间边界。" },
      { source: "risk", target: "core", kind: "threaten", label: "治乱转化", pressure: section.analysis.risk, note: "治乱会重塑地缘格局。" },
    ],
  });
}

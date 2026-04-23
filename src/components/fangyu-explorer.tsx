"use client";

import "@xyflow/react/dist/style.css";
import dynamic from "next/dynamic";
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { BookOpenText, BrainCircuit, ExternalLink, GitBranch, Map, Search, Sparkles, Timer } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { clsx } from "clsx";
import type { EChartsOption } from "echarts";
import type { ComponentType } from "react";
import type { FangyuSection } from "@/lib/fangyu-data";
import { getTopologyModel, type TopologyEdgeKind, type TopologyNodeKind } from "@/lib/geostrategy-topology";
import { getModernRegion } from "@/lib/place-modern";
import { useExplorerStore, type ExplorerView } from "@/lib/explorer-store";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

type FangyuExplorerProps = {
  sections: FangyuSection[];
};

const viewItems: Array<{ id: ExplorerView; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: "map", label: "地理", icon: Map },
  { id: "topology", label: "推演", icon: BrainCircuit },
  { id: "graph", label: "关系", icon: GitBranch },
  { id: "timeline", label: "形势", icon: Timer },
  { id: "text", label: "原文", icon: BookOpenText },
];

function ModernRegionLine({ name }: { name: string }) {
  const region = getModernRegionLabel(name);
  if (!region) return null;

  return <p className="mt-0.5 text-xs leading-5 text-[#8a5d3b]">今：{region}</p>;
}

function getModernRegionLabel(name: string) {
  return getModernRegion(name)?.replace(/^今[：:\s]*/, "");
}

function GitHubLink() {
  return (
    <a
      href="https://github.com/msh01/fangyu-geo"
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub 仓库"
      title="GitHub 仓库"
      className="inline-flex h-10 items-center justify-center gap-2 border border-[#cfcbbf] bg-white px-3 text-sm text-[#30342f] transition hover:border-[#769173] hover:bg-[#eef3ea]"
    >
      <ExternalLink size={16} />
      GitHub 仓库
    </a>
  );
}

export function FangyuExplorer({ sections }: FangyuExplorerProps) {
  const query = useExplorerStore((state) => state.query);
  const selectedId = useExplorerStore((state) => state.selectedId);
  const view = useExplorerStore((state) => state.view);
  const setQuery = useExplorerStore((state) => state.setQuery);
  const setSelectedId = useExplorerStore((state) => state.setSelectedId);
  const setView = useExplorerStore((state) => state.setView);

  useEffect(() => {
    if (!selectedId && sections[1]) {
      setSelectedId(sections[1].id);
    }
  }, [sections, selectedId, setSelectedId]);

  const filteredSections = useMemo(() => {
    const keyword = query.trim();
    if (!keyword) return sections;
    return sections.filter((section) => {
      const haystack = [
        section.title,
        section.displayTitle,
        section.text,
        section.analysis.summary,
        section.analysis.thesis,
        ...section.analysis.themes,
        ...section.analysis.periods,
        ...section.analysis.places.map((place) => `${place.name}${place.role}`),
      ].join("\n");
      return haystack.includes(keyword);
    });
  }, [query, sections]);

  const selected = sections.find((section) => section.id === selectedId) ?? sections[1] ?? sections[0];

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#202320]">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <aside className="border-b border-[#dad7cb] bg-[#fbfaf6] xl:border-b-0 xl:border-r">
          <div className="px-5 py-5">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#7a3c2e]">Fangyu Geo</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#171916]">读史方舆纪要</h1>
            <div className="mt-5 flex h-11 items-center gap-2 border border-[#cfcbbf] bg-white px-3">
              <Search size={17} className="text-[#7b7d74]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#94978d]"
                placeholder="地名、朝代、论点"
              />
            </div>
          </div>

          <nav className="max-h-[42vh] overflow-y-auto border-t border-[#e2dfd3] xl:max-h-[calc(100vh-166px)]">
            {filteredSections.map((section) => {
              const active = section.id === selected.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedId(section.id)}
                  className={clsx(
                    "grid w-full grid-cols-[38px_minmax(0,1fr)] gap-3 border-b border-[#e9e5da] px-5 py-4 text-left transition",
                    active ? "bg-[#23382f] text-white" : "bg-transparent hover:bg-[#eef3ea]",
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-8 w-8 items-center justify-center border font-mono text-xs",
                      active ? "border-[#d1a15f] text-[#f2c77d]" : "border-[#cfcbbf] text-[#7a3c2e]",
                    )}
                  >
                    {section.order}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{section.displayTitle}</span>
                    <span className={clsx("mt-1 block truncate text-xs", active ? "text-[#d7dfd7]" : "text-[#777a72]")}>
                      {section.analysis.thesis}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-col gap-5 border-b border-[#dad7cb] bg-[#fdfcf8] px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-sm text-[#7a3c2e]">{selected.analysis.posture}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#171916] md:text-4xl">
                {selected.displayTitle}
              </h2>
            </div>
            <div className="grid grid-cols-5 gap-2 lg:w-[520px]">
              {viewItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    title={item.label}
                    className={clsx(
                      "flex h-12 items-center justify-center gap-2 border text-sm font-medium transition",
                      view === item.id
                        ? "border-[#b84b36] bg-[#b84b36] text-white"
                        : "border-[#cfcbbf] bg-white text-[#30342f] hover:border-[#769173]",
                    )}
                  >
                    <Icon size={17} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-[640px] p-4 md:p-6">
            {view === "map" && <StrategyMap sections={sections} selected={selected} onSelect={setSelectedId} />}
            {view === "topology" && <TopologySimulation section={selected} />}
            {view === "graph" && <RelationGraph section={selected} />}
            {view === "timeline" && <TimelineView sections={sections} selected={selected} />}
            {view === "text" && <TextView section={selected} query={query} />}
          </div>
          <footer className="flex justify-center border-t border-[#dad7cb] bg-[#fdfcf8] px-5 py-5">
            <GitHubLink />
          </footer>
        </section>

        <aside className="border-t border-[#dad7cb] bg-[#fbfaf6] xl:border-l xl:border-t-0">
          <AnalysisPanel section={selected} />
        </aside>
      </div>
    </main>
  );
}

function AnalysisPanel({ section }: { section: FangyuSection }) {
  const metrics = [
    ["权重", section.analysis.strategicWeight],
    ["守势", section.analysis.defensibility],
    ["机动", section.analysis.mobility],
    ["风险", section.analysis.risk],
  ] as const;

  return (
    <div className="sticky top-0 max-h-screen overflow-y-auto px-5 py-5">
      <div className="flex items-center gap-2 text-[#7a3c2e]">
        <Sparkles size={17} />
        <p className="font-mono text-sm uppercase tracking-[0.2em]">Digest</p>
      </div>
      <p className="mt-5 text-lg leading-8 text-[#252924]">{section.analysis.summary}</p>

      <div className="mt-6 border-y border-[#dad7cb] py-5">
        <p className="text-sm text-[#777a72]">核心判断</p>
        <p className="mt-2 text-2xl font-semibold leading-snug text-[#171916]">{section.analysis.thesis}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="border border-[#dad7cb] bg-white p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[#777a72]">{label}</span>
              <span className="font-mono text-xl text-[#23382f]">{value}</span>
            </div>
            <div className="mt-3 h-1.5 bg-[#ece7dc]">
              <div className="h-full bg-[#769173]" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm text-[#777a72]">主题</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {section.analysis.themes.map((theme) => (
            <span key={theme} className="border border-[#cfcbbf] bg-white px-2.5 py-1 text-sm text-[#30342f]">
              {theme}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-[#777a72]">地理节点</p>
        <div className="mt-3 space-y-3">
          {section.analysis.places.map((place) => (
            <div key={place.name} className="border-l-2 border-[#b84b36] bg-white px-3 py-2">
              <p className="font-medium text-[#171916]">{place.name}</p>
              <ModernRegionLine name={place.name} />
              <p className="mt-1 text-sm leading-6 text-[#686b64]">{place.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-[#777a72]">原文入口</p>
        <p className="mt-2 text-sm leading-7 text-[#555951]">{section.excerpt}...</p>
      </div>
    </div>
  );
}

function StrategyMap({
  sections,
  selected,
  onSelect,
}: {
  sections: FangyuSection[];
  selected: FangyuSection;
  onSelect: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: sections.flatMap((section) =>
        section.analysis.places.map((place) => ({
          type: "Feature" as const,
          properties: {
            sectionId: section.id,
            title: section.displayTitle,
            name: place.name,
            role: place.role,
            active: section.id === selected.id,
          },
          geometry: {
            type: "Point" as const,
            coordinates: place.coordinates,
          },
        })),
      ),
    }),
    [sections, selected.id],
  );

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const maplibregl = await import("maplibre-gl");
      if (!mounted || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        center: [108.5, 33.8],
        zoom: 3.45,
        minZoom: 2.6,
        maxZoom: 8,
        attributionControl: false,
        style: {
          version: 8,
          sources: {
            "topographic-base": {
              type: "raster",
              tiles: [
                "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
                "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
                "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors, SRTM | © OpenTopoMap",
            },
            "terrain-dem": {
              type: "raster-dem",
              tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
              tileSize: 256,
              encoding: "terrarium",
              attribution: "Terrain tiles by AWS Open Data Terrain Tiles",
            },
          },
          layers: [
            { id: "background", type: "background", paint: { "background-color": "#e8eadf" } },
            {
              id: "topographic-base",
              type: "raster",
              source: "topographic-base",
              paint: {
                "raster-opacity": 0.96,
                "raster-saturation": -0.18,
                "raster-contrast": 0.08,
              },
            },
            {
              id: "terrain-hillshade",
              type: "hillshade",
              source: "terrain-dem",
              paint: {
                "hillshade-exaggeration": 0.45,
                "hillshade-shadow-color": "#4f584e",
                "hillshade-highlight-color": "#fff7e2",
                "hillshade-accent-color": "#7d6f4f",
              },
            },
          ],
        },
      });

      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
      map.on("load", () => {
        map.addSource("places", { type: "geojson", data: geojson });
        map.addLayer({
          id: "place-halo",
          type: "circle",
          source: "places",
          paint: {
            "circle-radius": ["case", ["get", "active"], 17, 10],
            "circle-color": ["case", ["get", "active"], "#b84b36", "#769173"],
            "circle-opacity": 0.2,
          },
        });
        map.addLayer({
          id: "place-point",
          type: "circle",
          source: "places",
          paint: {
            "circle-radius": ["case", ["get", "active"], 8, 5],
            "circle-color": ["case", ["get", "active"], "#b84b36", "#23382f"],
            "circle-stroke-color": "#fffaf0",
            "circle-stroke-width": 2,
          },
        });
        map.addLayer({
          id: "place-label",
          type: "symbol",
          source: "places",
          layout: {
            "text-field": ["get", "name"],
            "text-size": 13,
            "text-offset": [0, 1.2],
            "text-anchor": "top",
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#202320",
            "text-halo-color": "#f7f7f4",
            "text-halo-width": 2,
          },
        });
        map.on("click", "place-point", (event) => {
          const feature = event.features?.[0];
          const sectionId = feature?.properties?.sectionId;
          if (typeof sectionId === "string") onSelect(sectionId);
        });
        map.on("mouseenter", "place-point", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "place-point", () => {
          map.getCanvas().style.cursor = "";
        });
      });
    }

    initMap();
    return () => {
      mounted = false;
    };
  }, [geojson, onSelect]);

  useEffect(() => {
    const source = mapRef.current?.getSource("places");
    if (source && "setData" in source) {
      (source as import("maplibre-gl").GeoJSONSource).setData(geojson);
    }
    const firstPlace = selected.analysis.places[0];
    if (firstPlace) {
      mapRef.current?.easeTo({ center: firstPlace.coordinates, zoom: 4.4, duration: 650 });
    }
  }, [geojson, selected]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="h-[620px] overflow-hidden border border-[#cfcbbf] bg-[#e8eadf]">
        <div ref={containerRef} className="h-full w-full" />
      </div>
      <div className="border border-[#dad7cb] bg-white p-4">
        <p className="font-mono text-sm text-[#7a3c2e]">Geo Nodes</p>
        <div className="mt-4 space-y-3">
          {selected.analysis.places.map((place) => (
            <div key={place.name} className="border-b border-[#eee8dd] pb-3 last:border-b-0">
              <p className="font-medium">{place.name}</p>
              <ModernRegionLine name={place.name} />
              <p className="mt-1 text-sm leading-6 text-[#63675f]">{place.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RelationGraph({ section }: { section: FangyuSection }) {
  const nodes = useMemo<Node[]>(() => {
    const placeNodes = section.analysis.places.map((place, index) => ({
      id: `place-${place.name}`,
      position: { x: 40 + index * 190, y: 290 },
      data: { label: place.name },
      style: {
        border: "1px solid #769173",
        background: "#f8fbf4",
        color: "#202320",
        width: 128,
      },
    }));

    const themeNodes = section.analysis.themes.slice(0, 5).map((theme, index) => ({
      id: `theme-${theme}`,
      position: { x: 20 + index * 160, y: 40 },
      data: { label: theme },
      style: {
        border: "1px solid #b84b36",
        background: "#fff8f0",
        color: "#202320",
        width: 118,
      },
    }));

    return [
      {
        id: "section",
        position: { x: 280, y: 160 },
        data: { label: section.displayTitle },
        style: {
          border: "2px solid #23382f",
          background: "#23382f",
          color: "white",
          width: 190,
          fontWeight: 700,
        },
      },
      ...themeNodes,
      ...placeNodes,
    ];
  }, [section]);

  const edges = useMemo<Edge[]>(
    () =>
      nodes
        .filter((node) => node.id !== "section")
        .map((node) => ({
          id: `section-${node.id}`,
          source: "section",
          target: node.id,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: node.id.startsWith("theme") ? "#b84b36" : "#769173" },
        })),
    [nodes],
  );

  return (
    <div className="h-[620px] border border-[#cfcbbf] bg-white">
      <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.45} maxZoom={1.4}>
        <Background color="#d7d3c6" gap={28} />
        <MiniMap nodeColor={(node) => (node.id === "section" ? "#23382f" : "#769173")} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

const nodeStyleByKind: Record<TopologyNodeKind, { fill: string; border: string; label: string }> = {
  core: { fill: "#1559c7", border: "#6f7876", label: "权御核心" },
  shield: { fill: "#c92b22", border: "#6f7876", label: "屏障" },
  gate: { fill: "#d33a2c", border: "#6f7876", label: "门户/关隘" },
  base: { fill: "#edaa32", border: "#6f7876", label: "陪都/根本" },
  route: { fill: "#6f38b8", border: "#6f7876", label: "通道" },
  threat: { fill: "#a52a22", border: "#6f7876", label: "外部威胁" },
  resource: { fill: "#769173", border: "#6f7876", label: "资储" },
};

const edgeStyleByKind: Record<TopologyEdgeKind, { color: string; dash?: string; label: string }> = {
  control: { color: "#1559c7", label: "战略压制" },
  support: { color: "#6f38b8", label: "形势支援" },
  threaten: { color: "#c92b22", dash: "7 7", label: "地缘威胁" },
  supply: { color: "#769173", label: "粮道/水道" },
  offense: { color: "#b84b36", label: "进取路线" },
};

function TopologySimulation({ section }: { section: FangyuSection }) {
  const model = useMemo(() => getTopologyModel(section), [section]);

  const nodes = useMemo<Node[]>(
    () =>
      model.nodes.map((node) => {
        const style = nodeStyleByKind[node.kind];
        const size = node.kind === "core" ? 86 : 72;
        const modernRegion = getModernRegionLabel(node.label);
        return {
          id: node.id,
          position: { x: node.x, y: node.y },
          data: {
            label: (
              <div className="group relative flex flex-col items-center gap-1" title={modernRegion ? `今：${modernRegion}` : undefined}>
                <span className="font-mono text-[11px] text-black/70">{node.kind}</span>
                <strong className="text-base">{node.label}</strong>
                <span className="max-w-[120px] truncate text-[11px] opacity-80">{node.note}</span>
                {modernRegion && (
                  <span className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap border border-[#cfcbbf] bg-[#fffdf7] px-2.5 py-1 text-xs font-medium text-[#30342f] opacity-0 shadow-sm transition group-hover:opacity-100">
                    今：{modernRegion}
                  </span>
                )}
              </div>
            ),
          },
          style: {
            width: size,
            height: size,
            borderRadius: 999,
            border: `4px solid ${style.border}`,
            background: style.fill,
            color: node.kind === "core" || node.kind === "threat" || node.kind === "route" ? "white" : "#171916",
            boxShadow: node.kind === "core" ? "0 0 0 8px rgba(21, 89, 199, 0.22)" : "0 0 0 4px rgba(32, 35, 32, 0.08)",
            fontWeight: 600,
          },
        };
      }),
    [model],
  );

  const edges = useMemo<Edge[]>(
    () =>
      model.edges.map((edge) => {
        const style = edgeStyleByKind[edge.kind];
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: `${edge.label} (${edge.pressure}%)`,
          markerEnd: { type: MarkerType.ArrowClosed, color: style.color },
          animated: edge.kind === "threaten" || edge.kind === "offense",
          style: {
            stroke: style.color,
            strokeWidth: 3,
            strokeDasharray: style.dash,
          },
          labelStyle: {
            fill: "#f7f7f4",
            fontWeight: 700,
          },
          labelBgStyle: {
            fill: style.color,
            fillOpacity: 0.92,
          },
          labelBgPadding: [5, 3],
        };
      }),
    [model],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="overflow-hidden border border-[#cfcbbf] bg-[#e9edf4] p-4">
        <div className="flex items-start justify-between gap-4 px-1 pb-4">
          <div>
            <p className="font-mono text-sm text-[#7a3c2e]">Topology Simulation</p>
            <h3 className="mt-1 text-2xl font-semibold">{model.title}</h3>
          </div>
          <div className="text-right text-sm leading-6 text-[#30342f]">
            <p>分析维度</p>
            <p className="font-semibold">地缘战略</p>
          </div>
        </div>
        <div className="h-[600px] rounded-[8px] border border-[#d9dce4] bg-white">
          <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.45} maxZoom={1.55} nodesDraggable>
            <Background color="#d7dce5" gap={32} />
            <MiniMap nodeColor={(node) => {
              const modelNode = model.nodes.find((item) => item.id === node.id);
              return modelNode ? nodeStyleByKind[modelNode.kind].fill : "#769173";
            }} />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <div className="border border-[#dad7cb] bg-white p-4">
        <p className="font-mono text-sm text-[#7a3c2e]">Deduction</p>
        <p className="mt-3 text-lg font-semibold leading-8">{model.doctrine}</p>
        <p className="mt-4 border-l-2 border-[#b84b36] bg-[#fbfaf6] px-3 py-2 text-sm leading-7 text-[#555951]">
          {model.verdict}
        </p>

        <div className="mt-5">
          <p className="text-sm text-[#777a72]">拓扑角色</p>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {Object.entries(nodeStyleByKind).map(([kind, item]) => (
              <div key={kind} className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ background: item.fill }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-[#777a72]">边关系</p>
          <div className="mt-3 space-y-3">
            {model.edges.map((edge) => {
              const edgeStyle = edgeStyleByKind[edge.kind];
              return (
                <div key={edge.id} className="border-b border-[#eee8dd] pb-3 last:border-b-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{edgeStyle.label}</span>
                    <span className="font-mono text-sm text-[#7a3c2e]">{edge.pressure}%</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#63675f]">{edge.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineView({ sections, selected }: { sections: FangyuSection[]; selected: FangyuSection }) {
  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: "transparent",
      color: ["#23382f", "#b84b36", "#769173", "#d1a15f"],
      textStyle: { fontFamily: "LXGW WenKai, 霞鹜文楷, Microsoft YaHei, sans-serif" },
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { color: "#30342f" } },
      grid: { left: 42, right: 24, top: 36, bottom: 72 },
      xAxis: {
        type: "category",
        data: sections.map((section) => section.displayTitle.replace("地缘形势", "")),
        axisLabel: { rotate: 45, color: "#555951", interval: 0 },
        axisLine: { lineStyle: { color: "#aaa597" } },
      },
      yAxis: {
        type: "value",
        max: 100,
        axisLabel: { color: "#555951" },
        splitLine: { lineStyle: { color: "#e2ded2" } },
      },
      series: [
        {
          name: "权重",
          type: "bar",
          data: sections.map((section) => section.analysis.strategicWeight),
        },
        {
          name: "守势",
          type: "line",
          smooth: true,
          data: sections.map((section) => section.analysis.defensibility),
        },
        {
          name: "机动",
          type: "line",
          smooth: true,
          data: sections.map((section) => section.analysis.mobility),
        },
        {
          name: "风险",
          type: "line",
          smooth: true,
          data: sections.map((section) => section.analysis.risk),
        },
      ],
    }),
    [sections],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="h-[620px] border border-[#cfcbbf] bg-white p-3">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </div>
      <div className="border border-[#dad7cb] bg-white p-4">
        <p className="font-mono text-sm text-[#7a3c2e]">Signal</p>
        <div className="mt-5 space-y-4">
          {[
            ["权重", selected.analysis.strategicWeight],
            ["守势", selected.analysis.defensibility],
            ["机动", selected.analysis.mobility],
            ["风险", selected.analysis.risk],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-mono">{value}</span>
              </div>
              <div className="mt-2 h-2 bg-[#eee8dd]">
                <div className="h-full bg-[#b84b36]" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TextView({ section, query }: { section: FangyuSection; query: string }) {
  const paragraphs = useMemo(() => {
    const chunks = section.text.split(/(?<=[。？！])(?=.{24,})/u);
    const keyword = query.trim();
    return chunks.map((chunk, index) => {
      if (!keyword || !chunk.includes(keyword)) {
        return <p key={index}>{chunk}</p>;
      }

      const parts = chunk.split(keyword);
      return (
        <p key={index}>
          {parts.map((part, partIndex) => (
            <span key={`${index}-${partIndex}`}>
              {part}
              {partIndex < parts.length - 1 && <mark>{keyword}</mark>}
            </span>
          ))}
        </p>
      );
    });
  }, [query, section.text]);

  return (
    <article className="border border-[#cfcbbf] bg-white px-5 py-6 md:px-10 md:py-9">
      <div className="prose-fangyu">{paragraphs}</div>
    </article>
  );
}

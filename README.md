# Fangyu Geo

《读史方舆纪要》各区域序的历史地理可视化阅读界面。

## 开发

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

## 当前能力

- 从仓库根目录的 `读史方舆纪要-各区域序.md` 服务端读取原文。
- 将 17 篇序拆成结构化 section。
- 为每篇序提供第一版可审计 digest：核心论点、战略姿态、地理节点、主题、朝代线索和四项形势指标。
- 提供四种视图：地理图、关系图、形势图、原文阅读。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- MapLibre GL JS
- React Flow
- Apache ECharts
- Zustand

## 后续 AI 接入

当前 digest 位于 `src/lib/fangyu-data.ts`。后续可以把这层替换为 OpenAI Structured Outputs 生成的 JSON，并保留同一套前端数据结构。

"use client";

import { create } from "zustand";

export type ExplorerView = "map" | "topology" | "graph" | "timeline" | "text";

type ExplorerState = {
  query: string;
  selectedId: string | null;
  view: ExplorerView;
  setQuery: (query: string) => void;
  setSelectedId: (selectedId: string) => void;
  setView: (view: ExplorerView) => void;
};

export const useExplorerStore = create<ExplorerState>((set) => ({
  query: "",
  selectedId: null,
  view: "map",
  setQuery: (query) => set({ query }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setView: (view) => set({ view }),
}));

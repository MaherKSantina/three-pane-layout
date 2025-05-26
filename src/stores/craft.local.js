import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCraftLocalStore = (localStorageName) => create(
  persist(
    (set, get) => ({
      nodes: {},
      setNodes: (nodes) => set({ nodes }),
      reset: () => set({ nodes: {} }),
    }),
    {
      name: localStorageName,
      partialize: (state) => ({ nodes: state.nodes }),
    }
  )
);

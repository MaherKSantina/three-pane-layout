import { create } from "zustand";

export const useApiCraftStore = create((set, get) => ({
  nodes: {},
  setNodes: async (nodes) => {
    set({ nodes });
    // replace this with your real API endpoint
    await fetch("http://localhost:3000/craft-nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes }),
    });
  },
  fetchNodes: async () => {
    const res = await fetch("http://localhost:3000/craft-nodes");
    const data = await res.json();
    set({ nodes: data.nodes });
  },
  reset: () => set({ nodes: {} }),
}));

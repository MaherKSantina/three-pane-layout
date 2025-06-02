import { create } from "zustand";
import { craftNodeToTree } from "../utils/gantthelper";

export function useCraftAggregatedStore() {
  // You probably don't want to pass the source store here. The sync bridge will do the job.
  return create((set, get) => ({
    nodes: {},
    setNodes: (nodes) => {
        console.log(craftNodeToTree("ROOT", nodes))
        set({ nodes })
    },
    reset: () => set({ nodes: {} }),
    loading: false,
    setLoading: (loading) => set({ loading }),
  }));
}
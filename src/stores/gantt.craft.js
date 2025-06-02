import { useEffect } from "react";
import { create } from "zustand";
import { handleCraftTreeWithAsyncNodes } from "../utils/gantthelper";

export function createGanttSyncStore() {
  return create((set) => ({
    tasks: [], 
    links: [],
    setGantt: (data) => set(data),
    fetchData: async () => {
        // No-op for local store
      },
  }));
}

// React effect to sync Craft → Gantt
export function useSyncCraftToGantt(craftStore, ganttStore, craftTreeToGanttData) {
  const nodes = craftStore((state) => state.nodes);
  useEffect(() => {
    const data = craftTreeToGanttData(nodes);
    console.log("Updated!")
    ganttStore.getState().setGantt({tasks: data.tasks, links: data.links});
    
  }, [nodes, ganttStore, craftTreeToGanttData]);
}
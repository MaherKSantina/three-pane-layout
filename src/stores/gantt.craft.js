import { useEffect } from "react";
import { create } from "zustand";

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
    if (nodes && Object.keys(nodes).length > 0) {
      const data = craftTreeToGanttData(nodes);
      console.log("Updated!")
      ganttStore.getState().setGantt({tasks: data.tasks, links: data.links});
    } else {
      ganttStore.getState().setGantt({ tasks: [], links: [] });
    }
  }, [nodes, ganttStore, craftTreeToGanttData]);
}
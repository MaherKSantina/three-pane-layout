import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useGanttLocalStore = (localStorageName) => create(
  persist(
    (set, get) => ({
      tasks: [],
      links: [],

      fetchData: async () => {
        // No-op for local store
      },

      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      addLink: (link) =>
        set((state) => ({ links: [...state.links, link] })),

      deleteLink: (id) =>
        set((state) => ({
          links: state.links.filter((l) => l.id !== id),
        })),
    }),
    {
      name: localStorageName,
      partialize: (state) => ({ tasks: state.tasks, links: state.links }),
    }
  )
);

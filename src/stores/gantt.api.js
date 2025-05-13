import { create } from "zustand";

export const useApiGanttStore = create((set, get) => ({
  tasks: [],
  links: [],
  loading: false,
  hydrated: false,
  error: null,

  fetchData: async () => {
    if (get().hydrated) return; // skip if already hydrated
    set({ loading: true });
    try {
      const res = await fetch("http://localhost:3000/gantt-data");
      const json = await res.json();
      set({
        tasks: json.tasks,
        links: json.links,
        loading: false,
        hydrated: true,
      });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  addTask: async (task) => {
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    set((s) => ({ tasks: [...s.tasks, newTask] }));
  },

  updateTask: async (id, updates) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await get().fetchData()
  },

  deleteTask: async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
    await get().fetchData()
  },

  addLink: async (link) => {
    const res = await fetch("http://localhost:3000/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(link),
    });
    const newLink = await res.json();
    await get().fetchData()
  },

  deleteLink: async (id) => {
    await fetch(`http://localhost:3000/links/${id}`, { method: "DELETE" });
    await get().fetchData()
  },
}));

import { DateTime } from "luxon";
import { create } from "zustand";

export const createApiGanttStore = (projectId) => create((set, get) => ({
  tasks: [],
  links: [],
  loading: false,
  hydrated: false,
  error: null,

  expandedTaskIds: [],
  expand: (id) =>
    set((state) => ({
      expandedTaskIds: state.expandedTaskIds.includes(id)
        ? state.expandedTaskIds
        : [...state.expandedTaskIds, id],
    })),
  collapse: (id) =>
    set((state) => ({
      expandedTaskIds: state.expandedTaskIds.filter((tid) => tid !== id),
    })),

  fetchData: async () => {
    if (get().hydrated) return; // skip if already hydrated
    set({ loading: true });
    try {
      const res = await fetch(`http://localhost:3000/project/${projectId}/gantt-data`);
      const json = await res.json();
      for(let t of json.tasks) {
        if(t.start_date) {
          t.start_date = new Date(t.start_date)
        }

        if(t.end_date) {
          t.end_date = new Date(t.end_date)
        }
      }
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
    await fetch(`http://localhost:3000/project/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    set({hydrated: false})
    await get().fetchData()
  },

  getTask: async (taskId) => {
    const res = await fetch(`http://localhost:3000/project/${projectId}/tasks/${taskId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    return json
  },

  updateTask: async (id, updates) => {
    await fetch(`http://localhost:3000/project/${projectId}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    set({hydrated: false})
    await get().fetchData();
  },

  deleteTask: async (id) => {
    await fetch(`http://localhost:3000/project/${projectId}/tasks/${id}`, { method: "DELETE" });
    set({hydrated: false})
    await get().fetchData();
  },

  addLink: async (link) => {
    const res = await fetch(`http://localhost:3000/project/${projectId}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(link),
    });
    await res.json();
    set({hydrated: false})
    await get().fetchData();
  },

  deleteLink: async (id) => {
    await fetch(`http://localhost:3000/project/${projectId}/links/${id}`, { method: "DELETE" });
    set({hydrated: false})
    await get().fetchData();
  },
  updateTaskOrder: async ({ id, before, after }) => {
    await fetch(`http://localhost:3000/project/${projectId}/tasks/update-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, before, after }),
    });
    set({hydrated: false})
    await get().fetchData();
  }
}));
import { create } from "zustand";

export const useCalendarApiStore = create((set, get) => ({
  events: [],
  fetchEvents: async () => {
    const res = await fetch("http://localhost:3000/calendar-tasks");
    const data = await res.json();
    set({ events: data });
  },
  addEvent: async (event) => {
    const res = await fetch("http://localhost:3000/calendar-tasks", {
      method: "POST",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    await get().fetchEvents()
  },
  updateEvent: async (id, updates) => {
    await fetch(`http://localhost:3000/calendar-tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
      headers: { "Content-Type": "application/json" },
    });
    await get().fetchEvents()
  },
  deleteEvent: async (id) => {
    await fetch(`http://localhost:3000/calendar-tasks/${id}`, {
      method: "DELETE",
    });
    await get().fetchEvents()
  },
}));

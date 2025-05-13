import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCalendarLocalStore = create(
  persist(
    (set) => ({
      events: [],
      fetchEvents: () => {

      },
      addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
      updateEvent: (id, updates) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
    }),
    {
      name: "calendar-events",
    }
  )
);
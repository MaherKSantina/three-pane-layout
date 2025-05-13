import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocalChatListStore = create(
  persist(
    (set, get) => ({
      chatLists: [],

      fetchLists: () => {
        const all = get().chatLists || [];
        set({ chatLists: all });
      },

      addList: (item) =>
        set((s) => ({
          chatLists: [...s.chatLists, { ...item, id: Date.now() }],
        })),

      updateList: (id, updates) =>
        set((s) => ({
          chatLists: s.chatLists.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      deleteList: (id) =>
        set((s) => ({
          chatLists: s.chatLists.filter((c) => c.id !== id),
        })),
    }),
    {
      name: "chat-list-storage",
      partialize: (state) => ({ chatLists: state.chatLists }),
    }
  )
);

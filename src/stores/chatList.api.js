import { create } from "zustand";

export const useApiChatListStore = create((set) => ({
  chatLists: [],
  error: null,

  fetchLists: async () => {
    try {
      const res = await fetch("http://localhost:3000/chat-lists");
      const data = await res.json();
      set({ chatLists: data });
    } catch (e) {
      set({ error: e.message });
    }
  },

  addList: async (item) => {
    const res = await fetch("http://localhost:3000/chat-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const newItem = await res.json();
    set((s) => ({ chatLists: [...s.chatLists, newItem] }));
  },

  updateList: async (id, updates) => {
    await fetch(`http://localhost:3000/chat-lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    set((s) => ({
      chatLists: s.chatLists.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  deleteList: async (id) => {
    await fetch(`http://localhost:3000/chat-lists/${id}`, {
      method: "DELETE",
    });
    set((s) => ({
      chatLists: s.chatLists.filter((c) => c.id !== id),
    }));
  },
}));

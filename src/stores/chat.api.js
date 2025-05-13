// src/stores/chat.api.js
import { create } from "zustand";

export const useApiChatStore = create((set) => ({
  messages: [],
  error: null,

  fetchMessages: async (chatId) => {
    try {
      const res = await fetch(`http://localhost:3000/chats/${chatId}/messages`);
      const data = await res.json();
      set({ messages: data });
    } catch (e) {
      set({ error: e.message });
    }
  },

  sendMessage: async (chatId, message) => {
    try {
      const res = await fetch(`http://localhost:3000/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      const saved = await res.json();
      set((s) => ({ messages: [...s.messages, saved] }));
    } catch (e) {
      set({ error: e.message });
    }
  },
}));

// src/stores/chat.local.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocalChatStore = create(
  persist(
    (set, get) => ({
      currentChatId: null,
      messages: [],              // messages for the active chat
      messagesByChatId: {},      // persisted history

      fetchMessages: (chatId) => {
        const all = get().messagesByChatId || {};
        const msgs = all[chatId] || [];
        set({ currentChatId: chatId, messages: msgs });
      },

      sendMessage: (chatId, message) => {
        const all = { ...get().messagesByChatId };
        const updated = [...(all[chatId] || []), message];
        all[chatId] = updated;
        set({ messages: updated, messagesByChatId: all });
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ messagesByChatId: state.messagesByChatId }),
    }
  )
);

// src/stores/kanban.api.js
import { create } from "zustand";

export const useApiKanbanStore = create((set, get) => ({
  columns: [],
  error: null,

  fetchData: async () => {
    try {
      const res = await fetch("https://api-digitalsymphony.ngrok.pizza/columns");
      const cols = await res.json(); // includes nested cards
      set({ columns: cols });
    } catch (e) {
      set({ error: e.message });
    }
  },

  addColumn: async (title) => {
    const res = await fetch("https://api-digitalsymphony.ngrok.pizza/columns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const col = await res.json();
    set((s) => ({ columns: [...s.columns, col] }));
  },

  updateColumn: async (id, data) => {
    await fetch(`https://api-digitalsymphony.ngrok.pizza/columns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    set((s) => ({
      columns: s.columns.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },

  deleteColumn: async (id) => {
    await fetch(`https://api-digitalsymphony.ngrok.pizza/columns/${id}`, { method: "DELETE" });
    set((s) => ({ columns: s.columns.filter((c) => c.id !== id) }));
  },

  addCard: async (columnId, card) => {
    const res = await fetch(
      `https://api-digitalsymphony.ngrok.pizza/columns/${columnId}/cards`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      }
    );
    const newCard = await res.json();
    set((s) => ({
      columns: s.columns.map((c) =>
        c.id === columnId
          ? { ...c, cards: [...c.cards, newCard] }
          : c
      ),
    }));
  },

  updateCard: async (columnId, cardId, data) => {
    await fetch(`https://api-digitalsymphony.ngrok.pizza/cards/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    set((s) => ({
      columns: s.columns.map((c) =>
        c.id === columnId
          ? {
              ...c,
              cards: c.cards.map((cd) =>
                cd.id === cardId ? { ...cd, ...data } : cd
              ),
            }
          : c
      ),
    }));
  },

  deleteCard: async (columnId, cardId) => {
    await fetch(`https://api-digitalsymphony.ngrok.pizza/cards/${cardId}`, {
      method: "DELETE",
    });
    set((s) => ({
      columns: s.columns.map((c) =>
        c.id === columnId
          ? { ...c, cards: c.cards.filter((cd) => cd.id !== cardId) }
          : c
      ),
    }));
  },

  moveCard: async (fromCol, toCol, cardId, destIndex) => {
    // 1) Optimistically reorder locally
    set((s) => {
      const cols = s.columns.map((c) => ({ ...c, cards: [...c.cards] }));
      const src = cols.find((c) => c.id === fromCol);
      const dst = cols.find((c) => c.id === toCol);
      if (!src || !dst) return s;

      // remove from source
      const [moved] = src.cards.splice(
        src.cards.findIndex((cd) => cd.id === cardId),
        1
      );
      // insert into destination
      dst.cards.splice(destIndex, 0, moved);

      return { columns: cols };
    });

    // 2) Persist ALL positions in both affected columns
    const { columns } = get();
    const srcCol = columns.find((c) => c.id === fromCol);
    const dstCol = columns.find((c) => c.id === toCol);
    const updates = [];

    // source column: update each card’s position
    if (srcCol) {
      srcCol.cards.forEach((card, idx) => {
        updates.push(
          fetch(`https://api-digitalsymphony.ngrok.pizza/cards/${card.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              column_id: srcCol.id,
              position: idx,
            }),
          })
        );
      });
    }

    // destination column: likewise
    if (dstCol) {
      dstCol.cards.forEach((card, idx) => {
        updates.push(
          fetch(`https://api-digitalsymphony.ngrok.pizza/cards/${card.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              column_id: dstCol.id,
              position: idx,
            }),
          })
        );
      });
    }

    // wait for all updates to complete
    await Promise.all(updates);

    // 3) Re-fetch to get server-authoritative ordering
    await get().fetchData();
  },
}));

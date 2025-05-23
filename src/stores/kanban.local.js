// src/stores/kanban.local.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocalKanbanStore = (localStorageName) => create(
  persist(
    (set, get) => ({
      columns: [],

      fetchData: () => {},

      addColumn: (title) => {
        const cols = get().columns;
        const id = Date.now().toString();
        set({
          columns: [...cols, { id, title, cards: [] }],
        });
      },

      updateColumn: (id, data) =>
        set((s) => ({
          columns: s.columns.map((c) =>
            c.id === id.toString() ? { ...c, ...data } : c
          ),
        })),

      deleteColumn: (id) =>
        set((s) => ({
          columns: s.columns.filter((c) => c.id !== id.toString()),
        })),

      addCard: (columnId, card) =>
        set((s) => ({
          columns: s.columns.map((c) =>
            c.id === columnId.toString()
              ? {
                  ...c,
                  cards: [...c.cards, { ...card, id: card.id.toString() }],
                }
              : c
          ),
        })),

      updateCard: (columnId, cardId, data) =>
        set((s) => ({
          columns: s.columns.map((c) =>
            c.id === columnId.toString()
              ? {
                  ...c,
                  cards: c.cards.map((cd) =>
                    cd.id === cardId.toString() ? { ...cd, ...data } : cd
                  ),
                }
              : c
          ),
        })),

      deleteCard: (columnId, cardId) =>
        set((s) => ({
          columns: s.columns.map((c) =>
            c.id === columnId.toString()
              ? {
                  ...c,
                  cards: c.cards.filter((cd) => cd.id !== cardId.toString()),
                }
              : c
          ),
        })),

      moveCard: (fromCol, toCol, cardId, destIndex) => {
        set((s) => {
          const fromId = fromCol.toString();
          const toId = toCol.toString();
          const cId = cardId.toString();

          // deep clone columns/cards
          const cols = s.columns.map((c) => ({
            ...c,
            cards: [...c.cards],
          }));

          const src = cols.find((c) => c.id === fromId);
          const dst = cols.find((c) => c.id === toId);
          if (!src || !dst) return s;

          const idx = src.cards.findIndex((cd) => cd.id === cId);
          if (idx === -1) return s;

          // remove from source
          const [moved] = src.cards.splice(idx, 1);
          // insert into destination at destIndex
          dst.cards.splice(destIndex, 0, moved);

          return { columns: cols };
        });
      },
    }),
    {
      name: localStorageName,
      partialize: (state) => ({ columns: state.columns }),
    }
  )
);

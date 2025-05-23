import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocalTimelineStore = (localStorageName) =>
  create(
    persist(
      (set, get) => ({
        groups: [
            { id: 'group1', content: 'Context 1' },
            { id: 'group2', content: 'Context 2' },
            { id: 'group3', content: 'Context 3' },
            { id: 'group4', content: 'Context 4' },
            { id: 'group5', content: 'Context 5' },
            { id: 'group6', content: 'Context 6' },
            { id: 'group7', content: 'Context 7' },
            { id: 'group8', content: 'Context 8' },
            { id: 'group9', content: 'Context 9' },
            { id: 'group10', content: 'Context 10' },
            { id: 'group11', content: 'Context 11' },
            { id: 'group12', content: 'Context 12' },
            { id: 'group13', content: 'Context 13' },
            { id: 'group14', content: 'Context 14' },
            { id: 'group15', content: 'Context 15' },
            { id: 'group16', content: 'Context 16' },
            { id: 'group17', content: 'Context 17' },
            { id: 'group18', content: 'Context 18' },
            { id: 'group19', content: 'Context 19' },
            { id: 'group20', content: 'Context 20' },
          ],
          
          items: [
            { id: '1', group: 'group1', content: 'Event A', start: '2024-05-22T09:00:00', end: '2024-05-22T09:30:00' },
            { id: '2', group: 'group2', content: 'Event B', start: '2024-05-22T09:05:00', end: '2024-05-22T09:35:00' },
            { id: '3', group: 'group3', content: 'Event C', start: '2024-05-22T09:10:00', end: '2024-05-22T09:40:00' },
            { id: '4', group: 'group4', content: 'Event D', start: '2024-05-22T09:15:00', end: '2024-05-22T09:45:00' },
            { id: '5', group: 'group5', content: 'Event E', start: '2024-05-22T09:20:00', end: '2024-05-22T09:50:00' },
            { id: '6', group: 'group6', content: 'Event F', start: '2024-05-22T09:25:00', end: '2024-05-22T09:55:00' },
            { id: '7', group: 'group7', content: 'Event G', start: '2024-05-22T09:30:00', end: '2024-05-22T10:00:00' },
            { id: '8', group: 'group8', content: 'Event H', start: '2024-05-22T09:35:00', end: '2024-05-22T10:05:00' },
            { id: '9', group: 'group9', content: 'Event I', start: '2024-05-22T09:40:00', end: '2024-05-22T10:10:00' },
            { id: '10', group: 'group10', content: 'Event J', start: '2024-05-22T09:45:00', end: '2024-05-22T10:15:00' },
            { id: '11', group: 'group11', content: 'Event K', start: '2024-05-22T09:50:00', end: '2024-05-22T10:20:00' },
            { id: '12', group: 'group12', content: 'Event L', start: '2024-05-22T09:55:00', end: '2024-05-22T10:25:00' },
            { id: '13', group: 'group13', content: 'Event M', start: '2024-05-22T10:00:00', end: '2024-05-22T10:30:00' },
            { id: '14', group: 'group14', content: 'Event N', start: '2024-05-22T10:05:00', end: '2024-05-22T10:35:00' },
            { id: '15', group: 'group15', content: 'Event O', start: '2024-05-22T10:10:00', end: '2024-05-22T10:40:00' },
            { id: '16', group: 'group16', content: 'Event P', start: '2024-05-22T10:15:00', end: '2024-05-22T10:45:00' },
            { id: '17', group: 'group17', content: 'Event Q', start: '2024-05-22T10:20:00', end: '2024-05-22T10:50:00' },
            { id: '18', group: 'group18', content: 'Event R', start: '2024-05-22T10:25:00', end: '2024-05-22T10:55:00' },
            { id: '19', group: 'group19', content: 'Event S', start: '2024-05-22T10:30:00', end: '2024-05-22T11:00:00' },
            { id: '20', group: 'group20', content: 'Event T', start: '2024-05-22T10:35:00', end: '2024-05-22T11:05:00' },
          ],          

        fetchData: () => {
          const { groups, items } = get();
          set({ groups, items });
        },

        setGroups: (newGroups) => set({ groups: newGroups }),

        setItems: (newItems) => set({ items: newItems }),

        addGroup: (group) =>
          set((s) => ({
            groups: [...s.groups, { ...group, id: group.id.toString() }],
          })),

        updateGroup: (id, data) =>
          set((s) => ({
            groups: s.groups.map((g) =>
              g.id === id.toString() ? { ...g, ...data } : g
            ),
          })),

        deleteGroup: (id) =>
          set((s) => ({
            groups: s.groups.filter((g) => g.id !== id.toString()),
            items: s.items.filter((i) => i.group !== id.toString()),
          })),

        addItem: (item) =>
          set((s) => ({
            items: [...s.items, { ...item, id: item.id.toString() }],
          })),

        updateItem: (id, data) =>
          set((s) => ({
            items: s.items.map((i) =>
              i.id === id.toString() ? { ...i, ...data } : i
            ),
          })),

        deleteItem: (id) =>
          set((s) => ({
            items: s.items.filter((i) => i.id !== id.toString()),
          })),
      }),
      {
        name: localStorageName,
        partialize: (state) => ({
          groups: state.groups,
          items: state.items,
        }),
      }
    )
  );

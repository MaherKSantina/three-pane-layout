// createItemStore.js
import { create } from 'zustand';

export function createItemStore(key) {
  return create((set, get) => ({
    items: [],
    fetchItems: async () => {
      const res = await fetch(`http://localhost:3000/items/${key}`);
      const data = await res.json();
      set({ items: data });
    },
    addItem: async (text) => {
      await fetch(`http://localhost:3000/items/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: text }), // assuming API expects `name`
      });
      await get().fetchItems();
    },
    updateItem: async (id, text) => {
      await fetch(`http://localhost:3000/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: text }), // assuming API expects `name`
      });
      await get().fetchItems();
    },
    deleteItem: async (id) => {
      await fetch(`http://localhost:3000/items/${id}`, { method: 'DELETE' });
      await get().fetchItems();
    },
  }));
}

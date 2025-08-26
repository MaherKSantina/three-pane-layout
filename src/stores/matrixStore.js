// matrixStore.js
import * as React from 'react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

/** Create ONE store instance for a given identifier */
function createMatrixStore(identifier) {
  const store = createStore(() => ({
    identifier,
    matrix: [],
    matrixId: null,

    // actions will be injected just below
    setMatrix: () => {},
    setMatrixId: () => {},
    fetchMatrix: async () => {},
    upsertCell: async () => {},
    deleteCell: async () => {},
    deleteRowAt: async () => {},
    addRowAt: async () => {},
    deleteColAt: async () => {},
    addColAt: async () => {},
  }));

  // --- Helpers to read/write this store ---
  const get = store.getState;
  const set = (partial) => store.setState(partial);

  // --- Actions (same behavior as your TS version) ---
  const actions = {
    setMatrix(matrix) {
      set({ matrix });
    },

    setMatrixId(matrixId) {
      set({ matrixId });
    },

    // Fetch cells and reconstruct jagged [y][x]
    async fetchMatrix(matrixId) {
      const res = await fetch(
        `https://api-digitalsymphony.ngrok.pizza/api/${identifier}/${matrixId}/cells`
      );
      const cells = await res.json();
      if (!Array.isArray(cells)) return;

      const rows = {};
      cells.forEach((cell) => {
        if (!rows[cell.y]) rows[cell.y] = [];
        rows[cell.y][cell.x] = cell;
      });

      const matrix = Object.keys(rows)
        .map(Number)
        .sort((a, b) => a - b)
        .map((y) => rows[y]);

      set({ matrix, matrixId });
    },

    async upsertCell({ x, y, text, agent, newCell }) {
      const { matrixId } = get();
      const res = await fetch(
        `https://api-digitalsymphony.ngrok.pizza/api/${identifier}/${matrixId}/cells`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ x, y, text, agent, newCell }),
        }
      );
      if (!res.ok) throw new Error('Failed to upsert cell');
      await get().fetchMatrix(matrixId);
    },

    async deleteCell({ x, y }) {
      const { matrixId, matrix } = get();
      const cell = (matrix[y] || [])[x];
      if (!cell) return;
      await fetch(
        `https://api-digitalsymphony.ngrok.pizza/api/${identifier}/${matrixId}/cells/${cell.id}`,
        { method: 'DELETE' }
      );
      await get().fetchMatrix(matrixId);
    },

    async deleteRowAt(index) {
      const { matrixId } = get();
      await fetch(
        `https://api-digitalsymphony.ngrok.pizza/api/${identifier}/${matrixId}/row/${index}`,
        { method: 'DELETE' }
      );
      await get().fetchMatrix(matrixId);
    },

    async addRowAt(index) {
      const { matrixId } = get();
      await fetch(
        `https://api-digitalsymphony.ngrok.pizza/api/${identifier}/${matrixId}/row`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index }),
        }
      );
      await get().fetchMatrix(matrixId);
    },

    async deleteColAt(index) {
      const { matrixId } = get();
      await fetch(
        `https://api-digitalsymphony.ngrok.pizza/api/${identifier}/${matrixId}/col/${index}`,
        { method: 'DELETE' }
      );
      await get().fetchMatrix(matrixId);
    },

    async addColAt(index) {
      const { matrixId } = get();
      await fetch(
        `https://api-digitalsymphony.ngrok.pizza/api/${identifier}/${matrixId}/col`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index }),
        }
      );
      await get().fetchMatrix(matrixId);
    },
  };

  // inject actions into state
  store.setState(actions, false, 'init/actions');
  return store;
}

/** Registry of stores keyed by identifier */
const storeRegistry = new Map();

/** Hook: get/use the store for a given identifier (default "matrices") */
export function useMatrixStore(identifier = 'matrices') {
  const store = React.useMemo(() => {
    if (!storeRegistry.has(identifier)) {
      storeRegistry.set(identifier, createMatrixStore(identifier));
    }
    return storeRegistry.get(identifier);
  }, [identifier]);

  return useStore(store);
}

/** Optional selector hook variant */
export function useMatrixStoreSelector(selector, identifier = 'matrices', equalityFn) {
  const store = React.useMemo(() => {
    if (!storeRegistry.has(identifier)) {
      storeRegistry.set(identifier, createMatrixStore(identifier));
    }
    return storeRegistry.get(identifier);
  }, [identifier]);

  return useStore(store, selector, equalityFn);
}

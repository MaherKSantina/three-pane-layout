import { create } from 'zustand';

export const useMatrixStore = create((set, get) => ({
  matrix: [],
  setMatrix: (matrix) => set({ matrix }),
  matrixId: null,
  setMatrixId: (matrixId) => set({ matrixId }),

  // Fetch cells from API and reconstruct as array of arrays (jagged)
  fetchMatrix: async (matrixId) => {
    const res = await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/cells`);
    const cells = await res.json();
    if (!Array.isArray(cells)) return;

    // Build jagged matrix: group cells by y, then by x
    const rows = {};
    cells.forEach(cell => {
      if (!rows[cell.y]) rows[cell.y] = [];
      rows[cell.y][cell.x] = cell;
    });

    // Convert to array of arrays (row order by y)
    const matrix = Object.keys(rows)
      .map(y => Number(y))
      .sort((a, b) => a - b)
      .map(y => rows[y]);

    set({ matrix, matrixId });
  },

  upsertCell: async ({ x, y, text, agent, newCell }) => {
    const matrixId = get().matrixId;
    const res = await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/cells`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y, text, agent, newCell })
    });
    if (!res.ok) throw new Error('Failed to upsert cell');
    await get().fetchMatrix(matrixId);
  },

  deleteCell: async ({ x, y }) => {
    const matrixId = get().matrixId;
    const cell = get().matrix[y]?.[x];
    if (!cell) return;
    await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/cells/${cell.id}`, { method: 'DELETE' });
    await get().fetchMatrix(matrixId);
  },

  deleteRow: async (rowIdx) => {
    const matrixId = get().matrixId;
    const row = get().matrix[rowIdx] || [];
    await Promise.all(row.map(cell =>
      cell ? fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/cells/${cell.id}`, { method: 'DELETE' }) : null
    ));
    await get().fetchMatrix(matrixId);
  },

  addCol: async (rowIdx) => {
    const matrix = get().matrix;
    const newX = matrix[rowIdx] ? matrix[rowIdx].length : 0;
    await get().upsertCell({ x: newX, y: rowIdx, text: null, agent: null });
  },

  addRow: async () => {
    const matrix = get().matrix;
    // No need to ensure all rows same length; just add a new (possibly empty) row
    const newY = matrix.length;
    // Optionally add N columns with nulls, or just leave empty
    await get().upsertCell({ x: 0, y: newY, text: null, agent: null });
    await get().fetchMatrix(get().matrixId);
  },

  addRow: async () => {
    const matrixId = get().matrixId;
    // Append row at end
    const matrix = get().matrix;
    const index = matrix.length;
    await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/row`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    });
    await get().fetchMatrix(matrixId);
  },

  // New: insert row at arbitrary index (for "add row between")
  addRowAt: async (index) => {
    const matrixId = get().matrixId;
    await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/row`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    });
    await get().fetchMatrix(matrixId);
  },

  deleteRowAt: async (index) => {
    const matrixId = get().matrixId;
    await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/row/${index}`, {
      method: 'DELETE'
    });
    await get().fetchMatrix(matrixId);
  },

  addCol: async () => {
    const matrixId = get().matrixId;
    // Append col at end (find max col count)
    const matrix = get().matrix;
    const maxCols = Math.max(...matrix.map(r => r.length), 0);
    await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/col`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index: maxCols })
    });
    await get().fetchMatrix(matrixId);
  },

  // New: insert col at arbitrary index (for "add col between")
  addColAt: async (index) => {
    const matrixId = get().matrixId;
    await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/col`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    });
    await get().fetchMatrix(matrixId);
  },

  deleteColAt: async (index) => {
    const matrixId = get().matrixId;
    await fetch(`https://api-digitalsymphony.ngrok.pizza/api/matrices/${matrixId}/col/${index}`, {
      method: 'DELETE'
    });
    await get().fetchMatrix(matrixId);
  },
}));

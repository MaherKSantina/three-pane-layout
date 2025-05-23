import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocalFlowStore = (localStorageName) =>
  create(
    persist(
      (set, get) => ({
        nodes: [
            { id: '1', data: { label: 'Start' }, position: { x: 0, y: 0 } },
            { id: '2', data: { label: 'Step A' }, position: { x: 0, y: 0 } },
            { id: '3', data: { label: 'Step B' }, position: { x: 0, y: 0 } },
            { id: '4', data: { label: 'End' }, position: { x: 0, y: 0 } },
          ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
          ],

        fetchData: () => {
          const { nodes, edges } = get();
          set({ nodes, edges });
        },

        setNodes: (newNodes) => set({ nodes: newNodes }),

        setEdges: (newEdges) => set({ edges: newEdges }),

        addNode: (node) =>
          set((s) => ({
            nodes: [...s.nodes, { ...node, id: node.id.toString() }],
          })),

        updateNode: (id, data) =>
          set((s) => ({
            nodes: s.nodes.map((n) =>
              n.id === id.toString() ? { ...n, ...data } : n
            ),
          })),

        deleteNode: (id) =>
          set((s) => ({
            nodes: s.nodes.filter((n) => n.id !== id.toString()),
            edges: s.edges.filter(
              (e) => e.source !== id.toString() && e.target !== id.toString()
            ),
          })),

        addEdge: (edge) =>
          set((s) => ({
            edges: [...s.edges, { ...edge, id: edge.id.toString() }],
          })),

        updateEdge: (id, data) =>
          set((s) => ({
            edges: s.edges.map((e) =>
              e.id === id.toString() ? { ...e, ...data } : e
            ),
          })),

        deleteEdge: (id) =>
          set((s) => ({
            edges: s.edges.filter((e) => e.id !== id.toString()),
          })),
      }),
      {
        name: localStorageName,
        partialize: (state) => ({
          nodes: state.nodes,
          edges: state.edges,
        }),
      }
    )
  );

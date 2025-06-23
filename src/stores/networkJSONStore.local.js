import { create } from 'zustand';
import { nanoid } from 'nanoid';

let nodeIdCounter = 0;
function genNodeId() {
  return nanoid();
}

export function buildGraph(obj, parentId = null, edges = [], nodes = [], isRoot = true) {
  let currentNodeId;

  if (isRoot) {
    currentNodeId = genNodeId();
    nodes.push({ id: currentNodeId, label: '' }); // Root node
    parentId = currentNodeId;
  } else if (parentId == null) {
    throw new Error('parentId is required for non-root nodes');
  } else {
    currentNodeId = parentId;
  }

  let entries = [];
  if (Array.isArray(obj)) {
    entries = obj.map((v, i) => [String(i), v]);
  } else if (typeof obj === 'object' && obj !== null) {
    entries = Object.entries(obj);
  } else {
    return { nodes, edges };
  }

  for (const [key, value] of entries) {
    const isObject = typeof value === 'object' && value !== null;
    const nodeLabel = isObject ? '' : String(value);
    const valueNodeId = genNodeId();

    nodes.push({ id: valueNodeId, label: nodeLabel });

    edges.push({
      from: currentNodeId,
      to: valueNodeId,
      label: key,
      arrows: 'to',
      font: { align: 'top' }
    });

    if (isObject) {
      buildGraph(value, valueNodeId, edges, nodes, false);
    }
  }

  return { nodes, edges };
}

export const useJsonStore = create((set, get) => ({
  selectedNodeId: null,
  data: {},
  nodes: [],
  edges: [],

  setData: (data) => {
    nodeIdCounter = 0;
    const { nodes, edges } = buildGraph(data);
    set({ data, nodes, edges });
  },
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  // For convenience, in case you still want to use it:
  getGraphData: () => ({
    nodes: get().nodes,
    edges: get().edges,
  }),

  updateNode: (id, changes) => {
    set(state => {
      const nodes = state.nodes.map(node =>
        node.id === id ? { ...node, ...changes } : node
      );
      return { nodes };
    });
  }
}));

import React, { useCallback, useEffect } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

import { useProcessStore, useStore } from '../contexts/StoreContext'; // ← your Zustand store hook

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;

function layoutElements(nodes, edges, direction = 'LR') {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, marginx: 50, marginy: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      targetPosition: isHorizontal ? 'left' : 'top',
    };
  });

  return { nodes: layoutedNodes, edges };
}

function ProcessFlowInner({ direction = 'LR' }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { nodes: rawNodes, edges: rawEdges } = useProcessStore((s) => ({
    nodes: s.nodes,
    edges: s.edges,
  }));

  useEffect(() => {
    const { nodes: ln, edges: le } = layoutElements(rawNodes, rawEdges, direction);
    setNodes(ln);
    setEdges(le);
  }, [rawNodes, rawEdges, direction, setNodes, setEdges]);

  const onInit = useCallback((rfInstance) => {
    rfInstance.fitView({ padding: 0.1 });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      fitView
      fitViewOptions={{ padding: 0.1 }}
      style={{ width: '100%', height: '100%' }}
      nodesDraggable={false}
      nodesConnectable={false}
      panOnScroll
    >
      <Background gap={16} color="#888" />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export default function ProcessFlow(props) {
  return (
    <ReactFlowProvider>
      <ProcessFlowInner {...props} />
    </ReactFlowProvider>
  );
}

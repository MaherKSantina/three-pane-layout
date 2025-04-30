import React from 'react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css'
import FigmaFlowScreenNode from './FigmaFlowNode';

const nodeTypes = {
  figmaNode: FigmaFlowScreenNode, 
};

const nodes = [
    {
      id: '1',
      type: 'figmaNode', 
      position: { x: 100, y: 100 },
      data: {
        label: 'Login View',
        selected: false,
      },
    },
    {
        id: '2',
        type: 'figmaNode',
        position: { x: 500, y: 100 },
        data: {
          label: 'Home View',
          selected: false,
        },
      },
  ];
  const edges = [
    {id: "1-2", source: "1", target: "2", type: 'smoothstep'}
  ];

function ProcessFlow() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow 
      nodes={nodes} 
      edges={edges} 
      nodeTypes={nodeTypes} // 👈 pass custom node types
        fitView
      />
    </div>
  );
}

export default ProcessFlow;
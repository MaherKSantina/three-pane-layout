import { Controls, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes = [
  { id: 'a1', position: { x: 0, y: 0 }, data: { label: 'Agent A' }, type: 'agent' },
  { id: 'b1', position: { x: 200, y: 100 }, data: { label: 'Agent B' }, type: 'agent' },
  { id: 'c1', position: { x: 400, y: 200 }, data: { label: 'Agent C' }, type: 'agent' },
];

const edges = [
  { id: 'a1-b1', source: 'a1', target: 'b1', label: 'msg1', animated: true },
  { id: 'b1-c1', source: 'b1', target: 'c1', label: 'msg2', animated: true },
];

export default function AgentFlow() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
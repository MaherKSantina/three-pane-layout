import React, { useEffect, useRef } from 'react';
import { DataSet, Network } from 'vis-network/standalone';

const GraphComponent = () => {
  const networkContainer = useRef(null);
  const networkInstance = useRef(null);

  useEffect(() => {
    const nodes = new DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
    ]);

    const edges = new DataSet([
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ]);

    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {};

    if (networkContainer.current) {
      networkInstance.current = new Network(networkContainer.current, data, options);
    }

    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
      }
    };
  }, []);

  return <div ref={networkContainer} style={{ height: '100vh' }} />;
};

export default GraphComponent;

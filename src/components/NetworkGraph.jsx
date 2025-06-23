import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { DataSet, Network } from 'vis-network/standalone';

const GraphComponent = forwardRef(
  (
    {
      // nodes,
      // edges,
      onNodeClick,
      onNodeMultiClick,
      onEdgeClick,
      onNothingClick,
      width = "100%",
      height = "100%",
    },
    ref
  ) => {
    const outerRef = useRef(null);
    const networkContainer = useRef(null);
    const networkInstance = useRef(null);

    // Expose redraw/updateNode via ref
    useImperativeHandle(ref, () => ({
      redraw: () => {
        networkInstance.current?.redraw();
      },
      updateNode: (id, changes) => {
        if (networkInstance.current) {
          networkInstance.current.body.data.nodes.update({ id, ...changes });
        }
      },
      updateEdge: (id, changes) => {
        if (networkInstance.current) {
          networkInstance.current.body.data.edges.update({ id, ...changes });
        }
      },
      addNode: (node) => {
        networkInstance.current.body.data.nodes.add(node)
      },
      addEdge: (edge) => {
        networkInstance.current.body.data.edges.add(edge)
      },
      deleteNode: (id) => {
        networkInstance.current.body.data.nodes.remove(id)
      },
      deleteEdge: (id) => {
        networkInstance.current.body.data.edges.remove(id)
      },
      selectNode: (id) => {
        networkInstance.current.unselectAll()
        networkInstance.current.selectNodes([id])
      },
      deselectAll: () => {
        networkInstance.current.unselectAll()
      },
      clearNodes: () => {
        networkInstance.current.body.data.nodes.clear();
      },
      clearEdges: () => {
        networkInstance.current.body.data.edges.clear();
      }
    }));

    // Mount vis-network only once
    useEffect(() => {
      if (!networkContainer.current) return;

      // Create DataSets only once, update later
      const nodesDS = new DataSet([]);
      const edgesDS = new DataSet([]);

      networkInstance.current = new Network(
        networkContainer.current,
        { nodes: nodesDS, edges: edgesDS },
        {
          layout: {
            hierarchical: {
              enabled: true,
              direction: 'LR',
              sortMethod: 'directed'
            },
            // improvedLayout: true
          },
          edges: {
            arrows: 'to',
            font: { align: 'top' }
          },
          physics: {
            "barnesHut": {
              "springConstant": 0,
              "avoidOverlap": 0.2
            }
          },
          interaction: {
            multiselect: true
          }
        }
      );

      networkInstance.current.on('click', (params) => {
        if (params.nodes?.length > 0) {
          if(params.nodes.length === 1) {
            onNodeClick?.(params.nodes[0]);
          } else {
            onNodeMultiClick?.(params.nodes)
          }
          
        } else if (params.edges?.length > 0) {
          onEdgeClick?.(params.edges[0]);
        } else {
          onNothingClick?.()
        }
      });

      return () => {
        networkInstance.current?.destroy();
      };
    }, []); // mount once

    // Update vis data (nodes/edges) when props change
    // useEffect(() => {
    //   if (networkInstance.current) {
    //     // Replace nodes and edges using DataSet methods (preserve object refs)
    //     const dsNodes = networkInstance.current.body.data.nodes;
    //     const dsEdges = networkInstance.current.body.data.edges;
    //     dsNodes.clear();
    //     dsEdges.clear();
    //     dsNodes.add(nodes);
    //     dsEdges.add(edges);
    //   }
    // }, [nodes, edges]);

    // Update vis-network size when width/height props change
    useEffect(() => {
      if (
        networkInstance.current &&
        width &&
        height
      ) {
        networkInstance.current.setSize(
          typeof width === "number" ? width + "px" : width,
          typeof height === "number" ? height + "px" : height
        );
      }
    }, [width, height]);

    return (
      <div ref={outerRef} style={{ width, height }}>
        <div
          ref={networkContainer}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
);

export default GraphComponent;

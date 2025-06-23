import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import SplitPane from "./SplitPane3";
import GraphComponent from "./NetworkGraph";
import NodeSettings from "./NodeSettings";

export default function NetworkGraphEditor({
  initialNodes = [],
  initialEdges = [],
  allowsChildrenAndLabel = true,
  onSave,
}) {
  const graphRef = useRef();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [multiSelectedNodeId, setMultiSelectedNodeId] = useState(null);
  const [hasChildren, setHasChildren] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [leftWidth, setLeftWidth] = useState("100%");
  const [leftHeight, setLeftHeight] = useState("100%");
  const [currentValue, setCurrentValue] = useState("");

  // Sync initial nodes/edges into the graph
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.clearNodes()
      initialNodes.forEach((n) => graphRef.current.addNode(n));
      graphRef.current.redraw();
      setNodes(initialNodes)
    }
  }, [initialNodes]);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.clearEdges()
      initialEdges.forEach((e) => graphRef.current.addEdge(e));
      graphRef.current.redraw();
      setEdges(initialEdges)
    }
  }, [initialEdges]);

  useEffect(() => {
    const node = nodes.find((x) => x.id === selectedNodeId);
    setCurrentValue(node ? node.label : "");
  }, [selectedNodeId, nodes]);

  useEffect(() => {
    setHasChildren(edges.some((x) => x.from === selectedNodeId));
  }, [selectedNodeId, edges]);

  useEffect(() => {
    const edge = edges.find((x) => x.id === selectedEdgeId);
    setCurrentValue(edge ? edge.label : "");
  }, [selectedEdgeId, edges]);

  useEffect(() => {
    if (graphRef.current) graphRef.current.redraw();
  }, [leftWidth, leftHeight]);

  // Handlers for node/edge editing
  const handleValueChange = (v) => {
    setCurrentValue(v);
    if (selectedNodeId) {
      const newNodes = nodes.map((x) =>
        x.id === selectedNodeId ? { ...x, label: v } : x
      );
      setNodes(newNodes);
      graphRef.current.updateNode(selectedNodeId, { label: v });
    } else if (selectedEdgeId) {
      const newEdges = edges.map((x) =>
        x.id === selectedEdgeId ? { ...x, label: v } : x
      );
      setEdges(newEdges);
      graphRef.current.updateEdge(selectedEdgeId, { label: v });
    }
    graphRef.current.redraw();
  };

  const handleAddNode = () => {
    const newNode = { id: nanoid(), label: "<<VALUE>>" };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    graphRef.current.addNode(newNode);

    if (selectedNodeId) {
      const newEdge = {
        from: selectedNodeId,
        to: newNode.id,
        label: "<<KEY>>",
        arrows: "to",
        font: { align: "top" },
      };
      const newEdges = [...edges, newEdge];
      setEdges(newEdges);
      graphRef.current.addEdge(newEdge);
      if (!allowsChildrenAndLabel) {
        graphRef.current.updateNode(selectedNodeId, { label: "" });
      }
    }

    setSelectedNodeId(newNode.id);
    setMultiSelectedNodeId(null);
    graphRef.current.selectNode(newNode.id);
    graphRef.current.redraw();
  };

  const handleLink = () => {
    if (!multiSelectedNodeId) return;
    const [from, to] = multiSelectedNodeId;
    const newEdge = {
      from,
      to,
      label: "<<KEY>>",
      arrows: "to",
      font: { align: "top" },
    };
    const newEdges = [...edges, newEdge];
    setEdges(newEdges);
    graphRef.current.addEdge(newEdge);
    if (!allowsChildrenAndLabel) {
      graphRef.current.updateNode(from, { label: "" });
    }
    graphRef.current.deselectAll();
    setMultiSelectedNodeId(null);
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      const newNodes = nodes.filter((x) => x.id !== selectedNodeId);
      setNodes(newNodes);
      graphRef.current.deleteNode(selectedNodeId);
      setSelectedNodeId(null);
      setMultiSelectedNodeId(null);
    } else if (selectedEdgeId) {
      const newEdges = edges.filter((x) => x.id !== selectedEdgeId);
      setEdges(newEdges);
      graphRef.current.deleteEdge(selectedEdgeId);
      setSelectedEdgeId(null);
    }
    graphRef.current.redraw();
  };

  // The floating Save button and the graph
  const leftPanel = (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <button
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 2,
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 6,
          padding: "8px 16px",
          fontWeight: "bold",
          boxShadow: "0 1px 4px 0 rgba(0,0,0,0.15)",
          cursor: "pointer",
          opacity: 0.95,
          transition: "background 0.15s",
        }}
        onClick={() => onSave?.(nodes, edges)}
        title="Save Graph"
      >
        Save
      </button>
      <GraphComponent
        key="ng"
        ref={graphRef}
        width={leftWidth}
        height={leftHeight}
        onNodeClick={(nodeId) => {
          setSelectedNodeId(nodeId);
          setMultiSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
        onNodeMultiClick={(nodeIds) => {
          setSelectedNodeId(null);
          setMultiSelectedNodeId(nodeIds);
          setSelectedEdgeId(null);
        }}
        onEdgeClick={(edgeId) => {
          setSelectedEdgeId(edgeId);
          setSelectedNodeId(null);
          setMultiSelectedNodeId(null);
        }}
        onNothingClick={() => {
          setSelectedNodeId(null);
          setMultiSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
      />
    </div>
  );

  return (
    <SplitPane
      left={leftPanel}
      onLeftDimensionChange={(width, height) => {
        if (width > 0) setLeftWidth(width);
        if (height > 0) setLeftHeight(height);
      }}
      right={
        <NodeSettings
          allowsChildrenAndLabel={allowsChildrenAndLabel}
          selectedNodeId={selectedNodeId}
          multiSelectedNodeId={multiSelectedNodeId}
          hasChildren={hasChildren}
          selectedEdgeId={selectedEdgeId}
          value={currentValue}
          onValueChange={handleValueChange}
          onAddNode={handleAddNode}
          onLink={handleLink}
          onDelete={handleDelete}
        />
      }
      initialSplit={0.9}
    />
  );
}

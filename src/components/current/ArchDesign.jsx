import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* ----------------------- Layout system (single source of truth) ----------------------- */

function makeLayout() {
    const u = 4
  return {
    unit: u,

    // spacing
    nodePadding: u * 0,
    topGap: u * 6,
    rowGap: u * 3,
    arrowGap: u * 2.5,

    // sizing
    nodeMinInnerWidth: u * 35, // minimum content width
    arrowBtn: u * 9,
    badgeHPad: u * 2.5,
    badgeVPad: u * 1,
    itemPad: u * 2.5,

    // typography (derived too)
    fontBase: u * 3.5,
    fontSmall: u * 3,
    fontTiny: u * 2.75,

    // radii
    radiusNode: u * 3.5,
    radiusItem: u * 3,
    radiusBtn: u * 2.5,
    radiusPill: u * 999,

    // borders
    borderThin: u * 0.25,
    borderThick: u * 0.5,

    // vertical rhythm
    headerGap: u * 2.5,
    blockGap: u * 3,
    counterTop: u * 1.5,

    // subtle depth cue (still programmatic)
    depthShadowWidth: u * 0,
  };
}

const L = makeLayout();

/* ----------------------- Converter ----------------------- */

export function dataToArchItems(data) {
  const root = Array.isArray(data?.items) ? data.items : [];
  return root.map(convert);

  function convert(x) {
    const out = { type: String(x?.type ?? "") };

    if (Array.isArray(x?.items) && x.items.length > 0) {
      out.items = x.items.map(convert);
    }
    if (Array.isArray(x?.options) && x.options.length > 0) {
      out.options = x.options.map(convert);
    }
    return out;
  }
}

/* ----------------------- Measurement (prevents overlap) ----------------------- */

function measureWidth(item) {
  if (!item) return L.nodeMinInnerWidth + L.nodePadding * 2;

  const children = Array.isArray(item.items) ? item.items : [];
  const childrenRowWidth =
    children.length === 0
      ? 0
      : children.reduce((sum, child, idx) => {
          return sum + measureWidth(child) + (idx === 0 ? 0 : L.rowGap);
        }, 0);

  const options = Array.isArray(item.options) ? item.options : [];
  const maxOptionWidth =
    options.length === 0 ? 0 : Math.max(...options.map((opt) => measureWidth(opt)));

  const optionsRowWidth =
    options.length === 0
      ? 0
      : L.arrowBtn +
        L.arrowGap +
        maxOptionWidth +
        L.arrowGap +
        L.arrowBtn;

  const inner = Math.max(L.nodeMinInnerWidth, childrenRowWidth, optionsRowWidth);
  return inner + L.nodePadding * 2;
}

/* ----------------------- React Flow Layout ----------------------- */

function layoutTopLevelItems(items, startX = L.unit * 10, startY = L.unit * 20) {
  let x = startX;

  return items.map((item, i) => {
    const w = measureWidth(item);

    const node = {
      id: `top-${i}`,
      type: "archNode",
      position: { x, y: startY },
      data: { item, width: w },
      draggable: false,
      selectable: true,
    };

    x += w + L.topGap;
    return node;
  });
}

/* ----------------------- Recursive Renderer ----------------------- */

function ItemTree({ item, depth = 0 }) {
  const hasItems = Array.isArray(item?.items) && item.items.length > 0;
  const hasOptions = Array.isArray(item?.options) && item.options.length > 0;

  const [optIndex, setOptIndex] = useState(0);

  useEffect(() => setOptIndex(0), [item?.type, item?.options?.length]);

  useEffect(() => {
    if (!hasOptions) return;
    if (optIndex >= item.options.length) setOptIndex(0);
  }, [hasOptions, optIndex, item?.options?.length]);

  const optionMaxWidth = useMemo(() => {
    if (!hasOptions) return 0;
    return Math.max(...item.options.map((o) => measureWidth(o)));
  }, [hasOptions, item]);

  const prevOpt = useCallback(() => {
    if (!hasOptions) return;
    setOptIndex((i) => (i - 1 + item.options.length) % item.options.length);
  }, [hasOptions, item]);

  const nextOpt = useCallback(() => {
    if (!hasOptions) return;
    setOptIndex((i) => (i + 1) % item.options.length);
  }, [hasOptions, item]);

  const containerMinWidth = useMemo(() => measureWidth(item), [item]);

  return (
    <div style={styles.itemContainer(depth, containerMinWidth)}>
      <div style={styles.itemHeader}>
        <div style={styles.typeBadge}>{item?.type ?? ""}</div>
      </div>

      {hasOptions && (
        <div style={styles.optionsBlock}>
          <div style={styles.optionRow}>
            <button
              onClick={prevOpt}
              style={styles.arrowBtn}
              aria-label="previous option"
              type="button"
            >
              ◀
            </button>

            <div style={styles.optionViewport(optionMaxWidth)}>
              <ItemTree item={item.options[optIndex]} depth={depth + 1} />
            </div>

            <button
              onClick={nextOpt}
              style={styles.arrowBtn}
              aria-label="next option"
              type="button"
            >
              ▶
            </button>
          </div>

          <div style={styles.counter}>
            option {optIndex + 1}/{item.options.length}
          </div>
        </div>
      )}

      {hasItems && (
        <div style={styles.childrenRow}>
          {item.items.map((child, idx) => (
            <ItemTree key={`${child.type}-${idx}`} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------- React Flow Node ----------------------- */

function ArchNode({ data }) {
  return (
    <div style={styles.nodeOuter(data?.width ?? measureWidth(data?.item))}>
      <ItemTree item={data.item} />
    </div>
  );
}

/* ----------------------- Main Component ----------------------- */

export default function ArchDesign({ data }) {
  const items = useMemo(() => dataToArchItems(data), [data]);

  return (
    <ReactFlowProvider>
      <ArchCanvas items={items} />
    </ReactFlowProvider>
  );
}

function ArchCanvas({ items }) {
  const nodeTypes = useMemo(() => ({ archNode: ArchNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutTopLevelItems(items));

  useEffect(() => {
    setNodes(layoutTopLevelItems(items));
  }, [items, setNodes]);

  return (
    <div style={styles.canvas}>
      <ReactFlow
        nodes={nodes}
        zoomOnDoubleClick={false}
        edges={[]}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

/* ----------------------- Styles (all computed) ----------------------- */

const styles = {
  canvas: {
    height: "100vh",
    width: "100%",
  },

  nodeOuter: (minWidth) => ({
    border: `${L.borderThick}px solid #111`,
    borderRadius: L.radiusNode,
    background: "white",
    padding: L.nodePadding,
    fontFamily: "system-ui, sans-serif",
    userSelect: "none",
    minWidth,
  }),

  itemContainer: (depth, minWidth) => ({
    border: `${L.borderThin}px solid #111`,
    borderRadius: L.radiusItem,
    background: "white",
    padding: L.itemPad,
    display: "inline-block",
    minWidth,
    // subtle nesting cue (still derived)
    boxShadow: depth
      ? `0 0 0 ${L.depthShadowWidth}px rgba(0,0,0,0.04)`
      : "none",
  }),

  itemHeader: {
    display: "flex",
    alignItems: "center",
    gap: L.unit * 2,
    marginBottom: L.headerGap,
  },

  typeBadge: {
    border: `${L.borderThin}px solid #111`,
    borderRadius: L.radiusPill,
    padding: `${L.badgeVPad}px ${L.badgeHPad}px`,
    fontSize: L.fontSmall,
    fontWeight: 650,
    lineHeight: 1.2,
  },

  optionsBlock: {
    marginBottom: L.blockGap,
  },

  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: L.arrowGap,
  },

  optionViewport: (minWidth) => ({
    minWidth,
    flex: "0 0 auto",
  }),

  childrenRow: {
    display: "flex",
    gap: L.rowGap,
    alignItems: "flex-start",
    flexWrap: "nowrap",
  },

  arrowBtn: {
    width: L.arrowBtn,
    height: L.arrowBtn,
    borderRadius: L.radiusBtn,
    border: `${L.borderThin}px solid #111`,
    background: "white",
    cursor: "pointer",
    lineHeight: L.arrowBtn - L.borderThin * 2, // numeric
    flex: "0 0 auto",
    fontSize: L.fontBase,
  },

  counter: {
    marginTop: L.counterTop,
    fontSize: L.fontTiny,
    opacity: 0.65,
  },
};

import React, { useRef, useState, useEffect } from "react";

// ResizeObserver hook (for any ref)
function useSizeObserver(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export default function SplitPane({
  initialSplit = 0.5,
  left,
  right,
  height = "100%",
  minRatio = 0.1,
  maxRatio = 0.9,
  onLeftDimensionChange,
  onRightDimensionChange,
}) {
  const [splitRatio, setSplitRatio] = useState(initialSplit);
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const containerSize = useSizeObserver(containerRef);
  const leftSize = useSizeObserver(leftRef);
  const rightSize = useSizeObserver(rightRef);

  const dividerWidth = 8;
  const leftWidth = right
    ? containerSize.width * splitRatio - dividerWidth / 2
    : containerSize.width;
  const rightWidth = right
    ? containerSize.width - leftWidth - dividerWidth
    : 0;

    onLeftDimensionChange?.(leftWidth, leftSize.height)

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height,
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    height: "100%",
  };

  const paneStyle = {
    overflow: "auto",
    boxSizing: "border-box",
    height: "100%",
    width: "100%", // fallback
  };

  // Callbacks for left and right dimension changes
  useEffect(() => {
    if (onLeftDimensionChange) {
      onLeftDimensionChange(leftSize.width, leftSize.height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftSize.width, leftSize.height]);

  useEffect(() => {
    if (onRightDimensionChange) {
      onRightDimensionChange(rightSize.width, rightSize.height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightSize.width, rightSize.height]);

  const onPointerDown = (e) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();

    function onPointerMove(e) {
      let x = e.clientX - rect.left;
      let ratio = x / rect.width;
      ratio = Math.max(minRatio, Math.min(maxRatio, ratio));
      setSplitRatio(ratio);
    }
    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <div data-testid="splitpane-wrapper" style={wrapperStyle}>
      <div data-testid="splitpane-container" style={containerStyle} ref={containerRef}>
        {/* Left Pane */}
        <div
          ref={leftRef}
          data-testid="splitpane-left"
          style={{
            ...paneStyle,
            width: leftWidth,
          }}
        >
          {left}
        </div>
        {/* Draggable Divider */}
        {right && (
          <div
            style={{
              width: dividerWidth,
              background: "#e0e0e0",
              cursor: "col-resize",
              height: "100%",
              zIndex: 1,
              position: "relative",
            }}
            onPointerDown={onPointerDown}
          />
        )}
        {/* Right Pane */}
        {right && (
          <div
            ref={rightRef}
            data-testid="splitpane-right"
            style={{
              ...paneStyle,
              width: rightWidth,
            }}
          >
            {right}
          </div>
        )}
      </div>
    </div>
  );
}

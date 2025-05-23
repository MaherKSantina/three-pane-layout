import React, { useRef, useState, useEffect, cloneElement } from "react";

// ResizeObserver hook
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
}) {
  const [splitRatio, setSplitRatio] = useState(initialSplit);
  const containerRef = useRef(null);
  const containerSize = useSizeObserver(containerRef);

  const dividerWidth = 8;
  const leftWidth = containerSize.width * splitRatio;
  const rightWidth = containerSize.width - leftWidth;

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
  };

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
        <div
          data-testid="splitpane-left"
          style={{ ...paneStyle, width: leftWidth - dividerWidth / 2 }}
        >
          {leftWidth > dividerWidth &&
            containerSize.height &&
            cloneElement(left, {
              width: `${leftWidth - dividerWidth / 2}px`,
              height: `${containerSize.height}px`,
            })}
        </div>
        {/* Draggable Divider */}
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
        <div
          data-testid="splitpane-right"
          style={{ ...paneStyle, width: rightWidth - dividerWidth / 2 }}
        >
          {rightWidth > dividerWidth &&
            containerSize.height &&
            cloneElement(right, {
              width: `${rightWidth - dividerWidth / 2}px`,
              height: `${containerSize.height}px`,
            })}
        </div>
      </div>
    </div>
  );
}

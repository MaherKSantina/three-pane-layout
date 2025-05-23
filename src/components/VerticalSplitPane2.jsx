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

export default function VerticalSplitPane({ initialSplit = 0.5, top, bottom, minRatio = 0.1, maxRatio = 0.9 }) {
  const [splitRatio, setSplitRatio] = useState(initialSplit);
  const containerRef = useRef(null);
  const containerSize = useSizeObserver(containerRef);

  const isDragging = useRef(false);

  const onPointerDown = (e) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
  
    function onPointerMove(e) {
      let y = e.clientY - rect.top;
      let ratio = y / rect.height;
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

  const topHeight = containerSize.height * splitRatio;
  const bottomHeight = containerSize.height - topHeight;

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%", // Fill parent height
    userSelect: isDragging.current ? "none" : "auto",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "100%",
  };

  const paneStyle = {
    overflow: "auto",
    boxSizing: "border-box",
    width: "100%",
  };

  // Height of draggable divider in px
  const dividerHeight = 8;

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle} ref={containerRef}>
        {/* Top pane */}
        <div style={{ ...paneStyle, height: topHeight - dividerHeight / 2 }}>
          {containerSize.width && topHeight > dividerHeight &&
            top &&
            cloneElement(top, {
              width: containerSize.width,
              height: `${topHeight - dividerHeight / 2}px`,
            })}
        </div>

        {/* Draggable Divider */}
        <div
            style={{
                height: dividerHeight,
                background: "#e0e0e0",
                cursor: "row-resize",
                width: "100%",
                zIndex: 1,
                position: "relative",
            }}
            onPointerDown={onPointerDown}
            />


        {/* Bottom pane */}
        <div style={{ ...paneStyle, height: bottomHeight - dividerHeight / 2 }}>
          {containerSize.width && bottomHeight > dividerHeight &&
            bottom &&
            cloneElement(bottom, {
              width: containerSize.width,
              height: `${bottomHeight - dividerHeight / 2}px`,
            })}
        </div>
      </div>
    </div>
  );
}

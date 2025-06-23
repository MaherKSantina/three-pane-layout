import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import { buildGraph } from '../stores/networkJSONStore.local';

// --- Size observer hook ---
export function useSizeObserver(ref) {
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
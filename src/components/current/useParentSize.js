import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";

export function useParentSize(debounceMs = 200) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const el = ref.current;
    const parent = el && el.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const w = Math.max(0, Math.floor(rect.width));
    const h = Math.max(0, Math.floor(rect.height));

    setSize((prev) => {
      if (prev.width === w && prev.height === h) return prev;
      return { width: w, height: h };
    });
  }, []);

  // Initial synchronous measure to avoid jump
  useLayoutEffect(() => {
    measure();
  }, [measure]);

  // Observe parent size
  useEffect(() => {
    const el = ref.current;
    const parent = el && el.parentElement;
    if (!parent) return;

    let timeoutId;

    const debouncedMeasure = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(measure, debounceMs);
    };

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(debouncedMeasure);
      ro.observe(parent);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        ro.disconnect();
      };
    } else {
      // Fallback for old browsers
      window.addEventListener("resize", debouncedMeasure);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener("resize", debouncedMeasure);
      };
    }
  }, [measure, debounceMs]);

  return { ref, size };
}

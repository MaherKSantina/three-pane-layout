import { useParentSize } from "./useParentSize";

export function ParentSize({ debounceMs = 200, children }) {
  const { ref, size } = useParentSize(debounceMs);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {children(size)}
    </div>
  );
}
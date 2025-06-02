import { useEffect, useRef } from "react";

export function CraftAggregatedSyncBridge({ sourceStore, aggregatedStore, handleCraftTreeWithAsyncNodes }) {
  // Only process nodes when they change (shallow check)
  const prevNodesRef = useRef();

  useEffect(() => {
    // Process current state at mount (handles Zustand rehydration)
    const state = sourceStore.getState();
    if (state.nodes && state.nodes !== prevNodesRef.current) {
      prevNodesRef.current = state.nodes;
      (async () => {
        aggregatedStore.getState().setLoading(true);
        const result = await handleCraftTreeWithAsyncNodes(state.nodes);
        aggregatedStore.getState().setNodes(result || {});
        aggregatedStore.getState().setLoading(false);
      })();
    }

    // Now subscribe to future changes
    const unsub = sourceStore.subscribe(
      async (s, prev) => {
        if (s.nodes && s.nodes !== prevNodesRef.current) {
          prevNodesRef.current = s.nodes;
          aggregatedStore.getState().setLoading(true);
          const result = await handleCraftTreeWithAsyncNodes(s.nodes);
          aggregatedStore.getState().setNodes(result || {});
          aggregatedStore.getState().setLoading(false);
        }
      },
      state => state // subscribe to all changes
    );
    return () => unsub();
  }, [sourceStore, aggregatedStore, handleCraftTreeWithAsyncNodes]);

  return null;
}
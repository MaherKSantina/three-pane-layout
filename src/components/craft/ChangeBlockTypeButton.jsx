import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { useCraftStore } from "../../contexts/StoreContext";
import { useEditor } from "@craftjs/core";

export function ChangeBlockTypeForm({ nodeId }) {
  const [typeInput, setTypeInput] = useState("");
  const [error, setError] = useState("");
  const nodes = useCraftStore().getState().nodes;
  const setNodes = useCraftStore().getState().setNodes;

  const { actions } = useEditor();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const newTypeString = typeInput.trim();

    if (!newTypeString) {
      setError("Please enter a component type name.");
      return;
    }

    // Defensive: check node exists
    if (!nodes[nodeId]) {
      setError("Node not found!");
      return;
    }

    // 1. Deep clone the nodes object (to avoid direct mutation, which breaks reactivity)
    const newNodes = JSON.parse(JSON.stringify(nodes));

    // 2. Update the target node
    newNodes[nodeId].type = {
      ...(newNodes[nodeId].type || {}),
      resolvedName: newTypeString,
    };
    newNodes[nodeId].displayName = newTypeString;

    // 3. Update the store
    setNodes(newNodes);
    actions.deserialize(newNodes)

    setTypeInput("");
    setTimeout(() => {
        actions.selectNode(nodeId);
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Block Type"
          variant="outlined"
          size="small"
          value={typeInput}
          onChange={(e) => setTypeInput(e.target.value)}
          error={!!error}
          helperText={
            error ||
            "Enter the component name (e.g., CraftableRectangle2)"
          }
          sx={{ minWidth: 200 }}
        />
        <Button type="submit" variant="contained">
          Change Type
        </Button>
      </Stack>
    </form>
  );
}

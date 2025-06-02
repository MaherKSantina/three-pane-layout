import { Box, Chip, Grid, Typography, Button as MaterialButton } from "@mui/material";
import { useEditor } from "@craftjs/core";
import React from "react";
import { ChangeBlockTypeButton, ChangeBlockTypeForm } from "./ChangeBlockTypeButton";

export const SettingsPanel = () => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if ( currentNodeId ) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings
      };
    }

    return {
      selected
    }
  });

  return <Box bgcolor="rgba(0, 0, 0, 0.06)" mt={2} px={2} py={2} width={"400px"}>
  <Grid container direction="column" spacing={0}>
    <Grid item>
      <Box pb={2}>
        <Grid container alignItems="center">
          <Grid item xs><Typography variant="subtitle1">Selected</Typography></Grid>
          <Grid item><Chip size="small" color="primary" label={selected?.name} /></Grid>
        </Grid>
      </Box>
    </Grid>
    { 
      selected?.settings && React.createElement(selected?.settings)
    }
    <MaterialButton
      variant="contained"
      color="default"
    >
      Delete
    </MaterialButton>
    <ChangeBlockTypeForm nodeId={selected?.id}></ChangeBlockTypeForm>
  </Grid>
</Box>
}
import * as React from 'react';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

export default function NodeSettings({ selectedNodeId, multiSelectedNodeId, allowsChildrenAndLabel, selectedEdgeId, hasChildren = false, value, onValueChange, onAddNode, onDelete, onLink }) {
  return (
    <Box>
        <Grid container direction="column" spacing={2}>
            <Grid>
            {!multiSelectedNodeId && 
            ((selectedNodeId && !hasChildren) || 
            (selectedNodeId && hasChildren && allowsChildrenAndLabel)) || 
            selectedEdgeId ? <TextField
                label="Value"
                value={value}
                onChange={e => onValueChange?.(e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
            /> : null}
            </Grid>
            <Grid>
            <Button onClick={ () => onAddNode?.()}>Add</Button>
            {selectedNodeId || selectedEdgeId ? <Button onClick={ () => onDelete?.()}>Delete</Button> : null}
            {multiSelectedNodeId ? <Button onClick={ () => onLink?.()}>Link</Button> : null}
            </Grid>
            {/* You can add more fields or content here */}
        </Grid>
      </Box>
  );
}

import { Box, Button, TextField, Typography } from '@mui/material';
import { MatrixEditorView } from './MatrixEditorView';

const meta = {
  component: MatrixEditorView,
};

export default meta;

export const Default = {
  render() {
    return (
    <MatrixEditorView
      matrixId={2}
      renderRightPane={({ cell, matrix, closePane, updateCell, deleteCell }) => {
        if (!cell) return null;
        const { x, y, value = "" } = cell;

        return (
          <Box sx={{ p: 2, display: "grid", gap: 2 }}>
            <Typography variant="overline">Cell ({x}, {y})</Typography>

            <TextField
              label="Value"
              size="small"
              value={value}
              onChange={(e) => updateCell({ value: e.target.value })}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => updateCell({ value: `${value}!` })}
              >
                Append !
              </Button>
              <Button
                color="error"
                onClick={() => {
                  deleteCell({ x, y });
                  closePane();
                }}
              >
                Clear Cell
              </Button>
            </Box>

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Matrix size: {matrix?.width} × {matrix?.height}
            </Typography>
          </Box>
        );
      }}
    />
  );
  }
};
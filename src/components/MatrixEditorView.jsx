import { useEffect, useState, useCallback } from "react";
import { useMatrixStore } from "../stores/matrixStore";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import {
  Button, IconButton, Divider, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MatrixDOMView from "./MatrixDOMView";

export function MatrixEditorView({
  matrixId,
  identifier = "matrices",
  renderRightPane,
  rightPaneWidth = 360,
}) {
  const {
    matrix,
    setMatrixId,
    fetchMatrix,
    upsertCell,
    deleteCell,
    addColAt,
    addRowAt,
    deleteRowAt,
    deleteColAt,
  } = useMatrixStore(identifier);

  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    setMatrixId(matrixId);
    fetchMatrix(matrixId);
    setSelectedCell(null);
  }, [matrixId, setMatrixId, fetchMatrix]);

  const closePane = useCallback(() => setSelectedCell(null), []);

  const handleDeleteCell = async ({ x, y }) => await deleteCell({ x, y });
  const handleCellClick = (cell) => setSelectedCell(cell.cell);

  const updateCell = useCallback(
    async (partial) => {
      if (!selectedCell) return;
      const next = { ...selectedCell, ...partial };
      await upsertCell(next);
      setSelectedCell(next);
      await fetchMatrix(matrixId);
    },
    [selectedCell, upsertCell, fetchMatrix, matrixId]
  );

  const pane = renderRightPane({
    cell: selectedCell,
    matrix,
    closePane,
    updateCell,
    upsertCell,
    deleteCell,
    addRowAt,
    addColAt,
    deleteRowAt,
    deleteColAt,
  });

  return (
    <Box sx={{ height: "100%", width: "100%", minHeight: 0, minWidth: 0 }}>
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          minHeight: 0,
          minWidth: 0,
          // Responsive: always side by side, never overlay
          flexWrap: "nowrap",
          "& > *": { minWidth: 0, minHeight: 0 },
        }}
      >
        {/* LEFT: matrix area (takes remaining space, scrolls both axes) */}
        <Grid item sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, height: "100%" }}>
          {/* Top bar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <Button onClick={() => fetchMatrix(matrixId)}>Refresh</Button>
          </Box>
          {/* Scroll container: matrix view vertical scroll only */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "visible",
              display: "block",
            }}
          >
            <MatrixDOMView
              width="100%"
              height="100%"
              matrix={matrix}
              onCellClick={handleCellClick}
              onAddCol={(c) => addColAt(c)}
              onAddRow={(c) => addRowAt(c)}
              onDeleteCell={handleDeleteCell}
              onDeleteRow={(c) => deleteRowAt(c)}
              onDeleteCol={(c) => deleteColAt(c)}
              onKeyDown={() => {}}
              onAddEmptyCell={(x, y) => upsertCell({ x, y })}
            />
          </Box>
        </Grid>
        {/* RIGHT: fixed-width details pane (always side by side) */}
        {selectedCell && (
          <Grid
            item
            sx={{
              width: rightPaneWidth,
              minWidth: rightPaneWidth,
              maxWidth: rightPaneWidth,
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid",
              borderColor: "divider",
              height: "100%",
              alignSelf: "stretch",
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 1 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                Details
              </Typography>
              <IconButton size="small" onClick={closePane}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ flex: 1, height: "100%", overflowY: "auto" }}>
              {pane}
              <Button variant="contained" onClick={() => closePane()}>
                X
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

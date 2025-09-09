import { useEffect, useState, useCallback } from "react";
import { useMatrixStore } from "../stores/matrixStore";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import {
  Button, Drawer, IconButton, Divider, Typography,
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
    // The outer Box must be allowed to grow to fill parent height so the left
    // column can scroll. Ensure a height is set by the parent (e.g., 100vh).
    <Box sx={{ height: "100%", minHeight: 0 }}>
      <Grid
        container
        // Desktop/tablet: two columns -> grow + fixed sidebar
        // Mobile: single column (sidebar hidden; Drawer handles it)
        sx={{
          height: "100%",
          minHeight: 0,
          // Prevent the grow column from forcing the container to expand
          "& > *": { minWidth: 0, minHeight: 0 },
        }}
      >
        {/* LEFT: matrix area (takes remaining space, scrolls both axes) */}
        <Grid size="grow" sx={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
          {/* Top bar (non-sticky on mobile, easy to make sticky if you want) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, borderBottom: "1px solid", borderColor: "divider" }}>
            <Button onClick={() => fetchMatrix(matrixId)}>Refresh</Button>
          </Box>

          {/* Scroll container: both vertical & horizontal */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: "auto", // enables both X and Y scrolling
              // Optional: ensure wide content doesn't collapse
              "& > *": { width: "max-content" },
              display: { xs: "block", sm: "block" },
            }}
          >
            <MatrixDOMView
              width={2000}
              height={2000}
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

        {/* RIGHT: fixed-width details pane (visible >= sm only) */}
        {selectedCell && (
          <Grid
            size="auto"
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              width: rightPaneWidth,          // fixed width
              borderLeft: "1px solid",
              borderColor: "divider",
              // Make the pane independently scrollable without affecting left
              height: "100%",
              position: "sticky",
              top: 0,
              alignSelf: "start",             // keep sticky scoped to grid row
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
            <Box sx={{ flex: 1, overflow: "auto" }}>
              {pane}
              <Button variant="contained" onClick={() => closePane()}>
            X
          </Button>
              </Box>
          </Grid>
        )}
      </Grid>

      {/* Mobile: slide-over details */}
      <Drawer
        anchor="right"
        open={Boolean(selectedCell)}
        onClose={closePane}
        sx={{ display: { xs: "block", sm: "none" } }}
        PaperProps={{ sx: { width: rightPaneWidth, maxWidth: "90vw" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Details
          </Typography>
          <IconButton onClick={closePane}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ overflow: "auto", flex: 1 }}>
          {pane}
          <Button variant="contained" onClick={() => closePane()}>
            X
          </Button>
          </Box>
      </Drawer>
    </Box>
  );
}

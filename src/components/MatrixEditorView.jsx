import { useEffect, useState, useMemo, useCallback } from "react";
import { useMatrixStore } from "../stores/matrixStore";
import {
  Box, Button, Drawer, IconButton, Divider, Typography,
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
      })

  return (
    <Box sx={{ display: "flex", gap: 0 }}>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Button onClick={() => fetchMatrix(matrixId)}>Refresh</Button>
        </Box>

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

      {selectedCell && (
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            width: rightPaneWidth,
            borderLeft: "1px solid",
            borderColor: "divider",
            height: "100%",
            position: "sticky",
            top: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 1 }}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>Details</Typography>
            <IconButton size="small" onClick={closePane}><CloseIcon fontSize="small" /></IconButton>
          </Box>
          <Divider />
          <Box sx={{ flex: 1, overflow: "auto" }}>{pane}</Box>
        </Box>
      )}

      <Drawer
        anchor="right"
        open={Boolean(selectedCell)}
        onClose={closePane}
        sx={{ display: { xs: "block", sm: "none" } }}
        PaperProps={{ sx: { width: rightPaneWidth, maxWidth: "90vw" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>Details</Typography>
          <IconButton onClick={closePane}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <Box sx={{ overflow: "auto", flex: 1 }}>{pane}</Box>
      </Drawer>
    </Box>
  );
}

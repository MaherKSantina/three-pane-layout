import { useEffect, useState } from "react";
import { useMatrixStore } from "../stores/matrixStore";
import MatrixKonvaView from "./MatrixKonvaView";
import { Box, Button, Dialog, TextField } from "@mui/material";
import MatrixDOMView from "./MatrixDOMView";


export function MatrixEditorView({ matrixId, identifier = "matrices" }) {
  const {
    matrix,
    setMatrixId,
    fetchMatrix,
    upsertCell,
    deleteCell,
    addColAt,
    addRowAt,
    deleteRowAt,
    deleteColAt
  } = useMatrixStore(identifier);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [draftText, setDraftText] = useState("");
  const [draftAgent, setDraftAgent] = useState("");

  useEffect(() => {
    setMatrixId(matrixId);
    fetchMatrix(matrixId);
  }, [matrixId, setMatrixId, fetchMatrix]);

  const handleDeleteCell = async ({ x, y }) => await deleteCell({ x, y });

  const handleCellClick = ({ x, y, cell }) => {
    setSelectedCell({ x, y, cell });
    setDraftText(cell?.text ?? "");
    setDraftAgent(cell?.agent ?? "");
    setDialogOpen(true);
  };
  const handleDialogSave = async () => {
    const { x, y } = selectedCell;
    await upsertCell({
      x, y,
      text: draftText === "" ? null : draftText,
      agent: (selectedCell && selectedCell.y % 2 === 0) ? (draftAgent === "" ? null : draftAgent) : null,
    });
    setDialogOpen(false);
  };

  const isRowEmpty = (row) => row.every(cell => !cell || !cell.text);
  const isColEmpty = (matrix, colIdx) => matrix.every(row => !row[colIdx] || !row[colIdx]?.text);

  const onKeyDown = async (key) => {
    // if (key === "down") await shift({ y: 1 });
    // if (key === "right") await shift({ x: 1 });
    // if (key === "up") await shift({ y: -1 })
    // if (key === "left") await shift({ x: -1 })
  };

  return (
    <>
    <Button onClick={() => fetchMatrix(matrixId)}>Refresh</Button>
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
        onKeyDown={onKeyDown}
        onAddEmptyCell={(x, y) => upsertCell({x, y})}
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Box p={3} minWidth={320} display="flex" flexDirection="column" gap={2}>
          <div>Edit Cell at ({selectedCell?.x},{selectedCell?.y})</div>
          <TextField
            label="Message Text"
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            fullWidth
            autoFocus
          />
          {selectedCell && selectedCell.y % 2 === 0 && (
            <TextField
              label="Agent"
              value={draftAgent}
              onChange={e => setDraftAgent(e.target.value)}
              fullWidth
            />
          )}
          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={handleDialogSave}
              disabled={draftText === ""}
            >
              Save
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button color="error" onClick={() => {
              handleDeleteCell(selectedCell);
              setDialogOpen(false);
            }}>
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

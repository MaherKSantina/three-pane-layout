import { Box, Dialog, TextField, Button } from '@mui/material';
import MatrixKonvaView from './MatrixKonvaView';
import { useState } from 'react';

export default {
  component: MatrixKonvaView,
};

export const Default = {
  render() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [draftText, setDraftText] = useState("");
    const [draftAgent, setDraftAgent] = useState("");
    const [matrix, setMatrix] = useState([
      [ { text: "login", agent: "LoginHandler" }, { text: "email", agent: "main" }, { text: "getValidEmail", agent: "EmailDatabase" } ],
      [ null, { text: "maher.santina90@gmail.com" }, { text: "maher.santina90@gmail.com" } ],
      [ null, { text: "password", agent: "main" }, { text: "getValidPassword", agent: "PasswordDatabase" }, { text: "email", agent: "main" } ],
      [ { text: "done" }, { text: "correctpassword" }, { text: "correctpassword" }, { text: "maher.santina90@gmail.com" } ],
    ]);

    // Add new column to a specific row
    const handleAddCol = (y) => {
      setMatrix(prev => {
        const updated = prev.map((row, i) =>
          i === y ? [...row, null] : row
        );
        return updated;
      });
    };

    // Add new row
    const handleAddRow = () => {
      const maxCols = Math.max(...matrix.map(r => r.length));
      setMatrix(prev => [
        ...prev,
        Array.from({ length: maxCols }, () => null)
      ]);
    };

    // Cell click (edit or add)
    const handleCellClick = ({ x, y, cell }) => {
      setSelectedCell({ x, y, cell });
      setDraftText(cell?.text || "");
      setDraftAgent(cell?.agent || "");
      setDialogOpen(true);
    };

    // Delete cell (including empty)
    const handleDeleteCell = ({ x, y }) => {
      setMatrix(prev => {
        let newItem = JSON.parse(JSON.stringify(prev))
        newItem[y].splice(x, 1)
        return newItem
      });
      setDialogOpen(false);
    };

    // Delete entire row
    const handleDeleteRow = (y) => {
      setMatrix(prev => prev.filter((row, i) => i !== y));
    };

    // Dialog save (edit or add)
    const handleDialogSave = () => {
      const { x, y } = selectedCell;
      setMatrix(prev =>
        prev.map((row, j) =>
          j === y
            ? row.map((cell, i) =>
                i === x
                  ? y % 2 === 0
                    ? { text: draftText, agent: draftAgent }
                    : { text: draftText }
                  : cell
              )
            : row
        )
      );
      setDialogOpen(false);
    };

    const isRowEmpty = (row) => row.every(cell => !cell || !cell.text);
const isColEmpty = (matrix, colIdx) => matrix.every(row => !row[colIdx] || !row[colIdx]?.text);

const onKeyDown = (key) => {
  setMatrix(prev => {
    let matrix = JSON.parse(JSON.stringify(prev)); // Deep clone

    if (key === "down") {
      // Add empty row at the top
      const cols = matrix[0]?.length || 1;
      matrix = [Array(cols).fill(null), ...matrix];
    }

    if (key === "right") {
      // Add empty column at beginning
      matrix = matrix.map(row => [null, ...row]);
    }

    if (key === "up") {
      // Remove row at top if it's all empty
      if (matrix.length > 0 && isRowEmpty(matrix[0])) {
        matrix = matrix.slice(1);
      }
    }

    if (key === "left") {
      // Remove first column if it's all empty
      if (
        matrix.length > 0 &&
        matrix[0].length > 0 &&
        isColEmpty(matrix, 0)
      ) {
        matrix = matrix.map(row => row.slice(1));
      }
    }

    return matrix;
  });
};

    return (
      <>
        <MatrixKonvaView
          width={1200}
          height={700}
          matrix={matrix}
          onCellClick={handleCellClick}
          onAddCol={handleAddCol}
          onAddRow={handleAddRow}
          onDeleteCell={handleDeleteCell}
          onDeleteRow={handleDeleteRow}
          onKeyDown={onKeyDown}
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
                disabled={!draftText.trim()}
              >
                Save
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button color="error" onClick={() => handleDeleteCell(selectedCell)}>
                Delete
              </Button>
            </Box>
          </Box>
        </Dialog>
      </>
    );
  }
};

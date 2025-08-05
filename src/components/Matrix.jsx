import { Box, Grid, Dialog, Button } from '@mui/material';
import { useState } from 'react';

export default function Matrix({ matrix }) {
    const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  const handleCellClick = (x, y) => {
    setSelectedCell({ x, y, value: matrix[y][x].value });
    setDialogOpen(true);
  };

  return (
    <>
    <Box>
      <Grid container direction="column">
        {matrix?.map((row, y) => (
          <Grid container key={y}>
            {row.map((cell, x) => (
              <Grid key={x} size="auto">
                <Box
                  onClick={() => handleCellClick(x, y)}
                  sx={{
                    border: '1px solid #ccc',
                    width: 60, height: 60,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {cell.value}
                </Box>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Box p={2}>
          <div>Cell at ({selectedCell?.x},{selectedCell?.y})</div>
          <div>Value: {selectedCell?.value}</div>
        </Box>
      </Dialog>
    </>
  );
}
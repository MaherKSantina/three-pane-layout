import * as React from 'react';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';

const CELL_W = 120;
const CELL_H = 60;
const GAP = 8;
const ADD = 22;

const Cell = styled('div')(({ theme }) => ({
  width: CELL_W, // lock cell width
  height: CELL_H,
  border: '1.5px solid #b0b4ba',
  borderRadius: 8,
  background: '#fafbfc',
  padding: 8,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  cursor: 'pointer',
  ...theme.applyStyles('dark', { background: '#111418', borderColor: '#2a2f36' }),
}));

const Filled = styled(Cell)({
  background: '#e3ecfd',
});

const Kill = styled('button')({
  position: 'absolute',
  top: 4,
  right: 4,
  border: 0,
  background: 'transparent',
  color: '#d32f2f',
  fontWeight: 700,
  cursor: 'pointer',
  lineHeight: 1,
});

const AddDot = styled('button')({
  width: ADD,
  height: ADD,
  borderRadius: 999,
  border: '1px solid #2e7d32',
  background: '#e8f5e9',
  cursor: 'pointer',
  fontWeight: 700,
});

const DeletePill = styled('button')({
  height: CELL_H,
  borderRadius: 6,
  border: '1px solid #d32f2f',
  background: '#fde6e6',
  color: '#d32f2f',
  cursor: 'pointer',
  padding: '0 8px',
});

export default function MatrixDOMView({
  matrix,
  onCellClick,
  onAddCol,
  onAddRow,
  onDeleteCell,
  onDeleteRow,
  onDeleteCol,
}) {
  const maxCols = React.useMemo(
    () => Math.max(0, ...matrix.map((r) => r.length)),
    [matrix]
  );

  return (
    <Box sx={{ p: 2, width: '100%', minWidth: 0, overflow: 'auto' }}>
      <Box sx={{ width: 'max-content' }}>
        {/* Top rail: (corner spacer) + add/delete for each col */}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          {/* corner spacer */}
          <Grid size="auto">
            <Box sx={{ width: CELL_W }} />
          </Grid>

          {Array.from({ length: maxCols + 1 }).map((_, colIndex) => (
            <Grid key={`col-rail-${colIndex}`} size="auto">
              <Box
                sx={{
                  width: CELL_W,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {/* Only show delete if this is not the extra end slot */}
                {colIndex < maxCols && (
                  <DeletePill onClick={() => onDeleteCol(colIndex)}>
                    {`Delete-${colIndex}`}
                  </DeletePill>
                )}
                {/* Add before this column index (so last index adds at the end) */}
                <AddDot onClick={() => onAddCol(colIndex)}>+</AddDot>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Matrix rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
          {Array.from({ length: matrix.length + 1 }).map((_, rowIndex) => {
            // The extra row at the bottom is only the controls, no cells
            const isExtraRow = rowIndex >= matrix.length;
            const row = matrix[rowIndex] || [];

            return (
              <Box
                key={`row-${rowIndex}`}
                sx={{ display: 'flex', flexDirection: 'row', gap: GAP, alignItems: 'center', flexWrap: 'nowrap' }}
              >
                {/* Left rail: delete row (except for last extra slot) + add */}
                <Box sx={{ width: CELL_W, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {!isExtraRow && (
                    <DeletePill
                      style={{ height: CELL_H - ADD * 2 }}
                      onClick={() => onDeleteRow(rowIndex)}
                    >
                      {`Delete-${rowIndex}`}
                    </DeletePill>
                  )}
                  <AddDot onClick={() => onAddRow(rowIndex)}>+</AddDot>
                </Box>

                {/* Render cells only if not the extra end row */}
                {!isExtraRow &&
                  row.map((cell, colIndex) => {
                    const Comp = cell && cell.text ? Filled : Cell;
                    return (
                      <Box key={`cell-${colIndex}-${rowIndex}`} sx={{ width: CELL_W }}>
                        <Comp onClick={() => onCellClick({ x: colIndex, y: rowIndex, cell })}>
                          {!!(cell && cell.text) && (
                            <>
                              <div style={{ 
                                textAlign: 'center', 
                                fontSize: 16 ,
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={cell.text}>
                                {cell.text}
                              </div>
                              {typeof cell.agent === 'string' && (
                                <div
                                  style={{
                                    marginTop: 'auto',
                                    fontSize: 12,
                                    textAlign: 'right',
                                    color: '#7296d8',
                                  }}
                                >
                                  {cell.agent}
                                </div>
                              )}
                            </>
                          )}
                          <Kill
                            aria-label="delete cell"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCell({ x: colIndex, y: rowIndex });
                            }}
                          >
                            ×
                          </Kill>
                        </Comp>
                      </Box>
                    );
                  })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

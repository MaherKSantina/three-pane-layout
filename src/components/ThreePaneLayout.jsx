import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

export function ThreePaneLayout({
  left,
  middle,
  right,
  leftWidth = '15%',     // 🧠 Now percentages!
  rightWidth = '15%',
  height = '100%',
  gap = 0,               // spacing in theme units (e.g., 0 = 0px, 1 = 8px)
}) {
  return (
    <Box sx={{ flexGrow: 1, height, overflow: 'hidden' }}>
      <Grid
        container
        spacing={gap}
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateColumns: `${leftWidth} 1fr ${rightWidth}`,  // 🧠 Set percentages here!
        }}
      >
        {/* Left Pane */}
        <Grid sx={{ borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          {typeof left === 'string' ? <Box p={2}>{left}</Box> : left}
        </Grid>

        {/* Middle Pane */}
        <Grid sx={{ overflow: 'auto' }}>
          {typeof middle === 'string' ? <Box p={2}>{middle}</Box> : middle}
        </Grid>

        {/* Right Pane */}
        <Grid sx={{ borderLeft: 1, borderColor: 'divider', overflow: 'auto' }}>
          {typeof right === 'string' ? <Box p={2}>{right}</Box> : right}
        </Grid>
      </Grid>
    </Box>
  );
}

ThreePaneLayout.propTypes = {
    height: PropTypes.string
}
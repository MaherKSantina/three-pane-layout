// SplitPane.jsx
import React, { useState } from 'react';
import { Box, Slider } from '@mui/material';

/**
 * SplitPane
 * 
 * Props:
 *  - left:    React node for left pane
 *  - right:   React node for right pane
 *  - initialSplit: number (0–100) initial % width of left pane
 */
export default function SplitPane({ left, right, initialSplit = 50, height }) {
  const [split, setSplit] = useState(initialSplit);

  const handleSliderChange = (e, newValue) => {
    setSplit(newValue);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: height ?? '100vh', 
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Panes */}
      <Box sx={{ display: 'flex', flexGrow: 1, width: '100%' }}>
        <Box 
          sx={{ 
            width: `${split}%`, 
            overflow: 'auto',
            borderRight: 1, 
            borderColor: 'divider',
            p: 2,
          }}
        >
          {left}
        </Box>
        <Box 
          sx={{ 
            width: `${100 - split}%`, 
            overflow: 'auto',
            p: 2,
          }}
        >
          {right}
        </Box>
      </Box>

      {/* Slider */}
      <Box sx={{ px: 2, py: 1 }}>
        <Slider
          value={split}
          onChange={handleSliderChange}
          aria-label="Split Percentage"
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
}

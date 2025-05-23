import React, { useState } from 'react';
import { Slider } from '@mui/material';

/**
 * SplitPane
 *
 * Props:
 *  - left:    React node for left pane
 *  - right:   React node for right pane
 *  - initialSplit: number (0–100) initial % width of left pane
 *  - height:  CSS height for container (defaults to 100vh)
 */
export default function SplitPane({ left, right, initialSplit = 50, height = '100vh' }) {
  const [split, setSplit] = useState(initialSplit);

  const handleSliderChange = (e, newValue) => {
    setSplit(newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Panes container */}
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          width: '100%',
        }}
      >
        <div
          style={{
            width: `${split}%`,
            overflow: 'auto',
            borderRight: '1px solid #ccc',
          }}
        >
          {left}
        </div>
        <div
          style={{
            width: `${100 - split}%`,
            overflow: 'auto',
          }}
        >
          {right}
        </div>
      </div>

      {/* Slider */}
      <div style={{ padding: '0 8px' }}>
        <Slider
          value={split}
          onChange={handleSliderChange}
          aria-label="Split Percentage"
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Slider } from '@mui/material';

/**
 * VerticalSplitPane
 *
 * Props:
 *  - top:    React node for the top pane
 *  - bottom: React node for the bottom pane
 *  - initialSplit: number (0–100) initial % height of the top pane
 *  - width: optional fixed width of the whole split (default 100%)
 *  - height: CSS height for container (defaults to 100vh)
 */
export default function VerticalSplitPane({
  top,
  bottom,
  initialSplit = 50,
  width,
  height = '100vh',
}) {
  const [split, setSplit] = useState(initialSplit);

  const handleSliderChange = (_e, newValue) => {
    setSplit(100 - newValue);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: width ?? '100%',
        height,
        overflow: 'hidden',            // hide parent overflow
      }}
    >
      {/* Panes stacked vertically */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',             // fill parent height
          height: '100%',               // explicit height for flex sizing
          minHeight: 0,                 // allow children to shrink
          overflow: 'hidden',           // hide overflow, let child panes scroll
        }}
      >
        <div
          style={{
            flex: `0 0 ${split}%`,     // fixed split percent
            minHeight: 0,
            overflow: 'auto',            // scroll if content overflows
            borderBottom: '1px solid #ccc',
          }}
        >
          {top}
        </div>
        <div
          style={{
            flex: `0 0 ${100 - split}%`,
            minHeight: 0,
            overflow: 'auto',            // scroll if content overflows
          }}
        >
          {bottom}
        </div>
      </div>

      {/* Vertical slider */}
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
        }}
      >
        <Slider
          value={100 - split}
          onChange={handleSliderChange}
          orientation="vertical"
          aria-label="Vertical Split Percentage"
          min={0}
          max={100}
          valueLabelDisplay="auto"
        />
      </div>
    </div>
  );
}

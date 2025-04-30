import React from 'react';
import { ThreePaneLayout } from './ThreePaneLayout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { FigmaLeftPane } from './FigmaLeftPane';
import ProcessFlow from './ProcessFlow';

export function FigmaLayout({height = "100%", navigatorWidth = "15%"}) {
  return (
    <ThreePaneLayout
    height={height}
    leftWidth={navigatorWidth}
  left={<FigmaLeftPane pages={["Page 1", "Page 2", "Page 3"]} selected={"Page 2"}></FigmaLeftPane>}
  middle={<ProcessFlow></ProcessFlow>}
  right={<Box p={2}>Right Inspector Content</Box>}
/>
  );
}

import React from 'react';
import { ThreePaneLayout } from './ThreePaneLayout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

export function XCodeLayout({height = "100%", navigatorWidth = "30%"}) {
  return (
    <ThreePaneLayout
    height={height}
    leftWidth={navigatorWidth}
  left={<Box p={2}>Left Pane Content</Box>}
  middle={<Box p={2}>Middle Editor Content</Box>}
  right={<Box p={2}>Right Inspector Content</Box>}
/>
  );
}

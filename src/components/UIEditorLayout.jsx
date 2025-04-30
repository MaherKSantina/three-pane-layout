import React, { useEffect } from 'react';
import { ThreePaneLayout } from './ThreePaneLayout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { FigmaLeftPane } from './FigmaLeftPane';
import ProcessFlow from './ProcessFlow';
import MonacoEditor from './MonacoEditor';

export function UIEditorLayout({height = "100%", navigatorWidth = "15%", pages, selected, code, onPageChange, onCodeChange}) {
  return (
    <ThreePaneLayout
    height={height}
    leftWidth={navigatorWidth}
  left={<FigmaLeftPane pages={pages} selected={selected} onChange={onPageChange}></FigmaLeftPane>}
  middle={<MonacoEditor value={code} onChange={onCodeChange}></MonacoEditor>}
  right={<Box p={2}>Right Inspector Content</Box>}
/>
  );
}

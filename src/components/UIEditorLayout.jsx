import React, { useEffect } from 'react';
import { ThreePaneLayout } from './ThreePaneLayout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { FigmaLeftPane } from './FigmaLeftPane';
import ProcessFlow from './ProcessFlow';
import MonacoEditor from './MonacoEditor';
import { usePagesStore } from '../stores/pages';
import { useShallow } from 'zustand/shallow';

export function UIEditorLayout({height = "100%", navigatorWidth = "15%"}) {
    const fetchPages = usePagesStore((state) => state.fetchPages);
    const syncCode = usePagesStore((state) => state.syncCodeToServer);

    useEffect(() => {
    fetchPages();
    }, []);
    const selectPage = usePagesStore(useShallow((state) => state.setSelected))
    const pages = usePagesStore(useShallow((state) => {
        return Object.values(state.pages).map(x => x.title)
    }))
    const selectedPage = usePagesStore(useShallow((state) => {
        return Object.values(state.pages).find(c => c.selected);
    }))
  return (
    <ThreePaneLayout
    height={height}
    leftWidth={navigatorWidth}
  left={<FigmaLeftPane pages={pages} selected={selectedPage?.title} onSelect={selectPage}></FigmaLeftPane>}
  middle={<MonacoEditor value={selectedPage?.code ?? ""} onChange={(text) => syncCode(selectedPage?.key, text)}></MonacoEditor>}
  right={<Box p={2}>Right Inspector Content</Box>}
/>
  );
}

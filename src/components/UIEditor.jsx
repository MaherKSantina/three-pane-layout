import { usePagesStore } from '../stores/pages';
import { useShallow } from 'zustand/shallow';
import { UIEditorLayout } from './UIEditorLayout';
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export function UIEditor({ height = "100%", navigatorWidth = "15%" }) {
    const fetchPages = usePagesStore((state) => state.fetchPages);
    const syncCode = usePagesStore((state) => state.syncCodeToServer);
  
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchPages();
    }, []);
  
    const selectPage = usePagesStore(useShallow((state) => state.setSelected));
    const pages = usePagesStore(useShallow((state) => Object.values(state.pages).map(x => x.title)));
    const selectedPage = usePagesStore(useShallow((state) => Object.values(state.pages).find(c => c.selected)));
  
    const handleCodeChange = async (text) => {
      const errorMessage = await syncCode(selectedPage?.key, text);
      if (errorMessage) {
        setError(errorMessage);
      }
    };
  
    return (
      <>
        <UIEditorLayout
          height={height}
          navigatorWidth={navigatorWidth}
          pages={pages}
          selected={selectedPage?.title}
          onPageChange={selectPage}
          code={selectedPage?.code}
          onCodeChange={handleCodeChange}
        />
  
        <Dialog open={!!error} onClose={() => setError(null)}>
          <DialogTitle>YAML Save Error</DialogTitle>
          <DialogContent>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setError(null)}>Okay</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

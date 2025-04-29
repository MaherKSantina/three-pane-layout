import React from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';

export function FigmaTitleWithAccessory({title, action}) {
  return (
    <Grid container alignItems="center" spacing={2} sx={{ width: '100%' }}>
        <Grid>{title}</Grid>

    <Grid sx={{ flexGrow: 1 }} /> {/* Spacer */}

    <Grid>{action}</Grid>
    </Grid>
  );
}

export function FigmaTitleWithAccessoryPreview({title}) {
  return (
    <FigmaTitleWithAccessory title={title} action={<Button>Test</Button>}></FigmaTitleWithAccessory>
  )
}
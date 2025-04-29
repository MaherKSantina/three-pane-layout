import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

export function FigmaSection({title, action, details}) {
  return (
    <Grid container alignItems="center" direction={"column"} spacing={2}>
        <Grid container alignItems="center" spacing={2} sx={{ width: '100%' }}>
            <Grid>{title}</Grid>

            <Grid sx={{ flexGrow: 1 }} /> {/* Spacer */}

            <Grid>{action}</Grid>
        </Grid>
        {/* <Grid container alignItems="center" spacing={2} sx={{ width: '100%' }}> */}
        {details}
        {/* </Grid> */}
    </Grid>
  );
}
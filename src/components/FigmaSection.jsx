import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FigmaTitleWithAccessory } from './FigmaTitleWithAccessory';
import { ZoomIn } from '@mui/icons-material';

export function FigmaSection({title, action, children}) {
  return (
    <Grid container alignItems="center" direction={"column"} spacing={2}>
        <FigmaTitleWithAccessory title={title} action={action}></FigmaTitleWithAccessory>
        {children}
        {/* </Grid> */}
    </Grid>
  );
}
import React from 'react';
import Grid from '@mui/material/Grid';
import { FigmaPageOption } from './FigmaPageOption';

export function FigmaPagesOption({pages, selected, onSelect}) {
  return (
    <Grid container alignItems="center" direction={"column"} sx={{width: "100%"}}>
        {pages.map(x => {
          return (
            <FigmaPageOption title={x} isSelected={selected === x} onClick={() => onSelect?.(x)}></FigmaPageOption>
          )
        })}
    </Grid>
  );
}
import React from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FigmaTitleWithAccessory } from './FigmaTitleWithAccessory';
import { Architecture, PersonAdd, Search, ZoomIn } from '@mui/icons-material';
import { FigmaPageOption } from './FigmaPageOption';
import IconMenu from './IconMenu';
import { FigmaSection } from './FigmaSection';
import { FigmaPagesOption } from './FigmaPagesOption';

export function FigmaLeftPane({pages, selected, onChange}) {
  return (
    <Grid container alignItems="center" direction={"column"}>
        <Grid alignItems="center" sx={{width: "100%"}}>
        <IconMenu icon={<Architecture></Architecture>} items={["File", "Edit", "View"]}></IconMenu>
        <Grid sx={{ flexGrow: 1 }} /> {/* Spacer */}
        </Grid>
        <Grid alignItems="center" sx={{width: "100%"}}>
            <FigmaSection title={"Pages"} action={<Search></Search>}>
            <FigmaPagesOption pages={pages} selected={selected} onSelect={onChange}></FigmaPagesOption>
            </FigmaSection>
            </Grid>
    </Grid>
  );
}
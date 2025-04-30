import React from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

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

FigmaTitleWithAccessory.propTypes = {
  /** The title of the tile */
  title: PropTypes.string,
  /** The accessory element */
  action: PropTypes.node,
};
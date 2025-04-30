import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

export function FigmaPageOption({ title, isSelected = false, onClick }) {
  return (
    <Box
    onClick={onClick}
    role="button"
      sx={{
        backgroundColor: isSelected ? 'grey.300' : 'transparent',
        borderRadius: 1, // 8px rounded corners
        px: 2,            // horizontal padding
        py: 1,            // vertical padding
        boxSizing: 'border-box',
        display: 'inline-block',
        width: "100%",
        cursor: 'pointer', // Shows pointer cursor on hover
        userSelect: 'none', // Prevents unwanted text selection
        '&:hover': {
          backgroundColor: isSelected ? 'grey.400' : 'grey.100',
        },
      }}
    >
      {title}
    </Box>
  );
}

FigmaPageOption.propTypes = {
    /** Title of the page */
    title: PropTypes.string,
    /** Is this page selected? */
    isSelected: PropTypes.bool,
    /** On click handler */
    onClick: PropTypes.func,
  };

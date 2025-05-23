import { Box } from '@mui/material';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: { /* … */ },
  },
  // decorators: [
  //   (Story) => (
  //     <Box
  //       component="div"
  //       sx={{
  //         display: 'flex',       // ← make this a flex container
  //         flexDirection: 'column',// ← stack children top-to-bottom
  //         width: '100%',
  //         height: '100%',
  //         margin: 0,
  //         flexGrow: 1,
  //         minHeight: 0,
  //       }}
  //     >
  //       <Story />
  //     </Box>
  //   ),
  // ],
};

export default preview;

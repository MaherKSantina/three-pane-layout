import { Box } from '@mui/material';
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: '100%', height: '100%', margin: 0 }}>
        <Story />
      </Box>
    ),
  ],
};

export default preview;
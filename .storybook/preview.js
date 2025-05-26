import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: { /* … */ },
  },
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Story />
      </LocalizationProvider>
    ),
  ],
};

export default preview;

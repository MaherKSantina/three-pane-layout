import { Box } from '@mui/material';
import ChatWindow from './ChatWindow';

const meta = {
  component: ChatWindow,
};

export default meta;

export const Default = {
  render() {
    return (
      <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          width: '100%',
          overflow: 'hidden'
        }}>
        <ChatWindow></ChatWindow>
      </Box>
    )
  }
};
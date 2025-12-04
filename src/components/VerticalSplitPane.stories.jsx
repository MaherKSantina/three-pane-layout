import { Box, TextField } from '@mui/material';
import VerticalSplitPane from './VerticalSplitPane';
import { StoreContext } from '../contexts/StoreContext';
import { useLocalKanbanStore } from '../stores/kanban.local';
import KanbanBoard from './KanbanBoard';
import ProcessFlow from './ProcessFlow';
import SplitPane from './SplitPane';
import { useLocalChatStore } from '../stores/chat.local';
import ChatWindow from './chat/ChatWindow';

const meta = {
  component: VerticalSplitPane,
};

export default meta;

export const Default = {
  render() {
    return (
      // <Box sx={{ height: '100vh' }}>
      <VerticalSplitPane
        initialSplit={40}
        top={
          <TextField></TextField>
        }
        bottom={
          <TextField></TextField>
        }
      />
    // </Box>
    )
  }
};

export const Chat = {
  render() {
    return (
      <VerticalSplitPane
        initialSplit={40}
        top={
          <StoreContext.Provider value={useLocalChatStore()}>
            <ChatWindow height={"100%"}></ChatWindow>
          </StoreContext.Provider>
        }
        bottom={
          <StoreContext.Provider value={useLocalChatStore()}>
            <ChatWindow height={"100%"}></ChatWindow>
          </StoreContext.Provider>
        }
      />
    )
  }
};

export const Demo = {
  render() {
    return (
      <VerticalSplitPane
          initialSplit={50}
          top={
            <StoreContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
              <KanbanBoard></KanbanBoard>
            </StoreContext.Provider>
          }
          
        />
    )
  }
};
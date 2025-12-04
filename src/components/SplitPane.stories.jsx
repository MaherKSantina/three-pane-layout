import { TextField } from '@mui/material';
import SplitPane from './SplitPane';
import ChatWindow from './chat/ChatWindow';
import ChatList from './chat/ChatList';
import { StoreContext } from '../contexts/StoreContext';
import { useLocalChatListStore } from '../stores/chatList.local';
import { useLocalChatStore } from '../stores/chat.local';
import KanbanBoard from './KanbanBoard';

const meta = {
  component: SplitPane,
};

export default meta;

export const Default = {
  render() {
    return (
      <SplitPane left={
        <ChatWindow></ChatWindow>
      }
      right={
        <TextField>Halaaaaa</TextField>
      }
      >

      </SplitPane>
    )
  }
};

export const Complicada = {
  render() {
    return (
      <SplitPane initialSplit={"15"} left={
        <StoreContext.Provider value={useLocalChatListStore()}>
          <ChatList />
        </StoreContext.Provider>
        
      }
      right={
        <KanbanBoard></KanbanBoard>
        }
      >

      </SplitPane>
    )
  }
};

export const Chat = {
  args: {
  },
  render() {
    return (
      <SplitPane initialSplit={"15"} left={
        <StoreContext.Provider value={useLocalChatListStore()}>
        <ChatList />
        </StoreContext.Provider>
        
      }
      right={
        <SplitPane height={"100%"} left={
          <StoreContext.Provider value={useLocalChatStore()}>
        <ChatWindow></ChatWindow>
        </StoreContext.Provider>
          
          }
          right={
            <TextField>Information</TextField>
          }
          >
    
          </SplitPane>
        }
      >

      </SplitPane>
    )
  }
};
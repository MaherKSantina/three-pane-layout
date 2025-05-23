import { Box } from '@mui/material';
import ChatWindow from './ChatWindow';
import { ChatContext, StoreContext } from '../contexts/StoreContext';
import { useLocalChatStore } from '../stores/chat.local';

const meta = {
  title: "Visualization/Chat/Window",
  component: ChatWindow,
};

export default meta;

export const Default = {
  render() {
    return (
      <ChatContext.Provider value={useLocalChatStore()}>
          <ChatWindow mode='full'></ChatWindow>
          </ChatContext.Provider>
    )
  }
};


export const Fixed = {
  render() {
    return (
      <ChatContext.Provider value={useLocalChatStore()}>
          <ChatWindow mode='fixed' width={"500px"} height={"500px"}></ChatWindow>
          </ChatContext.Provider>
    )
  }
};
import { StoreContext } from '../contexts/StoreContext';
import { useApiChatListStore } from '../stores/chatList.api';
import { useLocalChatListStore } from '../stores/chatList.local';
import ChatList from './ChatList';

const meta = {
  component: ChatList,
};

export default meta;

export const Local = {
  render() {
    return (
      <StoreContext.Provider value={useLocalChatListStore()}>
          <ChatList />
      </StoreContext.Provider>
    )
  }
};

export const API = {
  render() {
    return (
      <StoreContext.Provider value={useApiChatListStore()}>
          <ChatList />
      </StoreContext.Provider>
    )
  }
};
import ChatListWithDetails from './ChatListWithDetails';

const meta = {
  component: ChatListWithDetails,
};

export default meta;

export const Maher = {
  render() {
    return (
      <ChatListWithDetails agentID={4}></ChatListWithDetails>
    )
  }
};

export const Fatin = {
  render() {
    return (
      <ChatListWithDetails agentID={3}></ChatListWithDetails>
    )
  }
};
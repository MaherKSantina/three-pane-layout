import { ChatContext, StoreContext } from '../contexts/StoreContext';
import { useLocalChatStore } from '../stores/chat.local';
import { useLocalKanbanStore } from '../stores/kanban.local';
import ChatWindow from './ChatWindow';
import KanbanBoard from './KanbanBoard';
import SplitPane from './SplitPane2';
import VerticalSplitPane from './VerticalSplitPane2';

const meta = {
  component: SplitPane,
};

function LocalKanbanBoard() {
  return (
    <StoreContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <KanbanBoard mode="fixed"></KanbanBoard>
    </StoreContext.Provider>
  )
}

export default meta;

export const Default = {
  render() {
    return (
      <SplitPane
        initialSplit={0.4}
        left={<LocalKanbanBoard></LocalKanbanBoard>}
        right={<LocalKanbanBoard/>}
      />
    )
  }
};

export const VerticalInSplit = {
  render() {
    return (
      <SplitPane
        initialSplit={0.4}
        left={<VerticalSplitPane
                initialSplit={0.3}
                top={<LocalKanbanBoard></LocalKanbanBoard>}
                bottom={<LocalKanbanBoard />}
            />}
        right={<LocalKanbanBoard />}
      />
    )
  }
};

export const WithChat = {
  render() {
    return (
      <SplitPane
      height='100%'
        initialSplit={0.3}
        left={<LocalKanbanBoard></LocalKanbanBoard>}
        right={<ChatContext.Provider value={useLocalChatStore()}>
          <ChatWindow mode='fixed'></ChatWindow>
        </ChatContext.Provider>}
      />
    )
  }
};
import { ChatContext, CraftContext, GanttContext, KanbanContext, ProcessContext, StoreContext, TimelineContext } from '../contexts/StoreContext';
import { useLocalChatStore } from '../stores/chat.local';
import { useLocalFlowStore } from '../stores/flow.local';
import { useGanttLocalStore } from '../stores/gantt.local';
import { useLocalKanbanStore } from '../stores/kanban.local';
import { useLocalTimelineStore } from '../stores/timeline.local';
import ChatWindow from './chat/ChatWindow';
import KanbanBoard from './KanbanBoard';
import ProcessFlow from './ProcessFlow';
import GanttChart from './GanttChart';
import SplitPane from './SplitPane2';
import VerticalSplitPane from './VerticalSplitPane2';
import VisTimeline from './VisTimeline';
import EditorPage from './craft/Craft';
import { useCraftLocalStore } from '../stores/craft.local';

const meta = {
  component: VerticalSplitPane,
};

export default meta;

// function LocalKanbanBoard() {
//   return (
//     <StoreContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
//       <KanbanBoard mode="fixed"></KanbanBoard>
//     </StoreContext.Provider>
//   )
// }

export const Default = {
  render() {
    return (
      <KanbanContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <VerticalSplitPane
        initialSplit={0.3}
        top={<KanbanBoard />}
        bottom={<KanbanBoard />}
      />
      </KanbanContext.Provider>
      
    )
  }
};

export const SplitInsideVertical = {
  render() {
    return (
      <ProcessContext.Provider value={useLocalFlowStore("flow-diagram")()}>
        <KanbanContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
        <VerticalSplitPane
          initialSplit={0.3}
          top={<SplitPane
                  initialSplit={0.5}
                  left={<KanbanBoard />}
                  right={<KanbanBoard />}
                />}
          bottom={<ProcessFlow direction="LR"></ProcessFlow>}
        />
        </KanbanContext.Provider>
      </ProcessContext.Provider>
      
    )
  }
};

export const WithChat = {
  render() {
    return (
      <ChatContext.Provider value={useLocalChatStore()}>
        <KanbanContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <VerticalSplitPane
        initialSplit={0.3}
        top={<KanbanBoard></KanbanBoard>}
        bottom={<ChatWindow mode='fixed'></ChatWindow>}
      />
      </KanbanContext.Provider>
      </ChatContext.Provider>
    )
  }
};

export const WithVisTimeline = {
  render() {
    return (
      <TimelineContext.Provider value={useLocalTimelineStore("Timeline/Local")()}>
        <KanbanContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <VerticalSplitPane
        initialSplit={0.3}
        top={<KanbanBoard></KanbanBoard>}
        bottom={ <VisTimeline></VisTimeline> }
      />
      </KanbanContext.Provider>
      </TimelineContext.Provider>
    )
  }
};

export const WithGantt = {
  render() {
    return (
      <GanttContext.Provider value={useGanttLocalStore()}>
        <KanbanContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
      <VerticalSplitPane
        initialSplit={0.3}
        top={<KanbanBoard></KanbanBoard>}
        bottom={ <GanttChart></GanttChart> }
      />
      </KanbanContext.Provider>
      </GanttContext.Provider>
    )
  }
};

export const CraftNGantt = {
  render() {
    let name = "craftngantt"
    return (
      <GanttContext.Provider value={useGanttLocalStore(`${name}/Gantt`)()}>
        <CraftContext.Provider value={useCraftLocalStore(`${name}/Craft`)}>
        <VerticalSplitPane
        initialSplit={0.6}
        top={<EditorPage></EditorPage>}
        bottom={ <GanttChart></GanttChart> }
      />
        </CraftContext.Provider>
      </GanttContext.Provider>
    )
  }
};
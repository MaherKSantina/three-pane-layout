import { Box, TextField } from "@mui/material";
import { ChatContext, KanbanContext, StoreContext, TimelineContext } from "../contexts/StoreContext";
import { useLocalChatStore } from "../stores/chat.local";
import { useLocalKanbanStore } from "../stores/kanban.local";
import ChatWindow from "./chat/ChatWindow";
import KanbanBoard from "./KanbanBoard";
import ProcessFlow from "./ProcessFlow";
import SplitPane from "./SplitPane2";
import VerticalSplitPane from "./VerticalSplitPane2";
import { useLocalFlowStore } from "../stores/flow.local";
import { useLocalTimelineStore } from "../stores/timeline.local";
import VisTimeline from "./VisTimeline";

export default function ContextProcess() {
      return (
        <ChatContext.Provider value={useLocalChatStore()}>
          <KanbanContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
          <TimelineContext.Provider value={useLocalTimelineStore("Timeline/Local")()}>
        <VerticalSplitPane
          initialSplit={0.5}
          top={
            <SplitPane
            initialSplit={0.75}
            left={<KanbanBoard mode="fixed"></KanbanBoard>}
            right={<ChatWindow mode="fixed"></ChatWindow>}
            ></SplitPane>
            
          }
          bottom={<VisTimeline width={"100%"}></VisTimeline>}
        />
        </TimelineContext.Provider>
        </KanbanContext.Provider>
        </ChatContext.Provider>
      )
}


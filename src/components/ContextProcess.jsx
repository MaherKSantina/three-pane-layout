import { Box, TextField } from "@mui/material";
import { ChatContext, StoreContext } from "../contexts/StoreContext";
import { useLocalChatStore } from "../stores/chat.local";
import { useLocalKanbanStore } from "../stores/kanban.local";
import ChatWindow from "./ChatWindow";
import KanbanBoard from "./KanbanBoard";
import ProcessFlow from "./ProcessFlow";
import SplitPane from "./SplitPane2";
import VerticalSplitPane from "./VerticalSplitPane2";
import { useLocalFlowStore } from "../stores/flow.local";
import { useLocalTimelineStore } from "../stores/timeline.local";
import VisTimeline from "./VisTimeline";

export default function ContextProcess() {
      return (
        <VerticalSplitPane
          initialSplit={0.5}
          top={
            <SplitPane
            initialSplit={0.75}
            left={
              <StoreContext.Provider value={useLocalKanbanStore("KanbanBoard/Local")()}>
              <KanbanBoard mode="fixed"></KanbanBoard>
            </StoreContext.Provider>
            }

            right={
              <ChatContext.Provider value={useLocalChatStore()}>
              <ChatWindow mode="fixed"></ChatWindow>
            </ChatContext.Provider>
            }
            >

            </SplitPane>
            
          }
          bottom={
            <StoreContext.Provider value={useLocalTimelineStore("Timeline/Local")()}>
        <VisTimeline width={"100%"}></VisTimeline>
      </StoreContext.Provider>
            
          }
        />
      )
}


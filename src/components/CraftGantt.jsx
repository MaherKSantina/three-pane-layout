import { useMemo } from "react"
import { CraftContext, GanttContext } from "../contexts/StoreContext"
import { useCraftLocalStore } from "../stores/craft.local"
import { createGanttSyncStore, useSyncCraftToGantt } from "../stores/gantt.craft"
import { craftTreeToGanttData } from "../utils/gantthelper"
import EditorPage from "./craft/Craft"
import GanttChart from "./GanttChart"
import VerticalSplitPane from "./VerticalSplitPane2"

function CraftGanttSyncBridge({ craftStore, ganttStore, craftTreeToGanttData }) {
    useSyncCraftToGantt(craftStore, ganttStore, craftTreeToGanttData);
    return null;
  }

export default function CraftGantt() {
    const name = "craftngantt";
    const craftStore = useCraftLocalStore(`${name}/Craft`);
  
    // Create a single gantt store instance per component mount
    const ganttStore = useMemo(() => createGanttSyncStore(), []);
  
    return (
        <CraftContext.Provider value={craftStore}>
      <GanttContext.Provider value={ganttStore}>
        <CraftGanttSyncBridge
            craftStore={craftStore}
            ganttStore={ganttStore}
            craftTreeToGanttData={craftTreeToGanttData}
            />
          <VerticalSplitPane
            initialSplit={0.6}
            top={<EditorPage />}
            bottom={<GanttChart />}
          />
      </GanttContext.Provider>
      </CraftContext.Provider>
    );
  }
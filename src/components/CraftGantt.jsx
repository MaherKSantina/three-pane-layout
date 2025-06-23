import { useMemo } from "react"
import { CraftContext, GanttContext } from "../contexts/StoreContext"
import { useCraftLocalStore } from "../stores/craft.local"
import { createGanttSyncStore, useSyncCraftToGantt } from "../stores/gantt.craft"
import { craftTreeToGanttData, handleCraftTreeWithAsyncNodes } from "../utils/gantthelper"
import EditorPage from "./craft/Craft"
import GanttChart from "./GanttChart"
import VerticalSplitPane from "./VerticalSplitPane2"
import { CSCEDate } from "./craft/CSCEDate"
import { DynamicTask } from "./craft/DynamicTask"
import { FixedTask } from "./craft/FixedTask"
import { Sequential } from "./craft/Sequential"
import { ParentTask } from "./craft/ParentTask"
import { Async } from "./craft/Async"
import SplitPane from "./SplitPane2"
import { TextField } from "@mui/material"
import AggregatedCraft from "./craft/AggregatedCraft"
import { useCraftAggregatedStore } from "../stores/craft.aggregated"
import { CraftAggregatedSyncBridge } from "./craft/CraftAggregatedSyncBridge"

function CraftGanttSyncBridge({ craftStore, ganttStore, craftTreeToGanttData}) {
    useSyncCraftToGantt(craftStore, ganttStore, craftTreeToGanttData);
    return null;
  }

export default function CraftGantt({hideAggregated = true}) {
    const name = "craftngantt";
    const craftStore = useCraftLocalStore(`${name}/Craft`);
    const aggregatedStore = useCraftAggregatedStore();
  
    // Create a single gantt store instance per component mount
    const ganttStore = useMemo(() => createGanttSyncStore(), []);

    function editor() {
        return <EditorPage resolver={{
            CSCEDate,
            DynamicTask,
            FixedTask,
            Sequential,
            ParentTask,
            Async
        }} toolbox={[CSCEDate, DynamicTask, FixedTask, Sequential, ParentTask, Async]} craftStore={craftStore}></EditorPage>
    }
  
    return (
        <>
        <CraftGanttSyncBridge
            craftStore={aggregatedStore}
            ganttStore={ganttStore}
            craftTreeToGanttData={craftTreeToGanttData}
            />
            <CraftAggregatedSyncBridge
                sourceStore={craftStore}
                aggregatedStore={aggregatedStore}
                handleCraftTreeWithAsyncNodes={handleCraftTreeWithAsyncNodes}
            />
          <VerticalSplitPane
            initialSplit={0.6}
            top={hideAggregated ? editor() :
                <SplitPane initialSplit={0.5} left={editor()}
                right={<EditorPage style={{ width: "100%", height: "100%" }} resolver={{
                            CSCEDate,
                            DynamicTask,
                            FixedTask,
                            Sequential,
                            ParentTask,
                            Async
                          }} toolbox={[]} isReadOnly={true} craftStore={aggregatedStore}></EditorPage>}
                >
                    
                </SplitPane>
            }
            bottom={<GanttChart store={ganttStore} />}
          />
          </>
    );
  }
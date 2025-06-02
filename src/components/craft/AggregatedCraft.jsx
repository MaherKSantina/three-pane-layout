import { CraftContext } from "../../contexts/StoreContext";
import { useCraftAggregatedStore } from "../../stores/craft.aggregated";
import { useCraftLocalStore } from "../../stores/craft.local";
import { handleCraftTreeWithAsyncNodes } from "../../utils/gantthelper";
import { CraftAggregatedSyncBridge } from "./CraftAggregatedSyncBridge";
import Craft from './Craft';
import { CSCEDate } from "./CSCEDate";
import { DynamicTask } from "./DynamicTask";
import { FixedTask } from "./FixedTask";
import { Sequential } from "./Sequential";
import { ParentTask } from "./ParentTask";
import { Async } from "./Async";
import { useContext } from "react";


export default function AggregatedCraft({craftStore}) {
    return (
      <>
        
          <Craft style={{ width: "100%", height: "100%" }} resolver={{
            CSCEDate,
            DynamicTask,
            FixedTask,
            Sequential,
            ParentTask,
            Async
          }} toolbox={[]} isReadOnly={true} craftStore={craftStore}></Craft>
      </>

    )
}
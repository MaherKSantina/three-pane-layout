import { Element } from '@craftjs/core';
import { CraftContext } from '../../contexts/StoreContext';
import { useCraftLocalStore } from '../../stores/craft.local';
import { Async } from './Async';
import Craft from './Craft';
import { CSCEDate } from './CSCEDate';
import { DynamicTask } from './DynamicTask';
import { FixedTask } from './FixedTask';
import { ParentTask } from './ParentTask';
import { Sequential } from './Sequential';
import { useCraftAggregatedStore } from '../../stores/craft.aggregated';
import { handleCraftTreeWithAsyncNodes } from '../../utils/gantthelper';
import { CraftAggregatedSyncBridge } from './CraftAggregatedSyncBridge';

const meta = {
  component: Craft,
};

export default meta;

export const Default = {
  render() {
    return (
        <Craft style={{ width: "100%", height: "100%" }} resolver={{
          CSCEDate,
          DynamicTask,
          FixedTask,
          Sequential,
          ParentTask,
          Async,
          Element
        }} toolbox={[CSCEDate, DynamicTask, FixedTask, Sequential, ParentTask, Async]} craftStore={useCraftLocalStore("story/default")}></Craft>
    )
  }
};

export const Aggregated = {
  render() {
    const craftStore = useCraftLocalStore("story/default");
    const aggregatedStore = useCraftAggregatedStore();
    return (
      <>
        <CraftAggregatedSyncBridge
          sourceStore={craftStore}
          aggregatedStore={aggregatedStore}
          handleCraftTreeWithAsyncNodes={handleCraftTreeWithAsyncNodes}
        />
          <Craft style={{ width: "100%", height: "100%" }} resolver={{
            CSCEDate,
            DynamicTask,
            FixedTask,
            Sequential,
            ParentTask
          }} toolbox={[]} isReadOnly={true} craftStore={aggregatedStore}></Craft>
      </>

    )
  }
};
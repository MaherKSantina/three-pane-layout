import { GanttContext, StoreContext } from '../contexts/StoreContext';
import { useApiGanttStore } from '../stores/gantt.api';
import { useGanttLocalStore } from '../stores/gantt.local';
import GanttChart from './GanttChart';

const meta = {
  title: "Visualization/Gantt/Main",
  component: GanttChart,
};

export default meta;

export const Default = {
  render() {
    return (
      <GanttContext.Provider value={useGanttLocalStore()}>
      <GanttChart height={"100vh"} />
    </GanttContext.Provider>
    )
  }
};

export const API = {
  render() {
    return (
      <GanttContext.Provider value={useApiGanttStore()}>
      <GanttChart height={"100vh"} />
    </GanttContext.Provider>
    )
  }
};
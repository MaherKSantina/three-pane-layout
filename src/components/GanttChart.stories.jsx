import { StoreContext } from '../contexts/StoreContext';
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
      <StoreContext.Provider value={useGanttLocalStore()}>
      <GanttChart />
    </StoreContext.Provider>
    )
  }
};

export const API = {
  render() {
    return (
      <StoreContext.Provider value={useApiGanttStore()}>
      <GanttChart />
    </StoreContext.Provider>
    )
  }
};
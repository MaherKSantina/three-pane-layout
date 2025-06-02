import { GanttContext } from "../../contexts/StoreContext";
import { useGanttLocalStore } from "../../stores/gantt.local";
import GanttChart from "../GanttChart";

const meta = {
  title: "Fatin/Assignment",
  component: GanttChart,
};

export default meta;

export const Implementing = {
  render() {
    return (
      <GanttContext.Provider value={useGanttLocalStore("assignment/implementing")}>
      <GanttChart height={"100vh"} />
    </GanttContext.Provider>
    )
  }
};
import React from "react";
import { useNode } from "@craftjs/core";
import GanttChart from "../GanttChart";

export function CraftableGanttChart(props) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}>
      <GanttChart {...props} />
    </div>
  );
}

CraftableGanttChart.craft = {
  displayName: "GanttChart",
  props: { height: 400 },
  related: {},
};
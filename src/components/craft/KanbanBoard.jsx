import React from "react";
import { useNode } from "@craftjs/core";
import KanbanBoard from "../KanbanBoard";

export function CraftableKanbanBoard(props) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}>
      <KanbanBoard {...props} />
    </div>
  );
}

CraftableKanbanBoard.craft = {
  displayName: "KanbanBoard",
  props: { mode: "fixed" },
  related: {},
};
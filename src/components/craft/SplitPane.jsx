import React from "react";
import { useNode, Element } from "@craftjs/core";
import SplitPane from "../SplitPane2";
import { CraftableKanbanBoard } from "./KanbanBoard";

export function CraftableSplitPane(props) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))} style={{ width: "100%", height: props.height ?? "400px" }}>
      <SplitPane
        {...props}
        left={
          <Element id="left-pane" is={CraftableKanbanBoard} canvas />
        }
        right={
          <Element id="right-pane" is="div" canvas />
        }
      />
    </div>
  );
}

export function LeftPane({ children }) {
  return (
    <div style={{
      minHeight: 100,
      border: !children ? "1.5px dashed #96b0df" : undefined,
      background: !children ? "#f2f6ff" : undefined,
      height: "100%",
      width: "100%"
    }}>
      {children}
    </div>
  );
}
LeftPane.craft = { displayName: "LeftPane", props: { }, canvas: true };

export function RightPane({ children }) {
  return (
    <div style={{
      minHeight: 100,
      border: !children ? "1.5px dashed #96b0df" : undefined,
      background: !children ? "#f2f6ff" : undefined,
      height: "100%",
      width: "100%"
    }}>
      {children}
    </div>
  );
}
RightPane.craft = { displayName: "RightPane", props: {}, canvas: true };

CraftableSplitPane.craft = {
  displayName: "SplitPane",
  props: { initialSplit: 0.5, height: "400px", width: "600px" },
  rules: { canMoveIn: () => true },
  canvas: true,
};

import React from "react";
import { useNode, Element } from "@craftjs/core";
import VerticalSplitPane from "../VerticalSplitPane2";

export function CraftableVerticalSplitPane(props) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))} style={{ width: "100%", height: "400px" }}>
      <VerticalSplitPane
        {...props}
        top={
          <Element id="top-pane2" is="div" canvas>
            {props.top}
          </Element>
        }
        bottom={
          <Element id="bottom-pane2" is="div" canvas>
            {props.bottom}
          </Element>
        }
      />
    </div>
  );
}

VerticalSplitPane.craft = {
  displayName: "VerticalSplitPane",
  props: { initialSplit: 0.5 },
  rules: {
    canMoveIn: (incomingNodes) => true,
  },
};

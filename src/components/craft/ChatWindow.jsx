import React from "react";
import { useNode } from "@craftjs/core";
import ChatWindow from "../ChatWindow";

export function CraftableChatWindow(props) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))} style={{ width: props.width ?? "100%", height: props.height ?? "100%" }}>
      <ChatWindow {...props} />
    </div>
  );
}

CraftableChatWindow.craft = {
  displayName: "ChatWindow",
  props: { chatId: "demo", mode: "fixed", height: 400, width: 400 },
  related: {},
};
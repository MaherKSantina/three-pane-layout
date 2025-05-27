import React, { useContext, useEffect, useRef } from "react";
import { Editor, Frame, Element, useEditor, useNode } from "@craftjs/core";
import { CraftContext, useCraftStore } from "../../contexts/StoreContext";
import { CSCEDate } from "./CSCEDate";
import { SettingsPanel } from "./SettingsPanel";
import { DynamicTask } from "./DynamicTask";
import { FixedTask } from "./FixedTask";
import { Sequential } from "./Sequential";
import { ParentTask } from "./ParentTask";

// ---- Toolbox for adding components ----
function Toolbox() {
    const { connectors } = useEditor();
    return (
        <div style={{
            display: "flex", flexDirection: "column", gap: 12,
            padding: 12, background: "#f0f3f8", minWidth: 180, borderRight: "1px solid #dbe4ed"
        }}>
            <span style={{ fontWeight: 600, marginBottom: 8 }}>Toolbox</span>
            {CSCEDate.toolbox(connectors)}
            {DynamicTask.toolbox(connectors)}
            {FixedTask.toolbox(connectors)}
            {Sequential.toolbox(connectors)}
            {ParentTask.toolbox(connectors)}
        </div>
    );
}

function CraftRehydrator() {
    const craftStore = useContext(CraftContext);
  // Subscribe to nodes
  const nodes = craftStore((state) => state.nodes);
  
    const { actions, enabled } = useEditor((state) => ({
      enabled: state.options.enabled,
    }));
  
    useEffect(() => {
        if (nodes && Object.keys(nodes).length > 0 && enabled) {
          actions.deserialize(nodes);
        }
        // eslint-disable-next-line
      }, []); // Note: No dependency on nodes!
      return null;
  }

// ---- Main Editor Page ----
export default function EditorPage({ width = "100%", height = "100%" }) {

    const handleNodesChange = (query) => {
        const json = query.serialize();
        setNodes(JSON.parse(json));
        console.log(json)
    };


    const craftStore = useCraftStore();
    const setNodes = craftStore((state) => state.setNodes);

    return (
        <div style={{
            display: "flex",
            height,
            width,
            background: "#eef2fa",
        }}>
            <Editor
                style={{
                    width: "100%",
                    height: "100%"
                }}
                options={{ enabled: true }}
                resolver={{
                    CSCEDate,
                    DynamicTask,
                    FixedTask,
                    Sequential,
                    ParentTask
                }}
                onNodesChange={handleNodesChange}
            >
                <CraftRehydrator />
                <div style={{ display: "flex", height: "100%", width: "100%" }}>
                    <Toolbox />
                    <div style={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: 32,
                        overflow: "auto",
                        width: "100%"
                    }}>
                        <Frame>
                            <Element is="div" canvas style={{
                                minHeight: 600,
                                minWidth: 500,
                                background: "#fff",
                                border: "2px dashed #c5d0e6",
                                borderRadius: 8,
                                padding: 32,
                                boxShadow: "0 2px 10px #b1bcce2a",
                            }}>
                            </Element>
                        </Frame>
                    </div>
                    <SettingsPanel></SettingsPanel>
                </div>
            </Editor>
        </div>
    );
}

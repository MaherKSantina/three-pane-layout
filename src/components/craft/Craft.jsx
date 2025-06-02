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
function Toolbox({toolbox}) {
    const { connectors } = useEditor();
    return (
        <div style={{
            display: "flex", flexDirection: "column", gap: 12,
            padding: 12, background: "#f0f3f8", minWidth: 180, borderRight: "1px solid #dbe4ed"
        }}>
            <span style={{ fontWeight: 600, marginBottom: 8 }}>Toolbox</span>
            {toolbox.map(x => x.toolbox(connectors))}
        </div>
    );
}

function CraftRehydrator({isReadOnly, craftStore}) {
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
      }, isReadOnly ? [nodes, enabled, actions] : []); // Note: No dependency on nodes!
      return null;
  }

// ---- Main Editor Page ----
export default function EditorPage({ width = "100%", height = "100%", resolver, toolbox, isReadOnly, craftStore }) {

    const handleNodesChange = (query) => {
        if (isReadOnly) return
        const json = query.serialize();
        setNodes(JSON.parse(json));
        // console.log(json)
    };

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
                resolver={resolver}
                onNodesChange={handleNodesChange}
            >
                <CraftRehydrator isReadOnly={isReadOnly} craftStore={craftStore} />
                <div style={{ display: "flex", height: "100%", width: "100%" }}>
                    {!isReadOnly ? <Toolbox toolbox={toolbox}>
                        
                        </Toolbox> : null }
                    
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
                                flexDirection: "row",        // <-- THIS LINE makes it horizontal!
                                alignItems: "flex-start",    // (optional: top-align items)
                                gap: 16                      // (optional: spacing between items)
                            }}>
                            </Element>
                        </Frame>
                    </div>
                    <CraftContext.Provider value={craftStore}>
                    <SettingsPanel></SettingsPanel>
                    </CraftContext.Provider>
                    
                </div>
            </Editor>
        </div>
    );
}

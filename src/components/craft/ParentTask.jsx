import { Element, useEditor, useNode } from "@craftjs/core";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField, Stack } from "@mui/material";
import dayjs from "dayjs";

export function ParentTask({ children }) {
    const { connectors: { connect, drag }, id, name } = useNode((node) => ({
        name: node.data.props.name,
      }));
    const { actions } = useEditor();
    return (
      <div
        ref={ref => connect(drag(ref))}
        style={{
          flex: 1,
          minHeight: 120,
          minWidth: 220,
          padding: 24,
          border: "2px solid #3485e7",
          borderRadius: 10,
          background: "#f3f8ff",
          margin: 12,
          position: "relative",
          boxShadow: "0 2px 8px #8bb2ee22",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* X button */}
        <button
          onClick={e => {
            e.stopPropagation();
            actions.delete(id);
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#ff6d6d",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 22,
            height: 22,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 15,
            lineHeight: "20px",
            boxShadow: "0 1px 5px #0002",
            zIndex: 10,
          }}
          title="Remove this rectangle"
        >
          ×
        </button>
  
        <div style={{
          marginBottom: 12,
          fontWeight: 700,
          color: "#3485e7",
          fontSize: 18,
          letterSpacing: 0.5
        }}>
          {name}
        </div>
        {/* Drop zone */}
        <Element id="rect-drop-area" is="div" canvas style={{
          width: "100%",
          minHeight: 40,
          border: !children ? "2px dashed #b5cffa" : "1px solid #c3d5f3",
          background: "#fff",
          borderRadius: 6,
          padding: 14,
          display: "flex",
          alignItems: "center",
          overflow: "auto",
          transition: "border 0.18s",
        }}>
          {children}
        </Element>
      </div>
    );
  }

function Settings() {
    const {
        actions: { setProp },
        name,
        duration
        } = useNode((node) => ({
          name: node.data.props.name,
          duration: node.data.props.duration
        }));
    
        return (
        <Stack spacing={2} sx={{ p: 2 }}>
            <TextField
            label="Name"
            value={name}
            onChange={(e) => {
    
              setProp((props) => (props.name = e.target.value))
            }
                
            }
            slotProps={{ textField: { fullWidth: true } }}
            />
        </Stack>
    );
}  

  ParentTask.craft = {
    displayName: "ParentTask",
    props: {},
    canvas: true,
    related: {
        settings: Settings
    }
  };

  ParentTask.toolbox = (connectors) => {
    return (
      <div ref={ref => connectors.create(ref, <ParentTask></ParentTask>)}>
          <button style={{ width: "100%" }}>ParentTask</button>
      </div>
    )
  }
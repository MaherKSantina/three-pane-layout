import { Element, useEditor, useNode } from "@craftjs/core";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Stack } from "@mui/material";
import dayjs from "dayjs";

export function CraftSingleItem() {
    const { connectors: { connect, drag }, id, value } = useNode((node) => ({
        value: node.data.props.value,
    }));
    const { actions } = useEditor();
    return (
      <div
        ref={ref => connect(drag(ref))}
        style={{
          minHeight: 30,
          minWidth: 30,
          padding: 24,
          border: "2px solid rgb(204, 231, 52)",
          borderRadius: 10,
          background: "#f3f8ff",
          margin: 12,
          position: "relative",
          boxShadow: "0 2px 8px #8bb2ee22",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "auto"
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
          {value}
        </div>
      </div>
    );
  }

  export function CraftSingleItemSettings() {
    const {
    actions: { setProp },
    value
    } = useNode((node) => ({
        value: node.data.props.value,
    }));

    return (
    <Stack spacing={2} sx={{ p: 2 }}>
        <TextField
        label="Value"
        value={value}
        onChange={(e) => {

          setProp((props) => (props.value = e.target.value))
        }
            
        }
        slotProps={{ textField: { fullWidth: true } }}
        />
    </Stack>
    );
}  

CraftSingleItem.craft = {
    displayName: "CraftSingleItem",
    props: {},
    canvas: true,
    related: {
      settings: CraftSingleItemSettings
    }
  };

  CraftSingleItem.toolbox = (connectors) => {
        return (
          <div ref={ref => connectors.create(ref, <CraftSingleItem></CraftSingleItem>)}>
              <button style={{ width: "100%" }}>CraftSingleItem</button>
          </div>
        )
      }
import React, { useEffect, useState } from "react";
import { useNode, useEditor, Element } from "@craftjs/core";
import { Button, Stack, TextField } from "@mui/material";

// Craftable component that loads dropzone info by type prop
export function Async({ children, type }) {
  const { connectors: { connect, drag }, id } = useNode();
  const { actions } = useEditor();

  const [loading, setLoading] = useState(false);
  const [dropzones, setDropzones] = useState(null);
  const [error, setError] = useState(null);

  // Fetch dropzone config when type changes
  useEffect(() => {
    if (!type) {
      setDropzones(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`https://api-digitalsymphony.ngrok.pizza/async/${type}`)
      .then(res => {
        if (!res.ok) throw new Error("Fetch error");
        return res.json();
      })
      .then(data => {
        setDropzones(data.dropzones || []);
        setLoading(false);
      })
      .catch(e => {
        setError("Failed to load dropzones");
        setLoading(false);
      });
  }, [type]);

  // Show "Choose a type" if type is empty
  function CloseButton() {
    return (
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
    );
  }
  
  // Then, for each return branch, do:
  if (!type) {
    return (
      <div
        ref={ref => connect(drag(ref))}
        style={{
          minHeight: 80,
          minWidth: 180,
          border: "1px dashed #b5cffa",
          borderRadius: 8,
          background: "#f5f8fd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <CloseButton />
        Choose a type
      </div>
    );
  }
  
  if (loading) {
    return (
      <div
        ref={ref => connect(drag(ref))}
        style={{
          minHeight: 120,
          minWidth: 220,
          padding: 24,
          border: "2px dashed #b5cffa",
          borderRadius: 10,
          background: "#eef6ff",
          margin: 12,
          boxShadow: "0 2px 8px #8bb2ee22",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <CloseButton />
        <div style={{ fontSize: 18, color: "#3485e7", fontWeight: 600 }}>
          Loading dropzones...
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div
        ref={ref => connect(drag(ref))}
        style={{
          minHeight: 80,
          minWidth: 180,
          border: "1px dashed #e57373",
          borderRadius: 8,
          background: "#fff5f5",
          color: "#e57373",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <CloseButton />
        {error}
      </div>
    );
  }
  
  // Main (dropzones) view:
  return (
    <div
      ref={ref => connect(drag(ref))}
      style={{
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
      <CloseButton />
      <div
        style={{
          marginBottom: 12,
          fontWeight: 700,
          color: "#3485e7",
          fontSize: 18,
          letterSpacing: 0.5,
        }}
      >
        {type} Dropzones
      </div>
      {dropzones?.map((zoneId) => (
        <Element
          key={zoneId}
          id={zoneId}
          is="div"
          canvas
          style={{
            width: "100%",
            minHeight: 40,
            border: "2px dashed #b5cffa",
            background: "#fff",
            borderRadius: 6,
            padding: 14,
            margin: "8px 0",
            display: "flex",
            alignItems: "center",
            overflow: "auto",
            transition: "border 0.18s",
          }}
        >
            Dropzone: {zoneId}
          {/* Children dropped in this dropzone will go here */}
        </Element>
      ))}
    </div>
  );
}

function Settings() {
    const {
        actions: { setProp },
        type: currentType,
      } = useNode((node) => ({
        type: node.data.props.type,
      }));
    
      // Local input state so we don't update Craft on each keystroke
      const [inputType, setInputType] = useState(currentType || "");
    
      const handleLoadClick = () => {
        setProp((props) => { props.type = inputType; });
      };
    
      return (
        <Stack spacing={2} sx={{ p: 2 }}>
          <TextField
            label="Type"
            value={inputType}
            fullWidth
            onChange={e => setInputType(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleLoadClick}
            disabled={!inputType || inputType === currentType}
            sx={{ textTransform: "none" }}
          >
            Load
          </Button>
        </Stack>
      );
  }

Async.craft = {
  displayName: "Async",
  props: { },
  related: {
    settings: Settings
  }
};

Async.toolbox = (connectors) => (
  <div ref={ref => connectors.create(ref, <Async />)}>
    <button style={{ width: "100%" }}>Async</button>
  </div>
);

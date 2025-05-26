import React from "react";
import { Editor, Frame, Element, useEditor, useNode } from "@craftjs/core";

// --- Helper Delete Button ---
function DeleteButton() {
  const { actions, id } = useNode();
  return (
    <button
      onClick={e => {
        e.stopPropagation();
        actions.delete(id);
      }}
      style={{
        position: "absolute", top: 8, right: 8,
        background: "rgba(255,60,60,0.85)", color: "#fff", border: "none",
        borderRadius: "50%", width: 24, height: 24, cursor: "pointer",
        fontWeight: "bold", zIndex: 2
      }}
      title="Delete"
    >×</button>
  );
}

// --- ASAP Urgency Block ---
function ASAP({ children }) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}
      style={{
        border: "2px solid #e66b6b", borderRadius: 8, padding: 16, margin: 8,
        position: "relative", background: "#fff7f7",
        minHeight: 60,
      }}
    >
      <DeleteButton />
      <strong style={{ color: "#d73838" }}>ASAP</strong>
      <div style={{ marginTop: 10 }}>
        {/* Only allow one child */}
        <Element is={ProcessItem} canvas id="asap-child">
          {children}
        </Element>
      </div>
    </div>
  );
}
ASAP.craft = { displayName: "ASAP Urgency", props: {}, canvas: true };

// --- WithinDuration Urgency Block ---
function WithinDuration({ start = "", end = "", children }) {
  const { connectors: { connect, drag }, setProp, props } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}
      style={{
        border: "2px solid #ffae44", borderRadius: 8, padding: 16, margin: 8,
        position: "relative", background: "#fff8f0",
        minHeight: 60,
      }}
    >
      <DeleteButton />
      <div>
        <strong style={{ color: "#ff940a" }}>Within Duration</strong>
        <div style={{ marginTop: 8, fontSize: 14 }}>
          <label>Start:{" "}
            <input
              type="datetime-local"
              value={props.start}
              onChange={e => setProp(p => p.start = e.target.value)}
              style={{ fontSize: 12, marginRight: 10 }}
            />
          </label>
          <label>End:{" "}
            <input
              type="datetime-local"
              value={props.end}
              onChange={e => setProp(p => p.end = e.target.value)}
              style={{ fontSize: 12 }}
            />
          </label>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        {/* Only allow one child */}
        <Element is={ProcessItem} canvas id="within-child">
          {children}
        </Element>
      </div>
    </div>
  );
}
WithinDuration.craft = {
  displayName: "WithinDuration Urgency",
  props: { start: "", end: "" },
  canvas: true
};

// --- Process Item (canvas helper for single slot) ---
function ProcessItem({ children }) {
  return <>{children}</>;
}
ProcessItem.craft = { displayName: "ProcessItem", canvas: true };

// --- TravelToAirport Process (2 Gaps) ---
function TravelToAirport({ gap1Label = "Gap 1", gap2Label = "Gap 2", children }) {
  const { connectors: { connect, drag }, setProp, props } = useNode();

  // Split children into gap1 and gap2 by id
  let gap1Children = [], gap2Children = [];
  React.Children.forEach(children, child => {
    if (child && child.props && child.props.id === "gap2") gap2Children.push(child);
    else gap1Children.push(child);
  });

  return (
    <div ref={ref => connect(drag(ref))}
      style={{
        border: "2px solid #4e88ff", borderRadius: 8, padding: 16, margin: 8,
        background: "#f6faff", minHeight: 90, position: "relative"
      }}
    >
      <DeleteButton />
      <strong style={{ color: "#155ec5" }}>TravelToAirport</strong>
      <div style={{ fontSize: 13, margin: "8px 0" }}>
        <label>Gap 1 Label:
          <input value={props.gap1Label} onChange={e => setProp(p => p.gap1Label = e.target.value)} style={{ fontSize: 12, marginLeft: 4 }} />
        </label>
        &nbsp;&nbsp;
        <label>Gap 2 Label:
          <input value={props.gap2Label} onChange={e => setProp(p => p.gap2Label = e.target.value)} style={{ fontSize: 12, marginLeft: 4 }} />
        </label>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500, color: "#226ad9" }}>{props.gap1Label || "Gap 1"}</span>
          <Element is={ProcessItem} canvas id="gap1">
            {gap1Children}
          </Element>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500, color: "#226ad9" }}>{props.gap2Label || "Gap 2"}</span>
          <Element is={ProcessItem} canvas id="gap2">
            {gap2Children}
          </Element>
        </div>
      </div>
    </div>
  );
}
TravelToAirport.craft = {
  displayName: "TravelToAirport",
  props: { gap1Label: "Gap 1", gap2Label: "Gap 2" },
  canvas: true
};

// --- ImplementIteration Process (Unlimited Children) ---
function ImplementIteration({ children }) {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}
      style={{
        border: "2px solid #3ac179", borderRadius: 8, padding: 16, margin: 8,
        background: "#f6fff8", minHeight: 80, position: "relative"
      }}
    >
      <DeleteButton />
      <strong style={{ color: "#1f7a47" }}>ImplementIteration</strong>
      <div style={{ marginTop: 8 }}>
        <Element is={ProcessItem} canvas id="implement-children">
          {children}
        </Element>
      </div>
    </div>
  );
}
ImplementIteration.craft = { displayName: "ImplementIteration", canvas: true };

// --- Basic Process Step/Leaf ---
function Step({ text = "Step" }) {
  const { connectors: { connect, drag }, setProp, props } = useNode();
  return (
    <div ref={ref => connect(drag(ref))}
      style={{
        border: "1.5px solid #888", borderRadius: 7, padding: "8px 16px", margin: 6,
        background: "#fff", minHeight: 32, position: "relative", fontSize: 15
      }}>
      <DeleteButton />
      <input
        style={{
          border: "none", background: "transparent", fontSize: "inherit", fontWeight: 600
        }}
        value={props.text}
        onChange={e => setProp(p => p.text = e.target.value)}
      />
    </div>
  );
}
Step.craft = { displayName: "Step" };

// --- Toolbox for adding views ---
function Toolbox() {
  const { connectors } = useEditor();
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 14,
      padding: 12, background: "#f4f8ff", minWidth: 220, borderRight: "1.5px solid #c4d0e0"
    }}>
      <div style={{ marginBottom: 8, fontWeight: 700 }}>Urgency Views</div>
      <div ref={ref => connectors.create(ref, <ASAP />)}>
        <button style={{ width: "100%", borderLeft: "5px solid #e66b6b" }}>ASAP</button>
      </div>
      <div ref={ref => connectors.create(ref, <WithinDuration />)}>
        <button style={{ width: "100%", borderLeft: "5px solid #ffae44" }}>WithinDuration</button>
      </div>
      <div style={{ margin: "18px 0 8px 0", fontWeight: 700 }}>Process Views</div>
      <div ref={ref => connectors.create(ref, <TravelToAirport />)}>
        <button style={{ width: "100%", borderLeft: "5px solid #4e88ff" }}>TravelToAirport</button>
      </div>
      <div ref={ref => connectors.create(ref, <ImplementIteration />)}>
        <button style={{ width: "100%", borderLeft: "5px solid #3ac179" }}>ImplementIteration</button>
      </div>
      <div ref={ref => connectors.create(ref, <Step />)}>
        <button style={{ width: "100%", borderLeft: "5px solid #888" }}>Step (Leaf)</button>
      </div>
    </div>
  );
}

// --- Main Editor ---
export default function ProcessEditor() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#eef3fa",
      fontFamily: "Inter, Roboto, Arial, sans-serif"
    }}>
      <Editor
        resolver={{
          ASAP,
          WithinDuration,
          TravelToAirport,
          ImplementIteration,
          Step,
          ProcessItem,
        }}
      >
        <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
          <Toolbox />
          <div style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 36,
            overflow: "auto",
          }}>
            <Frame>
              <Element is={ImplementIteration} canvas>
                {/* You can drop steps or processes here */}
              </Element>
            </Frame>
          </div>
        </div>
      </Editor>
    </div>
  );
}

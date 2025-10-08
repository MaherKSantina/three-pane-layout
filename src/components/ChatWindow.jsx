import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Paper, TextField, IconButton, Typography, Checkbox, Button } from "@mui/material";
import SendRounded from "@mui/icons-material/SendRounded";
import { useChatStore } from "../contexts/StoreContext";

const RESIZE_IDLE_MS = 200; // fire after user stops dragging for this long

export default function ChatWindow({ messages, sendMode = "text", onSendMessage, onRefresh }) {
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  // Scroll to bottom on new messages
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  // Measure parent size util
  const measureParent = useMemo(
    () => () => {
      const el = containerRef.current;
      const parent = el?.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      setParentSize((prev) => {
        const w = Math.max(0, Math.floor(rect.width));
        const h = Math.max(0, Math.floor(rect.height));
        if (prev.width === w && prev.height === h) return prev;
        return { width: w, height: h };
      });
    },
    []
  );

  // Initial synchronous measure to avoid layout jump
  useLayoutEffect(() => {
    measureParent();
  }, [measureParent]);

  // Observe parent size and update only after user stops resizing/dragging
  useEffect(() => {
    const el = containerRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    let t;
    const debouncedMeasure = () => {
      clearTimeout(t);
      t = setTimeout(measureParent, RESIZE_IDLE_MS);
    };

    // Prefer ResizeObserver for precise parent size changes (e.g., split pane drags)
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(debouncedMeasure);
      ro.observe(parent);
    } else {
      // Fallback to window resize
      const onWin = debouncedMeasure;
      window.addEventListener("resize", onWin);
      return () => window.removeEventListener("resize", onWin);
    }

    return () => {
      clearTimeout(t);
      ro?.disconnect();
    };
  }, [measureParent]);

  const handleButton = async (button) => { 
    await onSendMessage({
        type: "buttonClick",
        button
      })
  }

  const handleSend = async (button) => {
    if (sendMode === "text") {
      const text = input.trim();
      if (!text) return;
      let msg = {
        type: "text",
        text
      }
      let success = await onSendMessage(msg);
      if (success) {
        setInput("");
      }
    } else {
      let msg = {
        type: "buttonClick",
        button
      }
      await onSendMessage(msg)
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        // Sized to parent's current measured dimensions
        width: parentSize.width ? `${parentSize.width}px` : "100%",
        height: parentSize.height ? `${parentSize.height}px` : "100%",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Message List */}
      <div
        ref={listRef}
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Button onClick={onRefresh}>Refresh</Button>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.senderIsSelf ? "flex-end" : "flex-start",
              maxWidth: "60%",
            }}
          >
            <Paper
              elevation={3}
              style={{
                padding: "8px 16px",
                borderRadius: "12px",
                backgroundColor: m.senderIsSelf ? "#1976d2" : "#e0e0e0",
                color: m.senderIsSelf ? "#fff" : "#000",
                wordBreak: "break-word",
                overflowWrap: "anywhere", // ensures very long words or URLs wrap
              }}
            >
              <Typography variant="body2" component="div">
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap", // ✅ wraps while preserving newlines
                    wordBreak: "break-word", // ✅ breaks long tokens (like JSON keys)
                    overflowX: "hidden", // ✅ prevents horizontal scrollbars
                  }}
                >
                  {m.text}
                </pre>
              </Typography>
              <Typography
                variant="caption"
                style={{ display: "block", textAlign: "right", marginTop: 4 }}
              >
                {new Date(m.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          </div>
        ))}

      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          display: "flex",
          gap: "8px",
          padding: "16px",
          borderTop: "1px solid #ddd",
          flexShrink: 0,
        }}
      >
        {sendMode === "disabled" ? <></> : sendMode === "text" ? <> <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        /> <Button color="primary" onClick={() => handleButton("cancel")}>Cancel</Button> <IconButton color="primary" type="submit" style={{ alignSelf: "flex-end" }}>
            <SendRounded />
          </IconButton> </> : <><Button color="primary" onClick={() => handleSend("yes")}>Yes</Button><Button color="primary" onClick={() => handleSend("no")}>No</Button><Button color="primary" onClick={() => handleButton("cancel")}>Cancel</Button></>}



      </form>
    </div>
  );
}

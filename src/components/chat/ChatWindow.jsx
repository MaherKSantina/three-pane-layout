// ChatWindow.jsx
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Paper,
  TextField,
  IconButton,
  Typography,
  Checkbox,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  Box,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import SendRounded from "@mui/icons-material/SendRounded";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TableRowsIcon from "@mui/icons-material/TableRows";
import MonacoViewer from "../MonacoViewer";
import GenericDataTable from "../GenericDataTable";

const RESIZE_IDLE_MS = 200; // fire after user stops dragging for this long
const MAX_LINES = 20;

export default function ChatWindow({ input, messages, sendMode = "text", onSendMessage, onChange, onRefresh, onMessageOptions, shouldFocus = true }) {
  const inputRef = useRef(null);
  // useEffect(() => {
  //   if (sendMode === 'text' && inputRef.current && shouldFocus) {
  //     inputRef.current.focus();
  //   }
  // }, [messages, sendMode, shouldFocus]);
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const [parentSize, setParentSize] = useState({ width: 0, height: 0 });

  // Monaco viewer state (message or compose)
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerTitle, setViewerTitle] = useState("Text");
  const [viewerContent, setViewerContent] = useState("");
  const [viewerReadOnly, setViewerReadOnly] = useState(true);

  // Data table dialog
  const [openTable, setOpenTable] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [tableTitle, setTableTitle] = useState("Data");

  // Message context menu
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuMessage, setMenuMessage] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  const [isResponse, setIsResponse] = useState(true);

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

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(debouncedMeasure);
      ro.observe(parent);
    } else {
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
    await onSendMessage({ type: "buttonClick", button });
  };

  const handleSend = async (button) => {
    if (sendMode === "text") {
      const text = input.trim();
      if (!text) return;
      onSendMessage();
    } else {
      const msg = { type: "buttonClick", button };
      await onSendMessage(msg);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Extract JSON from a message (supports fenced blocks)
  function extractJson(text) {
    if (typeof text !== "string") return null;
    const fenceMatch =
      text.match(/```json\s*([\s\S]*?)```/i) ||
      text.match(/```\s*([\s\S]*?)```/);
    const candidate = fenceMatch ? fenceMatch[1] : text;
    try {
      return JSON.parse(candidate);
    } catch {
      return null;
    }
  }

  // Open editor for a message (read-only)
  const openMessageInEditor = (m) => {
    setViewerTitle("Message");
    setViewerContent(m.text ?? "");
    setViewerReadOnly(true);
    setOpenViewer(true);
  };

  // Open editor for the input (editable)
  const openInputEditor = () => {
    setViewerTitle("Compose");
    setViewerContent(input);
    setViewerReadOnly(false);
    setOpenViewer(true);
  };

  // Keep input synchronized if user edits in Compose viewer
  const handleViewerChange = (newValue) => {
    setViewerContent(newValue);
    if (!viewerReadOnly) onChange(newValue);
  };

  // Open a message as a data table dialog
  function openMessageAsTable(m) {
    const parsed = extractJson(m.text);
    if (!parsed) {
      alert("Could not parse JSON from this message.");
      return;
    }
    let rows = parsed;
    if (!Array.isArray(rows)) rows = [rows];
    const objRows = rows.filter((r) => r && typeof r === "object" && !Array.isArray(r));
    if (objRows.length === 0) {
      alert("Parsed JSON is not an array of objects.");
      return;
    }
    setTableRows(objRows);
    setTableTitle(m.title || "Message Data");
    setOpenTable(true);
  }

  const handleMenuOpen = (evt, m, i) => {
    setMenuAnchorEl(evt.currentTarget);
    setMenuMessage(m);
    setMenuIndex(i)
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuMessage(null);
    setMenuIndex(null)
  };

  const handleChange = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <>
      {/* Monaco Viewer Dialog */}
      <Dialog fullScreen open={openViewer} onClose={() => setOpenViewer(false)}>
        <AppBar sx={{ position: "sticky" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpenViewer(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {viewerTitle} — Viewer
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ height: "100vh", p: { xs: 0, sm: 2 } }}>
          <MonacoViewer value={viewerContent} readOnly={viewerReadOnly} onChange={handleViewerChange} />
        </Box>
      </Dialog>

      {/* Data Table Dialog */}
      <Dialog fullScreen open={openTable} onClose={() => setOpenTable(false)}>
        <AppBar sx={{ position: "sticky" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setOpenTable(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {tableTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ height: "100vh", p: { xs: 0, sm: 2 } }}>
          <GenericDataTable items={tableRows} title={tableTitle} />
        </Box>
      </Dialog>

      {/* Chat Window */}
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
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

          {messages.map((m, i) => {
            const bubbleBg = m.senderIsSelf ? "#1976d2" : "#e0e0e0";
            const bubbleColor = m.senderIsSelf ? "#fff" : "#000";
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: m.senderIsSelf ? "flex-end" : "flex-start",
                  maxWidth: "60%",
                  position: "relative",
                }}
              >
                <Paper
                  elevation={3}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    backgroundColor: bubbleBg,
                    color: bubbleColor,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    position: "relative",
                  }}
                >
                  {/* Context menu trigger */}
                  <IconButton
                    size="small"
                    aria-label="message actions"
                    onClick={(e) => handleMenuOpen(e, m, i)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      color: bubbleColor,
                      opacity: 0.7,
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="body2" component="div" sx={{ pr: 4 }}>
                    <div
                      style={{
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: MAX_LINES, // clamp to ~20 lines
                      }}
                    >
                      {m.text}
                    </div>
                  </Typography>

                  <Typography
                    variant="caption"
                    style={{ display: "block", textAlign: "right", marginTop: 4 }}
                  >
                    {new Date(m.timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              </div>
            );
          })}
        </div>

        {/* Per-message menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              if (menuIndex != null) onMessageOptions?.("execute", menuIndex);
              handleMenuClose();
            }}
          >
            Execute
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (menuIndex != null) onMessageOptions?.("select", menuIndex);
              handleMenuClose();
            }}
          >
            Select
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (menuIndex != null) onMessageOptions?.("restart", menuIndex);
              handleMenuClose();
            }}
          >
            Restart from here
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (menuIndex != null) onMessageOptions?.("edit", menuIndex);
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (menuIndex != null) onMessageOptions?.("delete", menuIndex);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>

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
          {sendMode === "disabled" ? null : sendMode === "text" ? (
            <>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                size="small"
                placeholder="Type a message…"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKey}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Open compose editor"
                        edge="end"
                        size="small"
                        onClick={openInputEditor}
                      >
                        <OpenInFullIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Checkbox
                checked={isResponse}
                onChange={(e) => {
                  setIsResponse(e.target.checked);
                }}
              >
                Response
              </Checkbox>
              <Button color="primary" onClick={() => handleButton("cancel")}>
                Cancel
              </Button>
              <IconButton color="primary" type="submit" style={{ alignSelf: "flex-end" }}>
                <SendRounded />
              </IconButton>
            </>
          ) : (
            <>
              <Button color="primary" onClick={() => handleSend("yes")}>
                Yes
              </Button>
              <Button color="primary" onClick={() => handleSend("no")}>
                No
              </Button>
              <Button color="primary" onClick={() => handleButton("cancel")}>
                Cancel
              </Button>
            </>
          )}
        </form>
      </div>
    </>
  );
}

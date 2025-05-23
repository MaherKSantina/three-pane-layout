import React, { useEffect, useRef, useState } from "react";
import { Paper, TextField, IconButton, Typography } from "@mui/material";
import SendRounded from "@mui/icons-material/SendRounded";
import { useChatStore } from "../contexts/StoreContext";

function ChatContent({ chatId, height, width }) {
  const { messages, fetchMessages, sendMessage } = useChatStore();
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    fetchMessages(chatId);
  }, [chatId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const msg = {
      chat_id: chatId,
      sender: "You",
      text,
      timestamp: new Date().toISOString(),
    };
    sendMessage(chatId, msg);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height,
        width,
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
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === "You" ? "flex-end" : "flex-start",
              maxWidth: "60%",
            }}
          >
            <Paper
              elevation={3}
              style={{
                padding: "8px 16px",
                borderRadius: "12px",
                backgroundColor: m.sender === "You" ? "#1976d2" : "#e0e0e0",
                color: m.sender === "You" ? "#fff" : "#000",
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body2">{m.text}</Typography>
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
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <IconButton color="primary" type="submit" style={{ alignSelf: "flex-end" }}>
          <SendRounded />
        </IconButton>
      </form>
    </div>
  );
}

// Full screen version
function FullViewChatWindow({ chatId }) {
  return <ChatContent chatId={chatId} width="100vw" height="100vh" />;
}

// Fixed-size version
function FixedParentChatWindow({ chatId, width = "100%", height = "100%" }) {
  return <ChatContent chatId={chatId} width={width} height={height} />;
}

// Main wrapper
export default function ChatWindow({ chatId, mode = "full", height, width }) {
  if (mode === "full") {
    return <FullViewChatWindow chatId={chatId} />;
  } else {
    return <FixedParentChatWindow chatId={chatId} height={height} width={width} />;
  }
}

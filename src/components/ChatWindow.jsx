// ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import SendRounded from "@mui/icons-material/SendRounded";
import { useStore } from "../contexts/StoreContext";

export default function ChatWindow({ chatId }) {
  const { messages, fetchMessages, sendMessage } = useStore();
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    fetchMessages(chatId);
  }, [chatId]);

  // scroll on messages change
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* messages list */}
      <Stack
        ref={listRef}
        sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}
        spacing={1}
      >
        {messages.map((m) => (
          <Box
            key={m.id}
            sx={{
              alignSelf: m.sender === "You" ? "flex-end" : "flex-start",
              maxWidth: { xs: "80%", sm: "70%", md: "60%" },
            }}
          >
            <Paper
              elevation={3}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: m.sender === "You" ? "primary.main" : "grey.300",
                color:
                  m.sender === "You" ? "primary.contrastText" : "text.primary",
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body2">{m.text}</Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "right", mt: 0.5 }}
              >
                {new Date(m.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Stack>

      {/* input */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        sx={{
          display: "flex",
          gap: 1,
          p: 2,
          borderTop: 1,
          borderColor: "divider",
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
        <IconButton color="primary" type="submit" sx={{ alignSelf: "flex-end" }}>
          <SendRounded />
        </IconButton>
      </Box>
    </Box>
  );
}

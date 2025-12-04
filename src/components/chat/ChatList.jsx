// ChatListView.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  ListItemSecondaryAction,
  Button,
  Typography,
} from "@mui/material";
import EditRounded from "@mui/icons-material/EditRounded";
import DeleteRounded from "@mui/icons-material/DeleteRounded";
import ChatListDialog from "./ChatListDialog";
import { useStore } from "../../contexts/StoreContext";

export default function ChatList({agents, chats, onAdd, onDelete, onClick}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setDialogOpen(true);
  };

  const handleDelete = (data) => {
    onDelete?.(data)
  };

  const handleSave = (data) => {
    onAdd?.(data)
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6">Chats</Typography>
        <Button variant="contained" onClick={handleAdd} sx={{ mt: 1 }}>
          New Chat
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List disablePadding>
          {chats.map((chat) => (
            <React.Fragment key={chat.id}>
              <ListItemButton onClick={() => onClick?.(chat)}>
                <ListItemText
                  primary={chat.title}
                  secondary={chat.subtitle}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => onDelete?.(chat)}>
                    <DeleteRounded />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItemButton>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>

      <ChatListDialog
      agents={agents}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}

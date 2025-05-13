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
import { useStore } from "../contexts/StoreContext";

export default function ChatList() {
  const { chatLists, fetchLists, addList, updateList, deleteList } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    deleteList(id);
  };

  const handleSave = (data) => {
    if (data.id) updateList(data.id, data);
    else addList(data);
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
          {chatLists.map((chat) => (
            <React.Fragment key={chat.id}>
              <ListItemButton onClick={() => console.log("select", chat.id)}>
                <ListItemText
                  primary={chat.interactor}
                  secondary={chat.subject}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEdit(chat)}>
                    <EditRounded />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(chat.id)}>
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
        open={dialogOpen}
        initialData={editData}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}

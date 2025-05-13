// ChatListDialog.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export default function ChatListDialog({ open, onClose, initialData, onSave }) {
  const [form, setForm] = useState({ interactor: "", subject: "" });

  useEffect(() => {
    if (initialData) {
      setForm({
        interactor: initialData.interactor,
        subject: initialData.subject,
      });
    } else {
      setForm({ interactor: "", subject: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...form,
      id: initialData?.id, // undefined for new
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initialData ? "Edit Chat" : "New Chat"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Interactor"
          name="interactor"
          fullWidth
          value={form.interactor}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Subject"
          name="subject"
          fullWidth
          value={form.subject}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

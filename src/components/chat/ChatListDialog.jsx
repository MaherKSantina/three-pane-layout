// ChatListDialog.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";

export default function ChatListDialog({ open, onClose, agents = [], onSave }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!selected) return;
    onSave(selected); // <- just the agent object
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Select agent</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Autocomplete
            options={agents}
            value={selected}
            onChange={(_, val) => setSelected(val)}
            getOptionLabel={(opt) => (opt?.name ?? "")}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            autoHighlight
            clearOnEscape
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search agents"
                placeholder="Type a name…"
                margin="dense"
                autoFocus
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!selected}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

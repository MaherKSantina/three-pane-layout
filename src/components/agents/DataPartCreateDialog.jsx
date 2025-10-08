// File: components/DataPartCreateDialog.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box
} from "@mui/material";
import Grid from "@mui/system/Grid";
import RemoteAutocomplete from "./RemoteAutocomplete";

const orNull = (v) => (v === "" || v === undefined ? null : v);

/**
 * Props:
 * - open, onClose, onSave(payload)
 * - typeOptions: string[]                // assume strings only
 * - parentApiUrl: string
 * - initialValues?: { type?, key?, value?, parent_id? }
 */
export default function DataPartCreateDialog({
  open,
  onClose = () => {},
  onSave,
  typeOptions = ["string", "number", "boolean"],
  parentApiUrl = "https://api-digitalsymphony.ngrok.pizza/api/dataparts",
  initialValues = {},
}) {
  const [form, setForm] = React.useState({
    type: initialValues.type ?? "",
    key: initialValues.key ?? "",
    value: initialValues.value ?? "",
    parent_id: initialValues.parent_id ?? null,
  });

  const [dataIsSet, setDataIsSet] = useState(false)

//   React.useEffect(() => {
//     if (open) {
//       setForm({
//         type: initialValues.type ?? "",
//         key: initialValues.key ?? "",
//         value: initialValues.value ?? "",
//         parent_id: initialValues.parent_id ?? null,
//       });
//       setDataIsSet(true)
//     }
//   }, [open, initialValues]);

  const handleSubmit = async () => {
    const payload = {
      type: orNull(form.type),
      key: orNull(form.key),
      value: orNull(form.value),
      parent_id: form.parent_id == null || form.parent_id === "" ? null : Number(form.parent_id),
    };
    await onSave?.(payload);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Data Part</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {/* type (nullable, strings only) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select fullWidth label="Type"
                value={form.type}
                onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {typeOptions.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* key */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth label="Key"
                value={form.key}
                onChange={(e) => setForm((s) => ({ ...s, key: e.target.value }))}
              />
            </Grid>

            {/* value */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth label="Value"
                value={form.value}
                onChange={(e) => setForm((s) => ({ ...s, value: e.target.value }))}
              />
            </Grid>

            {/* parent_id via separate component */}
            <Grid size={{ xs: 12 }}>
              <RemoteAutocomplete
                open={open}
                getUrl={parentApiUrl}
                value={form.parent_id}
                onChange={(item) => setForm((s) => ({ ...s, parent_id: item.id }))}
                label="Parent"
                placeholder="Search parent..."
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

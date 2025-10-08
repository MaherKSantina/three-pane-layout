// File: views/DataPartBoard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Divider,
  Box,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/system/Grid";
import RemoteAutocomplete from "./RemoteAutocomplete";

/** Optional helper dialogs exported for reuse elsewhere */
export function AddMainPartDialog({ open, onClose, onSubmit }) {
  const [agentName, setAgentName] = React.useState("");
  React.useEffect(() => { if (open) setAgentName(""); }, [open]);
  const handleSave = () => { if (!agentName.trim()) return onClose?.(); onSubmit?.({ agent_name: agentName.trim() }); onClose?.(); };
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Main Data Part</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <TextField autoFocus margin="normal" label="Agent Name" fullWidth value={agentName} onChange={(e) => setAgentName(e.target.value)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export function AddSubPartDialog({ open, onClose, onSubmit, typeOptions = ["raw","ref"] }) {
  const [type, setType] = React.useState("");
  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");
//   const [agentId, setAgentId] = React.useState("");
  React.useEffect(() => { if (open) { setType(""); setKey(""); setValue(""); } }, [open]);
  const handleSave = () => { onSubmit?.({ type: type || null, key: key || null, value: value || null }); onClose?.(); };
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Data Part</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {typeOptions.map((t) => (<MenuItem key={t} value={t}>{t}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Key" value={key} onChange={(e) => setKey(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Value" value={value} onChange={(e) => setValue(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <RemoteAutocomplete
                open={open}
                getUrl={"https://api-digitalsymphony.ngrok.pizza/api/agents"}
                value={value}
                label="Agent"
                placeholder="Search agent..."
                getLabel={(it) => `${it.id} — ${it.name}`}
                onChange={(item) => setValue(item ? item.id : "")}
                ></RemoteAutocomplete>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * DataPartBoard (presentational)
 *
 * Props:
 * - items: Array<{ id, agent_name, data: Array<{ id, type?, key?, value?, parent_id }> }>
 * - onRequestAddMain?: () => void
 * - onRequestAddChild?: (parentId) => void
 * - onDeleteDataPart?: (childId) => void     // <— NEW: called when chip "x" is clicked
 */
export default function DataPartBoard({
  items = [],
  onRequestAddMain,
  onRequestAddChild,
  onDeleteDataPart,
  onClickDataPart,
  onReload
}) {
    const [isMainDialogOpen, setIsMainDialogOpen] = React.useState(false);
    const [isSubDialogOpen, setIsSubDialogOpen] = React.useState(false);
    const [currentParentId, setCurrentParentId] = React.useState(null);
  return (
    <>
    <AddMainPartDialog open={isMainDialogOpen} onClose={() => {
        setIsMainDialogOpen(false);
        setCurrentParentId(null);
    }} onSubmit={(data) => {
        onRequestAddMain?.(data, currentParentId);
        setIsMainDialogOpen(false);
        setCurrentParentId(null);
    }}></AddMainPartDialog>
    <AddSubPartDialog open={isSubDialogOpen} onClose={() => {
        setIsSubDialogOpen(false);
        setCurrentParentId(null);
    }} onSubmit={(data) => {
        onRequestAddChild?.(data, currentParentId);
        setIsSubDialogOpen(false);
        setCurrentParentId(null);
    }} ></AddSubPartDialog>
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Grid container alignItems="center" spacing={2} sx={{ p: 2, pb: 1 }}>
        <Grid size="grow">
          <Typography variant="h5">Data Parts</Typography>
        </Grid>
        <Grid size="auto">
          <Button variant="contained" onClick={() => {
            setIsMainDialogOpen(true);
            setCurrentParentId(null)
          }}>
            Add Main Data Part
          </Button>
          <Button variant="contained" onClick={onReload}>
            Reload
          </Button>
        </Grid>
      </Grid>

      {/* Scrollable list */}
      <Box sx={{ flex: 1, overflow: "auto", px: 2, pb: 2 }}>
        <Grid container spacing={2}>
          {items.map((main) => (
            <Grid key={main.id} size={12}>
              <Card variant="outlined">
                <CardContent sx={{ pb: 1.5 }}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid size="grow">
                      <Typography variant="h6" sx={{ mb: 0.25 }}>{main.agent_name}</Typography>
                      <Typography variant="caption" color="text.secondary">Main ID: {main.id}</Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Data ({main.data?.length ?? 0})
                  </Typography>

                  <Grid container spacing={1}>
                    {(main.data ?? []).map((d) => (
                      <Grid key={d.id} size="auto">
                        <Chip
                          variant="outlined"
                          label={`${d.type ?? "∅"} • ${d.key ?? "∅"} • ${d.value ?? "∅"}`}
                          onClick={onClickDataPart ? () => onClickDataPart(d.id) : undefined}
                          onDelete={onDeleteDataPart ? () => onDeleteDataPart(d.id) : undefined}
                        />
                      </Grid>
                    ))}
                    {(main.data?.length ?? 0) === 0 && (
                      <Grid size={12}>
                        <Typography variant="body2" color="text.secondary">
                          No data parts yet.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 1 }}>
                  <Button size="small" onClick={() => {
                    setIsSubDialogOpen(true);
                    setCurrentParentId(main.dataparts.data.id)
                  }}>
                    Add Data Part
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {items.length === 0 && (
            <Grid size={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary">No main data parts yet.</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
    </>
    
  );
}

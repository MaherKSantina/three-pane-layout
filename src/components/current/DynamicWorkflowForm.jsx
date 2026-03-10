// DynamicWorkflowForm.jsx
import * as React from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import { Button, Dialog, IconButton, TextField, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";

import MonacoEditor from "../MonacoEditor";

/**
 * Props:
 * - title: string
 * - fields: Array<{ title: string, placeholder?: string, key: string }>
 * - input: { [key: string]: any }  (display-only, NOT submitted)
 * - onSubmit(values): called with { [key]: value } for the editable fields only
 *
 * Notes:
 * - Expand button opens fullscreen Monaco.
 * - Editable fields: Monaco edits are realtime (updates the textfield immediately).
 * - Input fields: Monaco is read-only (no onChange changes persisted).
 */
export default function DynamicWorkflowForm({ title, fields, input, onSubmit }) {
  const [values, setValues] = React.useState({});

  // Monaco dialog state
  const [open, setOpen] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState(null);
  const [activeKind, setActiveKind] = React.useState(null); // "field" | "input"
  const [activeInputValue, setActiveInputValue] = React.useState("");

  // Ensure internal values match current field keys
  React.useEffect(() => {
    setValues((prev) => {
      const next = { ...prev };
      const keys = new Set((fields ?? []).map((f) => f?.key).filter(Boolean));

      Object.keys(next).forEach((k) => {
        if (!keys.has(k)) delete next[k];
      });

      (fields ?? []).forEach((f) => {
        if (!f?.key) return;
        if (next[f.key] === undefined) next[f.key] = "";
      });

      return next;
    });
  }, [JSON.stringify(fields)]);

  const handleChange = (key) => (e) => {
    setValues((prev) => ({ ...prev, [key]: e?.target?.value ?? "" }));
  };

  const inputEntries = React.useMemo(() => {
    const obj = input && typeof input === "object" ? input : {};
    return Object.entries(obj);
  }, [input]);

  const stringifyInputValue = (v) =>
    typeof v === "string" ? v : JSON.stringify(v, null, 2);

  const openEditorForField = (key) => {
    if (!key) return;
    setActiveKind("field");
    setActiveKey(key);
    setActiveInputValue("");
    setOpen(true);
  };

  const openEditorForInput = (k, v) => {
    if (!k) return;
    setActiveKind("input");
    setActiveKey(k);
    setActiveInputValue(stringifyInputValue(v));
    setOpen(true);
  };

  const closeEditor = () => {
    setOpen(false);
    setActiveKey(null);
    setActiveKind(null);
    setActiveInputValue("");
  };

  // REALTIME Monaco changes -> immediately update the corresponding field value (editable fields only)
  const handleMonacoChangeField = (newVal) => {
    if (!activeKey) return;
    setValues((prev) => ({ ...prev, [activeKey]: newVal ?? "" }));
  };

  // Read-only Monaco for input values: keep handler but do nothing
  const handleMonacoChangeInput = (_newVal) => {
    // no-op (input is display-only)
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const out = {};
    (fields ?? []).forEach((f) => {
      if (!f?.key) return;
      out[f.key] = values[f.key] ?? "";
    });
    onSubmit?.(out);
  };

  const isFieldEditor = open && activeKind === "field";
  const isInputEditor = open && activeKind === "input";

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ m: 0 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {/* Input (display-only) section */}
        {inputEntries.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Input
            </Typography>

            <Grid container spacing={2}>
              {inputEntries.map(([k, v]) => (
                <Grid key={k} size={12}>
                  <TextField
                  multiline
                    minRows={10}
                    maxRows={10}
                    fullWidth
                    label={k}
                    value={stringifyInputValue(v)}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Expand input editor"
                            edge="end"
                            size="small"
                            onClick={() => openEditorForInput(k, v)}
                          >
                            <OpenInFullIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}

        {/* Editable fields section */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Fields
        </Typography>

        <Grid container spacing={2}>
          {(fields ?? []).map((f) => (
            <Grid key={f.key} size={12}>
              <TextField
                fullWidth
                multiline
                minRows={1}
                    maxRows={10}
                label={f.title}
                placeholder={f.placeholder ?? ""}
                value={values[f.key] ?? ""}
                onChange={handleChange(f.key)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Expand editor"
                        edge="end"
                        size="small"
                        onClick={() => openEditorForField(f.key)}
                      >
                        <OpenInFullIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          ))}

          <Grid size={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog fullScreen open={open} onClose={closeEditor}>
        {/* Full-screen editor with ONLY an X button overlay */}
        <Box sx={{ position: "relative", height: "100%", minHeight: 0 }}>
          <IconButton
            aria-label="Close editor"
            onClick={closeEditor}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
              backgroundColor: "background.paper",
              "&:hover": { backgroundColor: "background.paper" },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ height: "100%" }}>
            {isFieldEditor ? (
              <MonacoEditor
                value={activeKey ? values[activeKey] ?? "" : ""}
                onChange={handleMonacoChangeField}
              />
            ) : isInputEditor ? (
              <MonacoEditor
                value={activeInputValue ?? ""}
                onChange={handleMonacoChangeInput}
              />
            ) : null}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

// File: components/CrudDialogForm.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Box,
} from "@mui/material";
import { DateTime } from "luxon";

// ------- small helpers (path-aware + datetime) ---------
const getAt = (obj, path, fallback = undefined) => {
  if (!obj || !path) return fallback;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return fallback;
    cur = cur[p];
  }
  return cur === undefined ? fallback : cur;
};

const setAt = (obj, path, value) => {
  if (!path) return value;
  const parts = String(path).split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  let cur = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    cur[key] = next && typeof next === "object" ? (Array.isArray(next) ? [...next] : { ...next }) : {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
  return clone;
};

const toDateTimeLocal = (value) => {
  if (!value) return "";
  const dt = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromISO(String(value), { zone: "utc" }).toLocal();
  if (!dt.isValid) return "";
  return dt.toFormat("yyyy-LL-dd'T'HH:mm");
};

const fromDateTimeLocal = (localVal) => {
  if (!localVal) return null;
  const dt = DateTime.fromFormat(localVal, "yyyy-LL-dd'T'HH:mm", { zone: "local" });
  return dt.isValid ? dt.toUTC().toISO() : null;
};

/**
 * Reusable CRUD Dialog form
 * Props:
 * - open
 * - mode: 'create'|'edit'
 * - fields: array of field defs (see below)
 * - initialValues: object
 * - onSave(values)
 * - onEdit(values)
 * - onClose()
 */
export default function CrudDialogForm({
  open,
  mode = "create",
  fields = [],
  initialValues = {},
  onSave,
  onEdit,
  onClose,
  titleCreate = "Add Item",
  titleEdit = "Edit Item",
}) {
  const [formData, setFormData] = useState(initialValues || {});
  const [entityOptions, setEntityOptions] = useState({});
  const [entityLoading, setEntityLoading] = useState({});
  const [entityError, setEntityError] = useState({});

  const [nowOnSave, setNowOnSave] = useState({});

  useEffect(() => {
    if (open) setFormData(initialValues || {});
  }, [open, initialValues]);

  const normalizeOptions = (opts = []) =>
    opts.map((o) => (typeof o === "string" ? { label: o, value: o } : { label: String(o.label), value: String(o.value) }));

  useEffect(() => {
    if (!open) return;
    const entityDefs = fields.filter((f) => f.type === "entity" && f.url);
    entityDefs.forEach(async (f) => {
      const key = f.formPath;
      if (!key) return;
      setEntityLoading((s) => ({ ...s, [key]: true }));
      setEntityError((s) => ({ ...s, [key]: undefined }));
      try {
        const res = await fetch(f.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = typeof f.mapResponse === "function" ? f.mapResponse(json) : json;
        const valueKey = f.valueKey || "id";
        const labelKey = f.labelKey || "name";
        const options = (Array.isArray(list) ? list : []).map((item) => ({
          label: String(item?.[labelKey] ?? ""),
          value: String(item?.[valueKey] ?? ""),
          raw: item,
        }));
        setEntityOptions((s) => ({ ...s, [key]: options }));
      } catch (e) {
        setEntityError((s) => ({ ...s, [key]: e?.message || "Failed to load" }));
        setEntityOptions((s) => ({ ...s, [key]: [] }));
      } finally {
        setEntityLoading((s) => ({ ...s, [key]: false }));
      }
    });
  }, [open, fields]);

  const handleSubmit = async () => {
    // clone so we don't mutate while iterating
  let next = { ...formData };

  Object.entries(nowOnSave).forEach(([name, useNow]) => {
    if (useNow) {
      // Format to match a <input type="datetime-local"> (no seconds)
      // Convert using your existing helper to keep storage format consistent
      next = setAt(next, name, new Date(Date.now()));
    }
  });

    if (mode === "edit" && onEdit) await onEdit(next);
    else if (onSave) await onSave(next);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{mode === "edit" ? titleEdit : titleCreate}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
             onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }}>
          {fields.map((f) => {
            if (f.type === "checkbox") {
              const checked = !!getAt(formData, f.name);
              return (
                <FormControlLabel
                  key={f.name}
                  control={<Checkbox checked={checked} onChange={(e) => setFormData((prev) => setAt(prev, f.name, e.target.checked))} />}
                  label={f.label}
                />
              );
            }

            if (f.type === "select") {
              const opts = normalizeOptions(f.options || []);
              const value = getAt(formData, f.name) ?? "";
              return (
                <TextField
                  key={f.name}
                  select
                  label={f.label}
                  value={String(value)}
                  onChange={(e) => setFormData((prev) => setAt(prev, f.name, e.target.value))}
                  fullWidth
                  required={f.required}
                >
                  {opts.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </TextField>
              );
            }

            if (f.type === "entity") {
              const key = f.formPath;
              const opts = entityOptions[key] || [];
              const loading = !!entityLoading[key];
              const error = entityError[key];
              const currentId = getAt(formData, `${key}.id`) ?? "";
              const selectedOption = opts.find((o) => o.value === String(currentId)) || null;

              return (
                <Autocomplete
                  key={key}
                  options={opts}
                  loading={loading}
                  value={selectedOption}
                  clearOnEscape
                  onChange={(_, option) => setFormData((prev) => setAt(prev, key, option ? { id: option.value } : null))}
                  getOptionLabel={(o) => o?.label ?? ""}
                  isOptionEqualToValue={(o, v) => o.value === v.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={f.label}
                      required={f.required}
                      error={!!error}
                      helperText={error ? `Failed to load: ${error}` : ""}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              );
            }

            if (f.type === "datetime") {
  const raw = getAt(formData, f.name);
  const value = toDateTimeLocal(raw); // string like "YYYY-MM-DDTHH:mm"

  const useNow = !!nowOnSave[f.name];

  return (
    <>
      <TextField
        key={f.name}
        label={f.label}
        type="datetime-local"
        value={useNow ? "" : value}
        onChange={(e) =>
          setFormData((prev) => setAt(prev, f.name, fromDateTimeLocal(e.target.value)))
        }
        fullWidth
        required={f.required}
        InputLabelProps={{ shrink: true }}
        autoFocus={f.autoFocus}
        disabled={useNow} // prevent editing if "Use now on save" is checked
        helperText={useNow ? "Will use the current time when you save." : undefined}
      />
      <FormControlLabel
        sx={{ mt: 1 }}
        control={
          <Checkbox
            checked={useNow}
            onChange={(_, checked) =>
              setNowOnSave((prev) => ({ ...prev, [f.name]: checked }))
            }
          />
        }
        label="Use now on save"
      />
    </>
  );
}

            return (
              <TextField
                key={f.name}
                label={f.label}
                value={getAt(formData, f.name) ?? ""}
                onChange={(e) => setFormData((prev) => setAt(prev, f.name, e.target.value))}
                type={f.type || "text"}
                fullWidth
                required={f.required}
                autoFocus={f.autoFocus}
                InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
              />
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
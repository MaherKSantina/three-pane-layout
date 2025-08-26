import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, IconButton, Box, Typography,
  Checkbox, FormControlLabel, InputAdornment, MenuItem,
  Autocomplete, CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close";
import DataTableView from "./DataTable";
import { DateTime } from "luxon";

/* ---------------- path helpers ---------------- */
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
    cur[key] =
      next && typeof next === "object" ? (Array.isArray(next) ? [...next] : { ...next }) : {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]] = value;
  return clone;
};

const cellToString = (val) => {
  if (val == null) return "";
  if (typeof val === "boolean") return val ? "true yes 1" : "false no 0";
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "object") {
    if (typeof val.label === "string") return val.label;
    if (typeof val.name === "string") return val.name;
    try { return JSON.stringify(val); } catch { return String(val); }
  }
  return String(val);
};

/* ---------------- datetime helpers ---------------- */
// Format for <input type="datetime-local"> => "YYYY-MM-DDTHH:mm"
const toDateTimeLocal = (value) => {
  if (!value) return "";
  const dt =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(String(value), { zone: "utc" }).toLocal();
  if (!dt.isValid) return "";
  return dt.toFormat("yyyy-LL-dd'T'HH:mm");
};

const fromDateTimeLocal = (localVal) => {
  if (!localVal) return null;
  const dt = DateTime.fromFormat(localVal, "yyyy-LL-dd'T'HH:mm", { zone: "local" });
  return dt.isValid ? dt.toUTC().toISO() : null;
};

// For table display: render local time nicely
const renderLocalDateTime = (value) => {
  if (!value) return "";
  const dt =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(String(value));
  if (!dt.isValid) return String(value);
  return dt.toLocal().toFormat("yyyy-LL-dd HH:mm");
};

export default function CrudDataTable({
  fetchItems,
  columns, // now supports entity with { tablePath, formPath } and type: 'datetime'
  onSave,
  onEdit,
  onDelete,
  idField = "id",
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

  // keyed by entity formPath (e.g. "transition")
  const [entityOptions, setEntityOptions] = useState({}); // { [formPath]: [{label,value,raw}] }
  const [entityLoading, setEntityLoading] = useState({}); // { [formPath]: boolean }
  const [entityError, setEntityError] = useState({});     // { [formPath]: string | undefined }

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems(); // rows with embedded foreigns (objects)
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); /* eslint-disable-next-line */ }, []);

  const handleAdd = () => { setFormData({}); setIsEdit(false); setDialogOpen(true); };
  const handleEdit = (row) => { setFormData(row); setIsEdit(true); setDialogOpen(true); };
  const handleDialogClose = () => { setDialogOpen(false); setFormData({}); setIsEdit(false); };

  const handleSave = async () => {
    if (isEdit) await onEdit(formData);
    else await onSave(formData);
    handleDialogClose();
    await loadItems();
  };

  const handleDelete = async () => {
    await onDelete(deleteId);
    setDeleteId(null);
    await loadItems();
  };

  const normalizeOptions = (opts = []) =>
    opts.map((o) => (typeof o === "string"
      ? { label: o, value: o }
      : { label: String(o.label), value: String(o.value) }
    ));

  /* ---------------- search (path-aware + entity aware) ---------------- */
  const rowSearchText = (row) =>
    columns.map((col) => {
      // entity columns use tablePath for view/search
      if (col.type === "entity") {
        const formPath = col.formPath;     // e.g. "transition"
        const tablePath = col.tablePath;   // e.g. "transition.name"
        const idVal = getAt(row, `${formPath}.id`);
        const opts = entityOptions[formPath] || [];
        const labelFromOpts = opts.find((o) => o.value === String(idVal))?.label;
        const labelFromRow = tablePath ? getAt(row, tablePath) : getAt(row, `${formPath}.name`);
        return [idVal, labelFromOpts, labelFromRow].map(cellToString).join(" ");
      }

      // non-entity: allow path in name
      const raw =
        col.selector && typeof col.selector === "function"
          ? col.selector(row)
          : getAt(row, col.name);
      if (col.type === "select" && col.options) {
        const opts = normalizeOptions(col.options);
        const vStr = raw != null ? String(raw) : "";
        const match = opts.find((o) => o.value === vStr)?.label;
        return [vStr, match].map(cellToString).join(" ");
      }
      return cellToString(raw);
    }).join(" ").toLowerCase();

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) => rowSearchText(row).includes(q));
  }, [items, search, columns, entityOptions]);

  /* ---------------- fetch entity options on dialog open ---------------- */
  useEffect(() => {
    if (!dialogOpen) return;
    const entityCols = columns.filter(c => c.type === "entity" && c.url);
    if (entityCols.length === 0) return;

    entityCols.forEach(async (col) => {
      const key = col.formPath; // important: key options by formPath
      setEntityLoading(s => ({ ...s, [key]: true }));
      setEntityError(s => ({ ...s, [key]: undefined }));
      try {
        const res = await fetch(col.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = typeof col.mapResponse === "function" ? col.mapResponse(json) : json;

        const valueKey = col.valueKey || "id";
        const labelKey = col.labelKey || "name";
        const options = (Array.isArray(list) ? list : []).map(item => ({
          label: String(item?.[labelKey] ?? ""),
          value: String(item?.[valueKey] ?? ""),
          raw: item,
        }));
        setEntityOptions(s => ({ ...s, [key]: options }));
      } catch (e) {
        setEntityError(s => ({ ...s, [key]: e?.message || "Failed to load" }));
        setEntityOptions(s => ({ ...s, [key]: [] }));
      } finally {
        setEntityLoading(s => ({ ...s, [key]: false }));
      }
    });
  }, [dialogOpen, columns]);

  /* ---------------- table columns (entity uses tablePath/formPath) ---------------- */
  const actionCol = {
    name: "Actions",
    cell: (row) => (
      <Box>
        <IconButton size="small" onClick={() => handleEdit(row)}>
          <EditIcon fontSize="inherit" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => setDeleteId(row[idField])}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Box>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "120px",
  };

  const valueToEntityLabel = (col, row) => {
    const idVal = getAt(row, `${col.formPath}.id`);
    const opts = entityOptions[col.formPath] || [];
    const fromOpts = opts.find(o => o.value === String(idVal))?.label;
    if (fromOpts) return fromOpts;
    const fallback = col.tablePath ? getAt(row, col.tablePath) : getAt(row, `${col.formPath}.name`);
    if (fallback != null) return String(fallback);
    return idVal != null ? String(idVal) : "";
  };

  const dtColumns = [
    ...columns.map((col) => {
      if (col.type === "checkbox") {
        return {
          name: col.label,
          selector: (row) => !!getAt(row, col.name),
          cell: (row) => <Checkbox size="small" disabled checked={!!getAt(row, col.name)} />,
          sortable: true,
          ...col.dataTableProps,
        };
      }
      if (col.type === "select") {
        const opts = normalizeOptions(col.options || []);
        const valueToLabel = (v) => opts.find((o) => o.value === String(v))?.label ?? String(v ?? "");
        return {
          name: col.label,
          selector: (row) => getAt(row, col.name),
          cell: (row) => valueToLabel(getAt(row, col.name)),
          sortable: true,
          ...col.dataTableProps,
        };
      }
      if (col.type === "entity") {
        return {
          name: col.label,
          selector: (row) =>
            col.tablePath ? getAt(row, col.tablePath) : getAt(row, `${col.formPath}.id`),
          cell: (row) => valueToEntityLabel(col, row),
          sortable: true,
          ...col.dataTableProps,
        };
      }
      if (col.type === "datetime") {
        return {
          name: col.label,
          selector: (row) => getAt(row, col.name),
          cell: (row) => renderLocalDateTime(getAt(row, col.name)),
          sortable: true,
          ...col.dataTableProps,
        };
      }
      // default (path-aware)
      return {
        name: col.label,
        selector: (row) =>
          col.selector && typeof col.selector === "function" ? col.selector(row) : getAt(row, col.name),
        sortable: true,
        ...col.dataTableProps,
      };
    }),
    actionCol,
  ];

  /* ---------------- render ---------------- */
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={2} flexWrap="wrap">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Data Table</Typography>
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{ minWidth: 240 }}
        />
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleAdd}>Add</Button>
      </Box>

      <DataTableView
        columns={dtColumns}
        data={filteredItems}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>{isEdit ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
               onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {columns.filter((col) => col.editable !== false).map((col) => {
              // CHECKBOX
              if (col.type === "checkbox") {
                const checked = !!getAt(formData, col.name);
                return (
                  <FormControlLabel
                    key={col.name}
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => setFormData((prev) => setAt(prev, col.name, e.target.checked))}
                      />
                    }
                    label={col.label}
                  />
                );
              }

              // SELECT (primitive)
              if (col.type === "select") {
                const opts = normalizeOptions(col.options || []);
                const value = getAt(formData, col.name) ?? "";
                return (
                  <TextField
                    key={col.name}
                    select
                    label={col.label}
                    value={String(value)}
                    onChange={(e) => setFormData((prev) => setAt(prev, col.name, e.target.value))}
                    fullWidth
                    required={col.required}
                  >
                    {opts.map((o) => (
                      <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    ))}
                  </TextField>
                );
              }

              // ENTITY (clearable => sets formPath to null)
              if (col.type === "entity") {
                const formPath = col.formPath;   // where { id } is stored
                const opts = entityOptions[formPath] || [];
                const loading = !!entityLoading[formPath];
                const error = entityError[formPath];

                const currentId = getAt(formData, `${formPath}.id`) ?? "";
                const selectedOption = opts.find((o) => o.value === String(currentId)) || null;

                return (
                  <Autocomplete
                    key={formPath}
                    options={opts}
                    loading={loading}
                    value={selectedOption}
                    clearOnEscape
                    onChange={(_, option) =>
                      setFormData((prev) =>
                        setAt(prev, formPath, option ? { id: option.value } : null) // <-- CLEAR sets null
                      )
                    }
                    getOptionLabel={(o) => o?.label ?? ""}
                    isOptionEqualToValue={(o, v) => o.value === v.value}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={col.label}
                        required={col.required}
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

              // DATETIME
              if (col.type === "datetime") {
                const raw = getAt(formData, col.name);
                const value = toDateTimeLocal(raw);
                return (
                  <TextField
                    key={col.name}
                    label={col.label}
                    type="datetime-local"
                    value={value}
                    onChange={(e) => {
                      const iso = fromDateTimeLocal(e.target.value); // UTC ISO string
                      setFormData((prev) => setAt(prev, col.name, iso));
                    }}
                    fullWidth
                    required={col.required}
                    InputLabelProps={{ shrink: true }}
                    autoFocus={col.autoFocus}
                  />
                );
              }

              // DEFAULT TEXT (path-aware) + DATE
              return (
                <TextField
                  key={col.name}
                  label={col.label}
                  value={getAt(formData, col.name) ?? ""}
                  onChange={(e) => setFormData((prev) => setAt(prev, col.name, e.target.value))}
                  type={col.type || "text"}
                  fullWidth
                  required={col.required}
                  autoFocus={col.autoFocus}
                  InputLabelProps={
                    col.type === "date" || col.type === "datetime" ? { shrink: true } : undefined
                  }
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>Are you sure you want to delete this item?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

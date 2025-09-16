// ========================================================
// File: components/CrudDataTable.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";
import {
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Close";
import { DateTime } from "luxon";
import DataTableView from "./DataTable";
import CrudDialogForm from "./CRUDDialogForm";

/**
 * FilterDef types:
 * - text: { key, label, type:'text', path? }
 * - select: { key, label, type:'select', options:[{label,value}], multiple?:true, path? }
 * - boolean: { key, label, type:'boolean', path? } // tri-state: any/true/false
 * - entity: { key, label, type:'entity', multiple?:true (default true), path?, url, valueKey, labelKey, mapResponse?, searchParam?:string }
 * - datetimeRange: { key, label, type:'datetimeRange', path? } // expects {start?:ISO, end?:ISO}
 *
 * `path` defaults to `key` and is used with dot-notation against the row.
 *
 * Props:
 * @param {{ schema: any[], predicate?: (row:any, active:any)=>boolean }} [filters]
 * @param {string} [storageKey] - Optional key to persist filters/search separately across multiple tables.
 * @param {(row: any) => React.ReactNode} [renderRowActions]
 * @param {boolean} [hideDefaultActions=false]
 */
export default function CrudDataTable({
  fetchItems,
  columns,
  onSave,
  onEdit,
  onDelete,
  idField = "id",
  renderRowActions,
  hideDefaultActions = false,
  filters,          // NEW: filter system
  storageKey,       // NEW: persistence namespace
}) {
  // ------- tiny helpers reused here ---------
  const getAt2 = (obj, path, fallback = undefined) => {
    if (!obj || !path) return fallback;
    const parts = String(path).split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return fallback;
      cur = cur[p];
    }
    return cur === undefined ? fallback : cur;
  };

  const cellToString2 = (val) => {
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

  const renderLocalDateTime = (value) => {
    if (!value) return "";
    const dt = value instanceof Date ? DateTime.fromJSDate(value) : DateTime.fromISO(String(value));
    if (!dt.isValid) return String(value);
    return dt.toLocal().toFormat("yyyy-LL-dd HH:mm");
  };

  // ------- persistence helpers ---------
  const DEFAULT_STORAGE_KEY = "CrudDataTable:filters:v1";
  const PERSIST_KEY = storageKey || DEFAULT_STORAGE_KEY;

  const buildDefaultFiltersState = useCallback(() => {
    const init = {};
    (filters?.schema || []).forEach((f) => {
      if (f.type === "boolean") init[f.key] = "any"; // 'any' | true | false
      else if (f.type === "select" || f.type === "entity") init[f.key] = [];
      else if (f.type === "datetimeRange") init[f.key] = { start: "", end: "" };
      else init[f.key] = ""; // text by default
    });
    return init;
  }, [filters?.schema]);

  const readPersisted = useCallback(() => {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }, [PERSIST_KEY]);

  const writePersisted = useCallback((payload) => {
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [PERSIST_KEY]);

  // ------- component state ---------
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [formValues, setFormValues] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  // search + filters (with persistence)
  const persisted = useRef(readPersisted());

  const [search, setSearch] = useState(() => persisted.current?.search ?? "");
  const [activeFilters, setActiveFilters] = useState(() => {
    const defaults = buildDefaultFiltersState();
    const fromStore = persisted.current?.activeFilters || {};
    // merge persisted values into current schema defaults (handles schema changes)
    return Object.keys(defaults).reduce((acc, key) => {
      const def = (filters?.schema || []).find((f) => f.key === key);
      const stored = fromStore[key];
      if (def?.type === "boolean") {
        acc[key] = stored === true || stored === false || stored === "any" ? stored : "any";
      } else if (def?.type === "select" || def?.type === "entity") {
        acc[key] = Array.isArray(stored) ? stored : [];
      } else if (def?.type === "datetimeRange") {
        acc[key] = (stored && typeof stored === "object")
          ? { start: stored.start || "", end: stored.end || "" }
          : { start: "", end: "" };
      } else {
        acc[key] = typeof stored === "string" ? stored : "";
      }
      return acc;
    }, {});
  });

  // Persist on change
  useEffect(() => {
    writePersisted({ search, activeFilters });
  }, [search, activeFilters, writePersisted]);

  // ---- entity option loading (with search) ----
  const [entityOptions, setEntityOptions] = useState({}); // key -> {options, loading}
  const ensureEntityBucket = (key) => {
    if (!entityOptions[key]) {
      setEntityOptions((prev) => ({ ...prev, [key]: { options: [], loading: false } }));
    }
  };
  const loadEntityOptions = useCallback(async (def, query = "") => {
    ensureEntityBucket(def.key);
    if (!def.url) return;
    setEntityOptions((prev) => ({ ...prev, [def.key]: { ...(prev[def.key] || {}), loading: true } }));
    try {
      const qParam = def.searchParam ?? "q";
      const u = query ? `${def.url}?${encodeURIComponent(qParam)}=${encodeURIComponent(query)}` : def.url;
      const res = await fetch(u);
      const json = await res.json();
      const arr = def.mapResponse
        ? def.mapResponse(json)
        : Array.isArray(json) ? json : (json?.data ?? []);
      const mapped = arr.map((it) => ({
        label: String(getAt2(it, def.labelKey)),
        value: String(getAt2(it, def.valueKey)),
        raw: it,
      }));
      setEntityOptions((prev) => ({ ...prev, [def.key]: { options: mapped, loading: false } }));
    } catch {
      setEntityOptions((prev) => ({ ...prev, [def.key]: { ...(prev[def.key] || {}), loading: false } }));
    }
  }, []); // eslint-disable-line

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // preload entity options (no query) for convenience
    (filters?.schema || []).forEach((f) => {
      if (f.type === "entity" && f.url) loadEntityOptions(f, "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => { setFormValues({}); setMode("create"); setDialogOpen(true); };
  const handleEditRow = (row) => { setFormValues(row); setMode("edit"); setDialogOpen(true); };

  const rowSearchText = (row) =>
    columns
      .map((col) => {
        if (col.type === "entity") {
          const labelFromRow = col.tablePath ? getAt2(row, col.tablePath) : getAt2(row, `${col.formPath}.name`);
          const idVal = getAt2(row, `${col.formPath}.id`);
          return [labelFromRow, idVal].map(cellToString2).join(" ");
        }
        const raw = col.selector && typeof col.selector === "function" ? col.selector(row) : getAt2(row, col.name);
        if (col.type === "select" && col.options) {
          const opts = col.options.map((o) => (typeof o === "string" ? { label: o, value: o } : o));
          const vStr = raw != null ? String(raw) : "";
          const match = opts.find((o) => o.value === vStr)?.label;
          return [vStr, match].map(cellToString2).join(" ");
        }
        return cellToString2(raw);
      })
      .join(" ")
      .toLowerCase();

  // ---- AND of all active filter conditions (overridable via filters.predicate) ----
  const applyBuiltInFilters = useCallback((row) => {
    for (const def of (filters?.schema || [])) {
      const key = def.key;
      const path = def.path || key;
      const val = activeFilters[key];

      if (def.type === "text") {
        const q = String(val || "").trim().toLowerCase();
        if (q) {
          const raw = getAt2(row, path);
          const hay = cellToString2(raw).toLowerCase();
          if (!hay.includes(q)) return false;
        }
      }

      if (def.type === "select") {
        const selected = Array.isArray(val) ? val : (val ? [val] : []);
        if (selected.length) {
          const raw = getAt2(row, path);
          const rawStr = raw != null ? String(raw) : "";
          if (!selected.some((v) => String(v.value ?? v) === rawStr)) return false;
        }
      }

      if (def.type === "boolean") {
        // tri-state: 'any' | true | false
        if (val !== "any") {
          const raw = !!getAt2(row, path);
          if (raw !== Boolean(val)) return false;
        }
      }

      if (def.type === "entity") {
        const selected = Array.isArray(val) ? val : [];
        if (selected.length) {
          // match against id on the row
          const rowId =
            getAt2(row, path) ??
            getAt2(row, `${path}.id`) ??
            getAt2(row, `${def.formPath || path}.id`);
          const rowIdStr = rowId != null ? String(rowId) : "";
          if (!selected.some((opt) => String(opt.value ?? opt) === rowIdStr)) return false;
        }
      }

      if (def.type === "datetimeRange") {
        const { start, end } = val || {};
        if (start || end) {
          const raw = getAt2(row, path);
          const dt = raw instanceof Date ? DateTime.fromJSDate(raw) : DateTime.fromISO(String(raw));
          if (!dt.isValid) return false;
          if (start) {
            const s = DateTime.fromISO(start);
            if (s.isValid && dt < s) return false;
          }
          if (end) {
            const e = DateTime.fromISO(end);
            if (e.isValid && dt > e) return false;
          }
        }
      }
    }
    return true;
  }, [activeFilters, filters?.schema]); // eslint-disable-line

  const filteredItems = useMemo(() => {
    // free-text search
    const q = search.trim().toLowerCase();
    const afterSearch = q ? items.filter((row) => rowSearchText(row).includes(q)) : items;

    // custom override?
    if (typeof filters?.predicate === "function") {
      return afterSearch.filter((row) => !!filters.predicate(row, activeFilters));
    }

    // default AND behavior
    return afterSearch.filter(applyBuiltInFilters);
  }, [items, search, applyBuiltInFilters, filters?.predicate, activeFilters]);

  const DefaultActionButtons = ({ row }) => {
    if (hideDefaultActions) return null;
    return (
      <>
        <IconButton size="small" onClick={() => handleEditRow(row)}>
          <EditIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => setDeleteId(row[idField])}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </>
    );
  };

  const actionCol = {
    name: "Actions",
    cell: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <DefaultActionButtons row={row} />
        {typeof renderRowActions === "function" ? renderRowActions(row) : null}
      </Box>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "auto",
  };

  const dtColumns = [
    ...columns.map((col) => {
      if (col.type === "checkbox") {
        return {
          name: col.label,
          selector: (row) => !!getAt2(row, col.name),
          cell: (row) => <Checkbox size="small" disabled checked={!!getAt2(row, col.name)} />,
          sortable: true,
          ...col.dataTableProps,
        };
      }
      if (col.type === "select") {
        const opts = (col.options || []).map((o) => (typeof o === "string" ? { label: o, value: o } : o));
        const valueToLabel = (v) => opts.find((o) => o.value === String(v))?.label ?? String(v ?? "");
        return {
          name: col.label,
          selector: (row) => getAt2(row, col.name),
          cell: (row) => valueToLabel(getAt2(row, col.name)),
          sortable: true,
          ...col.dataTableProps,
        };
      }
      if (col.type === "entity") {
        const valueToEntityLabel = (row) => {
          const fallback = col.tablePath ? getAt2(row, col.tablePath) : getAt2(row, `${col.formPath}.name`);
          const idVal = getAt2(row, `${col.formPath}.id`);
          if (fallback != null) return String(fallback);
          return idVal != null ? String(idVal) : "";
        };
        return {
          name: col.label,
          selector: (row) => (col.tablePath ? getAt2(row, col.tablePath) : getAt2(row, `${col.formPath}.id`)),
          cell: (row) => valueToEntityLabel(row),
          sortable: true,
          ...col.dataTableProps,
        };
      }
      if (col.type === "datetime") {
        return {
          name: col.label,
          selector: (row) => getAt2(row, col.name),
          cell: (row) => renderLocalDateTime(getAt2(row, col.name)),
          sortable: true,
          ...col.dataTableProps,
        };
      }
      return {
        name: col.label,
        selector: (row) =>
          col.selector && typeof col.selector === "function" ? col.selector(row) : getAt2(row, col.name),
        sortable: true,
        ...col.dataTableProps,
      };
    }),
    actionCol,
  ];

  // --- Filters bar UI (MUI v7 Grid) ---
  const setFilterValue = (key, val) =>
    setActiveFilters((prev) => ({ ...prev, [key]: val }));

  const FiltersBar = () => {
    if (!filters?.schema?.length) return null;
    return (
      <Box mb={2}>
        <Grid container spacing={2} alignItems="center">
          {filters.schema.map((def) => {
            const key = def.key;
            const commonProps = { size: "small", fullWidth: true };

            if (def.type === "text") {
              return (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <TextField
                    {...commonProps}
                    label={def.label}
                    value={activeFilters[key] || ""}
                    onChange={(e) => setFilterValue(key, e.target.value)}
                  />
                </Grid>
              );
            }

            if (def.type === "select") {
              const multiple = def.multiple !== false; // default true
              const options = (def.options || []).map((o) => (typeof o === "string" ? { label: o, value: o } : o));
              const current = Array.isArray(activeFilters[key]) ? activeFilters[key] : [];
              return (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Autocomplete
                    multiple={multiple}
                    options={options}
                    value={current
                      .map((v) => options.find((opt) => String(opt.value) === String(v.value ?? v)) || null)
                      .filter(Boolean)}
                    onChange={(_, newVal) => setFilterValue(key, newVal)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option.label} {...getTagProps({ index })} key={option.value} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} {...commonProps} label={def.label} placeholder="Select…" />
                    )}
                    clearOnBlur
                    clearOnEscape
                  />
                </Grid>
              );
            }

            if (def.type === "boolean") {
              return (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>{def.label}</InputLabel>
                    <Select
                      label={def.label}
                      value={activeFilters[key] ?? "any"}
                      onChange={(e) => setFilterValue(key, e.target.value)}
                    >
                      <MenuItem value="any">Any</MenuItem>
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              );
            }

            if (def.type === "entity") {
              const bucket = entityOptions[def.key] || { options: [], loading: false };
              const current = Array.isArray(activeFilters[key]) ? activeFilters[key] : [];
              return (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                  <Autocomplete
                    multiple={def.multiple !== false}
                    options={bucket.options}
                    value={current
                      .map((v) => bucket.options.find((opt) => String(opt.value) === String(v.value ?? v)) || v)}
                    onChange={(_, newVal) => setFilterValue(key, newVal)}
                    onInputChange={(_, newInput) => {
                      if (def.url) loadEntityOptions(def, newInput);
                    }}
                    getOptionLabel={(opt) => opt.label ?? String(opt)}
                    filterSelectedOptions
                    clearOnBlur
                    clearOnEscape
                    loading={bucket.loading}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option.label} {...getTagProps({ index })} key={option.value} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...commonProps}
                        label={def.label}
                        placeholder="Search & select…"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {bucket.loading ? <CircularProgress size={16} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              );
            }

            if (def.type === "datetimeRange") {
              const v = activeFilters[key] || { start: "", end: "" };
              return (
                <Grid key={key} container spacing={2} size={{ xs: 12, md: 8, lg: 6 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...commonProps}
                      label={`${def.label} — From`}
                      type="datetime-local"
                      value={v.start || ""}
                      onChange={(e) => setFilterValue(key, { ...v, start: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...commonProps}
                      label={`${def.label} — To`}
                      type="datetime-local"
                      value={v.end || ""}
                      onChange={(e) => setFilterValue(key, { ...v, end: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              );
            }

            return null;
          })}

          {/* Right-side actions */}
          <Grid size="grow">
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                size="small"
                onClick={() => {
                  const reset = buildDefaultFiltersState();
                  setActiveFilters(reset);
                  setSearch("");
                }}
              >
                Clear Filters
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // ---- Data table columns ----
  const dataTable = (
    <DataTableView
      columns={dtColumns}
      data={filteredItems}
      progressPending={loading}
      pagination
      paginationPerPage={30}            // NEW: default 30 rows
      highlightOnHover
      responsive
    />
  );

  return (
    // Fill the viewport and create a scrollable content area for the table
    <Box
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        gap: 2,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      {/* Header / search / add */}
      <Grid container spacing={2} alignItems="center">
        <Grid size="grow">
          <Typography variant="h6">Data Table</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: "auto" }}>
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
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: "auto" }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleAdd} fullWidth>
            Add
          </Button>
        </Grid>
      </Grid>

      {/* Filters */}
      <FiltersBar />

      {/* Scrollable table area */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: "auto",          // NEW: scrollable
          border: "1px solid",
          borderColor: "#e0e0e0",
          borderRadius: 1,
          p: { xs: 1, sm: 1.5 },
          // optional: dark mode border tweak
          // ...theme.applyStyles?.('dark', { borderColor: '#444d58' }),
        }}
      >
        {dataTable}
      </Box>

      {/* CRUD Dialog */}
      <CrudDialogForm
        open={dialogOpen}
        mode={mode}
        initialValues={formValues}
        onSave={async (vals) => { await onSave(vals); setDialogOpen(false); await loadItems(); }}
        onEdit={async (vals) => { await onEdit(vals); setDialogOpen(false); await loadItems(); }}
        onClose={() => setDialogOpen(false)}
        fields={columns.filter((c) => c.editable !== false).map((c) => ({
          name: c.type === "entity" ? c.formPath : c.name,
          label: c.label,
          type: c.type,
          required: c.required,
          autoFocus: c.autoFocus,
          options: c.options,
          formPath: c.formPath,
          url: c.url,
          valueKey: c.valueKey,
          labelKey: c.labelKey,
          mapResponse: c.mapResponse,
        }))}
      />

      {/* Delete dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>Are you sure you want to delete this item?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => { await onDelete(deleteId); setDeleteId(null); await loadItems(); }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

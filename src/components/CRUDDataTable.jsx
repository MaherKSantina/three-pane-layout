// ========================================================
// File: components/CrudDataTable.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
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
 * Props additions:
 * @param {(row: any) => React.ReactNode} [renderRowActions] - Inject custom row actions.
 * @param {boolean} [hideDefaultActions=false] - Hide the built-in Edit/Delete actions.
 */
export default function CrudDataTable({
  fetchItems,
  columns,
  onSave,
  onEdit,
  onDelete,
  idField = "id",
  renderRowActions,         // NEW
  hideDefaultActions = false, // NEW
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

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [formValues, setFormValues] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");

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

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((row) => rowSearchText(row).includes(q));
  }, [items, search, columns]);

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
      <Box display="flex" alignItems="center" gap={0.5}>
        <DefaultActionButtons row={row} />
        {/* Custom actions from parent */}
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
                <IconButton size="small" onClick={() => setSearch("") }>
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

// FlatItemsTableView.jsx
import * as React from "react";
import { useMemo, useCallback, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/system/Box";
import Grid from "@mui/system/Grid";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

/**
 * @typedef {Object} FlatItem
 * @property {string} id
 * @property {string|null} parentId
 * @property {number} order
 * @property {string=} refId
 * @property {string=} text
 * @property {any=} isChecked
 * @property {any} [k]
 */

/**
 * @typedef {Object} UpdateEvent
 * @property {"add"|"edit"} mode
 * @property {FlatItem} item
 */

/**
 * @param {{
 *   items: FlatItem[],
 *   basePath?: string,
 *   open: boolean,                          // dialog open controlled by parent
 *   onOpenChange?: (open: boolean) => void, // request open/close
 *   onUpdate?: (e: UpdateEvent) => void,    // called when Add/Edit clicked
 *   onUpdateComplete?: (item: FlatItem) => void, // called when Save clicked with updated/new object
 *   onDelete?: (id: string) => void,        // called when Delete clicked
 * }} props
 */
export default function FlatItemsTableView({
  items,
  basePath = "/items",
  open,
  onOpenChange,
  onUpdate,
  onUpdateComplete,
  onDelete,
}) {
  const navigate = useNavigate();
  const { id: routeId, file } = useParams();

  // If there's no route param, show root nodes (parentId === null).
  const activeParentId = routeId ?? null;

  // Index parentId -> children
  const byParentId = useMemo(() => {
    /** @type {Map<string|null, FlatItem[]>} */
    const m = new Map();
    for (const it of items || []) {
      const key = it.parentId ?? null;
      const arr = m.get(key);
      if (arr) arr.push(it);
      else m.set(key, [it]);
    }
    for (const [k, arr] of m.entries()) {
      arr.sort((a, b) => (a.order - b.order) || a.id.localeCompare(b.id));
      m.set(k, arr);
    }
    return m;
  }, [items]);

  // Index id -> item (for header text, fast lookup)
  const byId = useMemo(() => {
    /** @type {Map<string, FlatItem>} */
    const m = new Map();
    for (const it of items || []) m.set(it.id, it);
    return m;
  }, [items]);

  const activeItem = useMemo(() => {
    if (activeParentId === null) return null;
    return byId.get(activeParentId) ?? null;
  }, [activeParentId, byId]);

  const rows = useMemo(() => {
    return byParentId.get(activeParentId) ?? [];
  }, [byParentId, activeParentId]);

  const requestOpen = useCallback(
    (next) => {
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const handleNavigateTo = useCallback(
    (id) => {
      navigate(`${basePath}/${file}/${encodeURIComponent(id)}`);
    },
    [navigate, basePath]
  );

  const handleBackToRoot = useCallback(() => {
    navigate(basePath);
  }, [navigate, basePath]);

  // -------- Dialog draft state (we keep draft locally; parent controls open) --------
  const [mode, setMode] = useState(/** @type {"add"|"edit"} */ ("add"));
  const [draft, setDraft] = useState(/** @type {FlatItem|null} */ (null));

  const startAdd = useCallback(() => {
    const newItem = /** @type {FlatItem} */ ({
      id: "",
      parentId: activeParentId,
      order: rows.length,
      refId: undefined,
      text: "",
      isChecked: undefined,
    });

    setMode("add");
    setDraft(newItem);
    onUpdate?.({ mode: "add", item: newItem });
    requestOpen(true);
  }, [activeParentId, rows.length, onUpdate, requestOpen]);

  const startEdit = useCallback(
    (item) => {
      setMode("edit");
      setDraft(item);
      onUpdate?.({ mode: "edit", item });
      requestOpen(true);
    },
    [onUpdate, requestOpen]
  );

  const handleDelete = useCallback(
    (id) => {
      if (!onDelete) return;
      const ok = window.confirm(`Delete item "${id}"?`);
      if (!ok) return;
      onDelete(id);
    },
    [onDelete]
  );

  const columns = useMemo(
    () => [
      { field: "order", headerName: "Order", type: "number", width: 90 },
      {
        field: "id",
        headerName: "ID",
        minWidth: 220,
        flex: 1,
        sortable: true,
        renderCell: (params) => (
          <Link
            component="button"
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              handleNavigateTo(params.row.id);
            }}
            sx={{ textAlign: "left" }}
          >
            {params.row.id}
          </Link>
        ),
      },
      {
        field: "text",
        headerName: "Text",
        minWidth: 260,
        flex: 2,
        valueGetter: (value) => value ?? "",
      },
      {
        field: "refId",
        headerName: "Ref",
        minWidth: 180,
        flex: 1,
        renderCell: (params) => {
          const refId = params.row.refId;
          if (!refId) return "";
          return (
            <Tooltip title="View children of refId">
              <Link
                component="button"
                underline="hover"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigateTo(refId);
                }}
              >
                {refId}
              </Link>
            </Tooltip>
          );
        },
      },

      // NEW: Checked column
      {
        field: "isChecked",
        headerName: "Checked",
        width: 110,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const row = params.row;

          // Ref-only nodes should not have isChecked; display blank/disabled
          const isRefOnly = !!row.refId && (row.text == null || row.isChecked == null);
          if (isRefOnly) return "";

          const checked = row.isChecked === "all";
          const hasChildren = (byParentId.get(row.id) ?? []).length > 0;

          return (
            <Checkbox
              size="small"
              indeterminate={row.isChecked === "some"}
              checked={checked}
              disabled={hasChildren}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const nextVal = e.target.checked ? "all" : "none";
                onUpdateComplete?.({ ...row, isChecked: nextVal });
              }}
            />
          );
        },
      },

      {
        field: "actions",
        headerName: "",
        width: 110,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        align: "right",
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(params.row);
                }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(params.row.id);
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleNavigateTo, startEdit, handleDelete, onUpdateComplete]
  );

  return (
    <Box
      sx={{
        width: "100vw",
        maxWidth: "100%",
        overflowX: "hidden",
        px: { xs: 2, sm: 3 },
        py: 2,
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={2} alignItems="flex-start">
        <Grid size="grow">
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Items
          </Typography>

          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Showing children of: <b>{activeParentId ?? "(root)"}</b>
            </Typography>

            {activeParentId !== null && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {activeItem?.text ? (
                  <>
                    <b>Text:</b> {activeItem.text}
                  </>
                ) : (
                  <span style={{ opacity: 0.7 }}>(No text for this item)</span>
                )}
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid size="auto">
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={startAdd}
            >
              Add
            </Button>

            <Button
              variant="text"
              onClick={handleBackToRoot}
              disabled={activeParentId === null}
            >
              Back to root
            </Button>
          </Stack>
        </Grid>

        <Grid size={12}>
          <Box sx={{ height: 640, width: "100%", minWidth: 0 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(r) => r.id}
              disableRowSelectionOnClick
              rowHeight={40}
              headerHeight={44}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 250 },
                  printOptions: { disableToolbarButton: true },
                  csvOptions: { disableToolbarButton: true },
                },
              }}
              initialState={{
                pagination: { paginationModel: { pageSize: 50, page: 0 } },
                sorting: { sortModel: [{ field: "order", sort: "asc" }] },
              }}
              pageSizeOptions={[25, 50, 100, 200]}
              localeText={{
                noRowsLabel: "No items found for this parent (empty).",
              }}
              sx={{
                width: "100%",
                "& .MuiDataGrid-main": { overflowX: "hidden" },
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <ItemUpsertDialog
        open={!!open}
        mode={mode}
        item={draft}
        activeParentId={activeParentId}
        onClose={() => requestOpen(false)}
        onSave={(updated) => {
          onUpdateComplete?.(updated);
        }}
      />
    </Box>
  );
}

// ---------------- Dialog (Add/Edit) ----------------

const STANDARD_KEYS = new Set([
  "id",
  "parentId",
  "order",
  "refId",
  "text",
  "isChecked",
]);

/**
 * @param {{
 *   open: boolean,
 *   mode: "add"|"edit",
 *   item: FlatItem|null,
 *   activeParentId: string|null,
 *   onClose: () => void,
 *   onSave: (item: FlatItem) => void,
 * }} props
 */
function ItemUpsertDialog({ open, mode, item, activeParentId, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    id: "",
    parentId: activeParentId,
    order: 0,
    refId: "",
    text: "",
    isChecked: false
  }));

  const [error, setError] = useState("");

  // Hydrate form when dialog opens or item/mode changes
  useEffect(() => {
    if (!open) return;

    const src = item ?? {
      id: "",
      parentId: activeParentId,
      order: 0,
    };

    setForm({
      id: src.id ?? "",
      parentId: src.parentId ?? activeParentId ?? null,
      order: Number.isFinite(src.order) ? src.order : 0,
      refId: src.refId ?? "",
      text: src.text ?? "",
      isChecked: src.isChecked === "all",
    });

    setError("");
  }, [open, item, mode, activeParentId]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    setError("");

    if (mode === "add" && !form.id.trim()) {
      setError("ID is required for new items.");
      return;
    }

    const orderNum = Number(form.order);
    if (!Number.isFinite(orderNum)) {
      setError("Order must be a number.");
      return;
    }

    const isCheckedValue = form.isChecked ? "all" : "none";

    /** @type {FlatItem} */
    const updated = {
      ...(item ?? {}),
      id: mode === "add" ? form.id.trim() : item?.id ?? form.id.trim(),
      parentId: form.parentId === "" ? null : form.parentId,
      order: orderNum,
      refId: form.refId.trim() ? form.refId.trim() : undefined,
      text: form.text.trim() ? form.text : undefined,
      isChecked: isCheckedValue,
    };

    onSave(updated);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === "add" ? "Add Item" : "Edit Item"}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          {error ? (
            <Grid size={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          ) : null}

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="ID"
              value={form.id}
              onChange={(e) => setField("id", e.target.value)}
              fullWidth
              disabled={mode === "edit"}
              helperText={mode === "edit" ? "ID cannot be changed." : "Required."}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Parent ID"
              value={form.parentId ?? ""}
              onChange={(e) => setField("parentId", e.target.value)}
              fullWidth
              helperText='Use empty string to make it "root" (null).'
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) => setField("order", e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Ref ID"
              value={form.refId}
              onChange={(e) => setField("refId", e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!form.isChecked}
                  onChange={(e) => setField("isChecked", e.target.checked)}
                />
              }
              label="Checked"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Text"
              value={form.text}
              onChange={(e) => setField("text", e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function safeStringifyPretty(obj) {
  try {
    return JSON.stringify(obj ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTableView from "./DataTable";

export default function CrudDataTable({
  fetchItems,    // async () => [item, ...]
  columns,       // [{ name, selector, label, editable, type }, ...]
  onSave,        // async (data) => ...
  onEdit,        // async (data) => ...
  onDelete,      // async (id) => ...
  idField = "id" // string, e.g., "id"
}) {
  // State
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  // Fetch items
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
    // eslint-disable-next-line
  }, []);

  // Handlers
  const handleAdd = () => {
    setFormData({});
    setIsEdit(false);
    setDialogOpen(true);
  };

  const handleEdit = (row) => {
    setFormData(row);
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({});
    setIsEdit(false);
  };

  const handleSave = async () => {
    if (isEdit) {
      await onEdit(formData);
    } else {
      await onSave(formData);
    }
    handleDialogClose();
    await loadItems();
  };

  const handleDelete = async () => {
    await onDelete(deleteId);
    setDeleteId(null);
    await loadItems();
  };

  // Prepare columns
  const actionCol = {
    name: "Actions",
    cell: row => (
      <Box>
        <IconButton size="small" onClick={() => handleEdit(row)}>
          <EditIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => setDeleteId(row[idField])}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Box>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "120px"
  };

  // Columns: add Actions at the end
  const dtColumns = [
    ...columns.map(col => ({
      name: col.label,
      selector: row => row[col.name],
      sortable: true,
      ...col.dataTableProps
    })),
    actionCol
  ];

  // Render
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Data Table
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleAdd}
        >
          Add
        </Button>
      </Box>

      <DataTableView
        columns={dtColumns}
        data={items}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
      />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogTitle>{isEdit ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
            onSubmit={e => { e.preventDefault(); handleSave(); }}
          >
            {columns
              .filter(col => col.editable !== false)
              .map(col => (
                <TextField
                  key={col.name}
                  label={col.label}
                  value={formData[col.name] ?? ""}
                  onChange={e =>
                    setFormData({ ...formData, [col.name]: e.target.value })
                  }
                  type={col.type || "text"}
                  fullWidth
                  required={col.required}
                  autoFocus={col.autoFocus}
                  InputLabelProps={
                    col.type === "date" ? { shrink: true } : undefined
                  }
                />
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import { Button } from "@mui/material";
import CrudDataTable from "../CRUDDataTable";
import axios from "axios";

// SubgroupsCRUDDataTable.jsx
const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/dataparts';

export default function DatapartCRUDDataTable({onView}) {
  const columns = [
    { name: "id", label: "ID", editable: false },
    { name: "uuid", label: "UUID", editable: false },
    { name: "type", label: "Type", editable: true },
    { name: "key", label: "Key", editable: true },
    { name: "value", label: "Value", editable: true },{
        tablePath: "parent.uuid",
        formPath: "parent",
        label: "Parent",
        type: "entity",
        url: API_BASE,
        valueKey: "id",
        labelKey: "uuid",
    }
  ];

  const filters = {
  schema: [],
  // optional: custom predicate if you want to override default AND logic
  predicate: (row, active) => { 
    if(active.isRoot) {
      return row.chainRequest.id === row.id
    }
    return true
   },
};

  const fetchItems = async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch subgroups');
    return await res.json();
  };

  const onSave = async (item) => {
    const res = await axios.post(API_BASE, item);
    console.log(res.data)
    return res.data;
  };

  const onEdit = async (item) => {
    const res = await fetch(`${API_BASE}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to edit');
    return await res.json();
  };

  const onDelete = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
    return true;
  };

  return (
    <CrudDataTable
      storageKey="datapart-crud-table"
      fetchItems={fetchItems}
      columns={columns}
      onSave={onSave}
      onEdit={onEdit}
      onDelete={onDelete}
      filters={filters}
      renderRowActions={(row) => (
        <Button
          size="small"
          variant="text"
          onClick={() => onView(row.id)}
        >
          View
        </Button>
      )}
    />
  );
}

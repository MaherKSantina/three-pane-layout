import { Button } from "@mui/material";
import CrudDataTable from "../CRUDDataTable";
import axios from "axios";

// SubgroupsCRUDDataTable.jsx
const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/requests';

export default function RequestsCRUDDataTable({onView}) {
  const columns = [
    { name: "id", label: "ID", editable: false },
    { name: "text", label: "Text", editable: true },
    { name: "timestamp", label: "Timestamp", type: "datetime", required: true },
    { name: "source.id", label: "Source ID", editable: false },
    {
        tablePath: "source.agent.name",
        formPath: "source",
        label: "Source",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/agents",
        valueKey: "id",
        labelKey: "name",
    },
    { name: "destination.id", label: "Destination ID", editable: false },
    {
        tablePath: "destination.agent.name",
        formPath: "destination",
        label: "Destination",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/agents",
        valueKey: "id",
        labelKey: "name",
    },
    { name: "chainRequest.id", label: "Chain Request ID", editable: false },
  ];

  const filters = {
  schema: [
    { key: "text", label: "Text contains", type: "text", path: "text" },
    { key: "source", label: "Source", type: "entity", path: "source.agent.id", url: "https://api-digitalsymphony.ngrok.pizza/api/agents", valueKey: "id", labelKey: "name", searchParam: "q" },
    { key: "destination", label: "Destination", type: "entity", path: "destination.agent.id", url: "https://api-digitalsymphony.ngrok.pizza/api/agents", valueKey: "id", labelKey: "name", searchParam: "q" },
    { key: "isRoot", label: "Is ROOT", type: "boolean", path: "chainRequest.id" },
    { key: "time", label: "Timestamp", type: "datetimeRange", path: "timestamp" },
  ],
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
      storageKey="requests-crud-table"
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

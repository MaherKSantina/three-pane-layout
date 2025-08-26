import CrudDataTable from "../CRUDDataTable";

// SubgroupsCRUDDataTable.jsx
const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/responses';

export default function ResponsesCRUDDataTable() {
  const columns = [
    { name: "id", label: "ID", editable: false },
    { name: "text", label: "Text", editable: true },
    { name: "timestamp", label: "Timestamp", type: "datetime", required: true },
    { name: "request.id", label: "Request ID", editable: false },
    {
        tablePath: "request.text",
        formPath: "request",
        label: "Request",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/requests",
        valueKey: "id",
        labelKey: "text",
    },
    { name: "request.timestamp", label: "Request Timestamp", editable: false },
  ];

  const fetchItems = async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch subgroups');
    return await res.json();
  };

  const onSave = async (item) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to add');
    return await res.json();
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
      fetchItems={fetchItems}
      columns={columns}
      onSave={onSave}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

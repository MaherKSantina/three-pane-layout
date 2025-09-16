import CrudDataTable from "../CRUDDataTable";

// SubgroupsCRUDDataTable.jsx
const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/literatures';

export default function LiteraturesCRUDDataTable() {
  const columns = [
    { name: "id", label: "ID", editable: false },
    { name: "title", label: "Literature Title", editable: true, required: true },
    { name: "url", label: "URL", editable: true },
    { name: "studyDesign", label: "Study Design", editable: true },
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
    storageKey="literatures-crud-table"
      fetchItems={fetchItems}
      columns={columns}
      onSave={onSave}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

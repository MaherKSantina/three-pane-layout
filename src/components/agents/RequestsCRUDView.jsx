import CrudDataTable from "../CRUDDataTable";

// SubgroupsCRUDDataTable.jsx
const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/requests';

export default function RequestsCRUDDataTable() {
  const columns = [
    { name: "id", label: "ID", editable: false },
    { name: "text", label: "Text", editable: true },
    { name: "timestamp", label: "Timestamp", type: "datetime", required: true },
    { name: "source.id", label: "Source ID", editable: false },
    {
        tablePath: "source.name",
        formPath: "source",
        label: "Source",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/agents",
        valueKey: "id",
        labelKey: "name",
    },
    { name: "destination.id", label: "Destination ID", editable: false },
    {
        tablePath: "destination.name",
        formPath: "destination",
        label: "Destination",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/agents",
        valueKey: "id",
        labelKey: "name",
    },
    { name: "interaction.id", label: "Interaction ID", editable: false },
    {
        tablePath: "interaction.id",
        formPath: "interaction",
        label: "Interaction",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/interactions",
        valueKey: "id",
        labelKey: "id",
    },
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

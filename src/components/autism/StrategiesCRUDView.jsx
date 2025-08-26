import CrudDataTable from '../CRUDDataTable';

const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/strategies';

export default function StrategiesCRUDDataTable() {
  const columns = [
    { name: "id", label: "ID", editable: false },

    { name: "name", label: "Strategy Name", editable: true, required: true },

    { name: "category", label: "Category", editable: true, required: true,
    },
  ];

  const fetchItems = async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch transitions');
    return await res.json();
  };

  const onSave = async (item) => {
    const payload = {
      name: item.name,
      category: item.category,
      predictability: item.predictability,
      commonality: item.commonality,
      // Accept boolean or truthy string
      involves_identity_shift: typeof item.involves_identity_shift === "string"
        ? item.involves_identity_shift === "true"
        : !!item.involves_identity_shift,
    };
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to add');
    return await res.json();
  };

  const onEdit = async (item) => {
    const payload = {
      name: item.name,
      category: item.category,
      predictability: item.predictability,
      commonality: item.commonality,
      involves_identity_shift: typeof item.involves_identity_shift === "string"
        ? item.involves_identity_shift === "true"
        : !!item.involves_identity_shift,
    };
    const res = await fetch(`${API_BASE}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
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

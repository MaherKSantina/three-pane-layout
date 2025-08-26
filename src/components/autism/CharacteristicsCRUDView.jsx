import CrudDataTable from '../CRUDDataTable';

const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/characteristics';

export default function CharacteristicsCRUDDataTable() {
  const columns = [
    { name: "id", label: "ID", editable: false },
    { name: "name", label: "Characteristic Name", editable: true, required: true },
    { name: "description", label: "Description", editable: true, required: true },
    { name: "domain", label: "Domain", editable: true, required: true, type: "select", options: [
        {label: "Social", value: "social"},
        {label: "Non-Social", value: "nonSocial"}
    ] },
  ];

  const fetchItems = async () => {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch characteristics');
    return await res.json();
  };

  const onSave = async (item) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: item.name, domain: item.domain, description: item.description })
    });
    if (!res.ok) throw new Error('Failed to add');
    return await res.json();
  };

  const onEdit = async (item) => {
    const res = await fetch(`${API_BASE}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: item.name, domain: item.domain, description: item.description })
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

import CrudDataTable from './CRUDDataTable';

const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/matrices';

export default function MatricsCRUDDataTable() {
    const columns = [
        { name: "id", label: "ID", editable: false }, // Not editable but visible for context
      { name: "name", label: "Matrix Name", editable: true, required: true },
    ];

    // Fetch all matrices
    const fetchItems = async () => {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch matrices');
      return await res.json();
    };

    // Add new matrix
    const onSave = async (item) => {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.name })
      });
      if (!res.ok) throw new Error('Failed to add');
      return await res.json();
    };

    // Edit matrix
    const onEdit = async (item) => {
      const res = await fetch(`${API_BASE}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.name })
      });
      if (!res.ok) throw new Error('Failed to edit');
      return await res.json();
    };

    // Delete matrix
    const onDelete = async (id) => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE"
      });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
      return true;
    };

    return (
      <CrudDataTable
      storageKey="matrices-crud-table"
        fetchItems={fetchItems}
        columns={columns}
        onSave={onSave}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
}
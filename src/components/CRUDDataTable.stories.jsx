import CrudDataTable from './CRUDDataTable';

const meta = {
  component: CrudDataTable,
};

export default meta;

export const Default = {
  render() {
    const columns = [
      { name: "name", label: "Name", editable: true, required: true },
      { name: "email", label: "Email", editable: true, type: "email" },
      { name: "role", label: "Role", editable: true },
    ];

    const fetchItems = async () => [
        { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
        { id: 2, name: "Bob", email: "bob@example.com", role: "User" },
      ];

      const onSave = async (item) => { /* ... */ };
      const onEdit = async (item) => { /* ... */ };
      const onDelete = async (id) => { /* ... */ };

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
};
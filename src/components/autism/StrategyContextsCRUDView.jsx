import CrudDataTable from "../CRUDDataTable";

// SubgroupsCRUDDataTable.jsx
const API_BASE = 'https://api-digitalsymphony.ngrok.pizza/api/strategyContexts';

export default function StrategyContextsCRUDDataTable() {
  const columns = [
    { name: "id", label: "ID", editable: false },
    { name: "subgroup.id", label: "SID", editable: false },
    {
        tablePath: "subgroup.name",
        formPath: "subgroup",
        label: "Subgroup",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/subgroups",
        valueKey: "id",
        labelKey: "name",
    },
    { name: "characteristic.id", label: "CID", editable: false },
    {
        tablePath: "characteristic.name",
        formPath: "characteristic",
        label: "Characteristic",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/characteristics",
        valueKey: "id",
        labelKey: "name",
    },
    { name: "transition.id", label: "TID", editable: false },
    {
        tablePath: "transition.name",
        formPath: "transition",
        label: "Transition",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/transitions",
        valueKey: "id",
        labelKey: "name",
    },
    { name: "literature.id", label: "LID", editable: false },
    {
        tablePath: "literature.title",
        formPath: "literature",
        label: "Literature",
        type: "entity",
        url: "https://api-digitalsymphony.ngrok.pizza/api/literatures",
        valueKey: "id",
        labelKey: "title",
    },
    { name: "effectType", label: "Effect Type", editable: true, required: true, type: "select", options: [
        {label: "Benefit", value: "benefit"},
        {label: "Challenge", value: "challenge"},
        {label: "Neutral", value: "neutral"}
    ] },
    { name: "details", label: "Details", editable: true },
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
    storageKey="strategy-contexts-crud-table"
      fetchItems={fetchItems}
      columns={columns}
      onSave={onSave}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

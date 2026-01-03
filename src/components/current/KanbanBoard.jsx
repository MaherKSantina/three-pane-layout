import { Kanban } from "react-kanban-kit";

export default function KanbanBoard() {
  const dataSource = {
    root: {
      id: "root",
      title: "Root",
      children: ["col-1", "col-2", "col-3"],
      totalChildrenCount: 3,
      parentId: null,
    },
    "col-1": {
      id: "col-1",
      title: "To Do",
      children: ["task-1", "task-2"],
      totalChildrenCount: 2,
      parentId: "root",
    },
    "col-2": {
      id: "col-2",
      title: "In Progress",
      children: [],
      totalChildrenCount: 1,
      parentId: "root",
    },
    "col-3": {
      id: "col-3",
      title: "Done",
      children: [],
      totalChildrenCount: 1,
      parentId: "root",
    },
    "task-1": {
      id: "task-1",
      title: "Design Homepage",
      parentId: "col-1",
      children: [],
      totalChildrenCount: 0,
      type: "card",
      content: {
        description: "Create wireframes and mockups for the homepage",
        priority: "high",
      },
    },
    "task-2": {
      id: "task-2",
      title: "Setup Database",
      parentId: "col-1",
      children: [],
      totalChildrenCount: 0,
      type: "card",
    },
    // ... more tasks
  };

  const configMap = {
    card: {
      render: ({ data, column, index, isDraggable }) => (
        <div className="kanban-card">
          <h3>{data.title}</h3>
          {data.content?.description && <p>{data.content.description}</p>}
          <div className="card-meta">
            {data.content?.priority && (
              <span className={`priority ${data.content.priority}`}>
                {data.content.priority}
              </span>
            )}
          </div>
        </div>
      ),
      isDraggable: true,
    },
  };

  return (
    <Kanban
      dataSource={dataSource}
      configMap={configMap}
      onCardMove={(move) => {
        console.log("Card moved:", move);
        // Handle card movement
      }}
      onColumnMove={(move) => {
        console.log("Column moved:", move);
        // Handle column reordering
      }}
      viewOnly={false}
    />
  );
};
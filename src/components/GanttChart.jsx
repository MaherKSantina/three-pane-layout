// GanttChart.js
import React, { useEffect, useRef, useState } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TaskForm } from "./GanttChartTaskForm";

const GanttChart = ({
  height,
  tasks,
  links,
  expandedTaskIds = [],
  onExpand,
  onCollapse,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddLink,
  onDeleteLink,
  onUpdateTaskOrder,
  getTask, // async function from parent
}) => {
  const ganttRef = useRef();
  const [gridVisible, setGridVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState("day");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState(null);

  // --- Intercept DHTMLX events for + and edit ---
  // useEffect(() => {
  //   // Prevent default add dialog
  //   gantt.attachEvent("onTaskCreated", () => false);

  //   // "+" on grid row: open form as create child
  //   const gridRowClickId = gantt.attachEvent("onTaskClick", function (id, e) {
  //     if (e.target && e.target.classList.contains("gantt_add")) {
  //       setSelectedParentId(id);
  //       setSelectedTaskId(null);
  //       setFormOpen(true);
  //       return false; // prevent default add
  //     }

  //     if (e.target.classList.contains("gantt-btn-delete")) {
  //       if (window.confirm("Are you sure you want to delete this task?")) {
  //         // Remove from gantt view
  //         gantt.deleteTask(id);
  //         // Let parent handle API / state
  //         if (onDeleteTask) {
  //           onDeleteTask(id);
  //         }
  //       }
  //       return false;
  //     }

  //     return true;
  //   });

  //   // Double-click task: open edit form
  //   const dblClickId = gantt.attachEvent("onTaskDblClick", function (id) {
  //     const task = tasks.find((t) => String(t.id) === String(id));
  //     if (task) {
  //       setSelectedTaskId(task.id);
  //       setSelectedParentId(task.parent || null);
  //       setFormOpen(true);
  //     }
  //     return false; // prevent default editor
  //   });

  //   return () => {
  //     gantt.detachEvent(gridRowClickId);
  //     gantt.detachEvent(dblClickId);
  //   };
  // }, [tasks, onDeleteTask]);

  // Attach handlers (CRUD-ish hooks)
  useEffect(() => {
    const handlers = [
      gantt.attachEvent("onAfterTaskDelete", (id) => {
        if (onDeleteTask) onDeleteTask(id);
      }),
      gantt.attachEvent("onAfterLinkAdd", (id, link) => {
        if (onAddLink) onAddLink(link);
      }),
      gantt.attachEvent("onAfterLinkDelete", (id, link) => {
        if (onDeleteLink) onDeleteLink(id, link);
      }),
      gantt.attachEvent("onTaskOpened", (id) => {
        if (onExpand) onExpand(id);
      }),
      gantt.attachEvent("onTaskClosed", (id) => {
        if (onCollapse) onCollapse(id);
      }),
      gantt.attachEvent("onRowDragEnd", function (id, target) {
        let before = null;
        let after = null;
        let targetId;

        if (typeof target === "string" && target.startsWith("next:")) {
          targetId = target.substr("next:".length);
          after = targetId;
        } else if (target) {
          targetId = target;
          before = targetId;
        }

        if (onUpdateTaskOrder) {
          onUpdateTaskOrder({ id, before, after });
        }
      }),
    ];

    return () => {
      handlers.forEach((id) => gantt.detachEvent(id));
    };
  }, [onAddLink, onDeleteLink, onExpand, onCollapse, onUpdateTaskOrder, onDeleteTask]);

  // Init chart once
  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.config.show_grid = gridVisible;
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;

    applyZoomInternal(zoomLevel);

    gantt.config.columns = [
      { name: "text", label: "Task name", width: "500", tree: true },
      // { name: "start_date", label: "Start time", width: "200", align: "center" },
      // { name: "end_date", label: "End time", width: "200", align: "center" },
      // { name: "add", width: 44 },
      // {
      //   name: "delete",
      //   label: "",
      //   width: 40,
      //   template: function () {
      //     return "<button class='gantt-btn-delete'>🗑️</button>";
      //   },
      // },
    ];

    gantt.config.readonly = true

    gantt.templates.task_style = function (start, end, task) {
    if (task.color) {
      return `background-color:${task.color};border-color:${task.color};`;
    }
    return "";
  };

    gantt.init(ganttRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh data whenever tasks / links / expandedTaskIds change
  useEffect(() => {
    gantt.clearAll();
    gantt.parse({ data: tasks.map(task => {
      return {
        ...task,
        start_date: task.start_date ? new Date(task.start_date) : null,
        end_date: task.end_date ? new Date(task.end_date) : null
      }
    }) || [], links: links || [] });

    // Open tasks that should be expanded
    for(let t of tasks) {
      gantt.open(t.id);
    }
  }, [tasks, links, expandedTaskIds]);

  const applyZoomInternal = (level) => {
    switch (level) {
      case "hour":
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d %M";
        gantt.config.subscales = [{ unit: "hour", step: 1, date: "%H:%i" }];
        gantt.config.scale_height = 60;
        break;
      case "day":
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d %M";
        gantt.config.subscales = [];
        gantt.config.scale_height = 40;
        break;
      case "week":
        gantt.config.scale_unit = "week";
        gantt.config.date_scale = "Week #%W";
        gantt.config.subscales = [{ unit: "day", step: 1, date: "%D" }];
        gantt.config.scale_height = 50;
        break;
      case "month":
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F, %Y";
        gantt.config.subscales = [{ unit: "week", step: 1, date: "Week #%W" }];
        gantt.config.scale_height = 60;
        break;
      default:
        break;
    }
    gantt.render();
  };

  const toggleGrid = () => {
    gantt.config.show_grid = !gantt.config.show_grid;
    setGridVisible(gantt.config.show_grid);
    gantt.render();
  };

  const handleZoomChange = (e) => {
    const level = e.target.value;
    setZoomLevel(level);
    applyZoomInternal(level);
  };

  // --- Main + Button for root tasks ---
  const handleAddRoot = () => {
    setSelectedParentId(null);
    setSelectedTaskId(null);
    setFormOpen(true);
  };

  // --- Submit logic for form ---
  const handleFormSubmit = async (data) => {
    if (selectedTaskId && onUpdateTask) {
      await onUpdateTask(selectedTaskId, data);
    } else if (!selectedTaskId && onAddTask) {
      await onAddTask({
        ...data,
        parent: selectedParentId || null,
      });
    }

    setFormOpen(false);
    setSelectedTaskId(null);
    setSelectedParentId(null);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <button onClick={toggleGrid}>
          {gridVisible ? "Hide Task List" : "Show Task List"}
        </button>

        <label>
          {" "}
          Zoom:
          <select value={zoomLevel} onChange={handleZoomChange}>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>

        <Fab
          color="primary"
          size="small"
          sx={{ marginLeft: "auto" }}
          onClick={handleAddRoot}
          aria-label="Add Task"
        >
          <AddIcon />
        </Fab>
      </div>

      <div ref={ganttRef} style={{ height, width: "100%" }} />

      {/* Modal Task Form */}
      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        taskId={selectedTaskId}
        getTask={getTask}
        parentTasks={(tasks || []).map((t) => ({ id: t.id, text: t.text }))}
        editing={!!selectedTaskId}
        parent={selectedParentId}
        text={selectedTaskId ? (tasks.find(t => String(t.id) === String(selectedTaskId))?.text || "") : ""}
      />
    </div>
  );
};

function areEqual(prevProps, nextProps) {
  // Only care about these
  const sameTasks = prevProps.tasks === nextProps.tasks;
  const sameLinks = prevProps.links === nextProps.links;
  const sameExpanded = prevProps.expandedTaskIds === nextProps.expandedTaskIds;

  return sameTasks && sameLinks && sameExpanded;
}

export default React.memo(GanttChart, areEqual);

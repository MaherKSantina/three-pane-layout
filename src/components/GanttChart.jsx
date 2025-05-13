import React, { useEffect, useRef, useState } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { useStore } from "../contexts/StoreContext";

const normalizeGanttData = (data = []) =>
  data.map((task) => ({
    ...task,
    start_date: new Date(task.start_date),
    end_date: task.end_date ? new Date(task.end_date) : undefined,
    open: true
  }));

const GanttChart = () => {
  const ganttRef = useRef();
  const [gridVisible, setGridVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState("day");

  const {
    tasks,
    links,
    fetchData,
    addTask,
    updateTask,
    deleteTask,
    addLink,
    deleteLink,
  } = useStore();

  // 🧠 Attach handlers only once
  useEffect(() => {
    const handlers = [
      gantt.attachEvent("onAfterTaskAdd", (id, task) => addTask(task)),
      gantt.attachEvent("onAfterTaskUpdate", (id, task) => updateTask(id, task)),
      gantt.attachEvent("onAfterTaskDelete", (id) => deleteTask(id)),
      gantt.attachEvent("onAfterLinkAdd", (id, link) => addLink(link)),
      gantt.attachEvent("onAfterLinkDelete", (id) => deleteLink(id)),
    ];

    return () => {
      handlers.forEach((id) => gantt.detachEvent(id));
    };
  }, []);

  // 🧠 Init chart once
  useEffect(() => {
    fetchData();
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.config.show_grid = gridVisible;
    applyZoom(zoomLevel);
    gantt.init(ganttRef.current);
  }, []);

  // 🔁 Refresh data when tasks or links change
  useEffect(() => {
    const expanded = [];
    gantt.eachTask((t) => t.$open && expanded.push(t.id));

    gantt.clearAll();
    gantt.parse({ data: normalizeGanttData(tasks), links });

    expanded.forEach((id) => gantt.open(id));
  }, [tasks, links]);

  const applyZoom = (level) => {
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
    applyZoom(level);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <button onClick={toggleGrid}>
          {gridVisible ? "Hide Task List" : "Show Task List"}
        </button>
        <label>
          Zoom:
          <select value={zoomLevel} onChange={handleZoomChange}>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>
      </div>
      <div ref={ganttRef} style={{ height: "100vh", width: "100%" }} />
    </div>
  );
};

export default GanttChart;

export function normalizeGanttData(data = []) {
    return data.map((task) => ({
      ...task,
      start_date: new Date(task.start_date),
      end_date: task.end_date ? new Date(task.end_date) : undefined,
    }));
  }
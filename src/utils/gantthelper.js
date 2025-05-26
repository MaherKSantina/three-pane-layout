export function normalizeGanttData(data = []) {
    return data.map((task) => ({
      ...task,
      start_date: new Date(task.start_date),
      end_date: task.end_date ? new Date(task.end_date) : undefined,
    }));
  }

  export function craftTreeToGanttData(nodes) {
    const tasks = [];
    let taskId = Date.now();
    const visited = new Set();
  
    function traverse(nodeId, parentGanttTask = null) {
      if (!nodeId || visited.has(nodeId)) return; // Skip duplicates
      visited.add(nodeId);
  
      const node = nodes[nodeId];
      if (!node) return;
  
      // Handle CSCEDate (pass down its start/end to children)
      if (node.type && node.type.resolvedName === "CSCEDate") {
        const dropAreaId = node.linkedNodes && node.linkedNodes["rect-drop-area"];
        if (dropAreaId) {
          traverse(dropAreaId, {
            startDate: node.props.startDate,
            endDate: node.props.endDate,
          });
        }
      } else if (node.type && node.type.resolvedName === "DynamicTask") {
        tasks.push({
          id: ++taskId,
          start_date: parentGanttTask?.startDate || null,
          end_date: parentGanttTask?.endDate || null,
          text: node.props.name || "",
          duration: 0,
          $resourceAssignments: [],
          progress: 0,
          $no_start: !parentGanttTask?.startDate,
          $no_end: !parentGanttTask?.endDate,
          $rendered_type: "task",
          $calculate_duration: true,
          $effective_calendar: "global",
          $source: [],
          $target: [],
          parent: 0,
          $rendered_parent: 0,
          $level: 0,
          $expanded_branch: true,
          $index: 0,
          $local_index: 0,
          open: true,
          $open: true,
        });
      }
  
      // Always traverse nodes array
      if (Array.isArray(node.nodes)) {
        node.nodes.forEach((childId) => traverse(childId, parentGanttTask));
      }
  
      // Only traverse linkedNodes for non-special cases if needed
      // (for your schema, traversing linkedNodes always is fine if visited set is used)
      if (node.linkedNodes) {
        Object.values(node.linkedNodes).forEach((childId) =>
          traverse(childId, parentGanttTask)
        );
      }
    }
  
    if (nodes.ROOT && Array.isArray(nodes.ROOT.nodes)) {
      nodes.ROOT.nodes.forEach((nodeId) => traverse(nodeId));
    }
  
    return {
      tasks,
      links: [],
    };
  }
  
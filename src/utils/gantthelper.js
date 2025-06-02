const { DateTime } = require('luxon');

export function normalizeGanttData(data = []) {
    return data.map((task) => ({
      ...task,
      start_date: new Date(task.start_date),
      end_date: task.end_date ? new Date(task.end_date) : undefined,
    }));
  }
  
  // --- Main conversion function ---
  export function craftTreeToGanttData(nodes) {
    const tasks = [];
    const links = [];
    let taskId = Date.now();
    const visited = new Set();

    function getOffset(nodeId, parentChain) {
      // Find if this node is inside any Sequence containers
      let totalOffset = 0;
      
      // Go through parent chain from most recent to oldest
      for (let i = parentChain.length - 1; i >= 0; i--) {
        const parent = parentChain[i];
        
        if (parent.type === "Sequential") {
          // Find the position of current node (or its ancestor) in this sequence
          const dropAreaNode = nodes[parent.dropAreaId];
          if (dropAreaNode && dropAreaNode.nodes) {
            // Find which child in the sequence contains our target node
            let childIndex = -1;
            for (let j = 0; j < dropAreaNode.nodes.length; j++) {
              const childId = dropAreaNode.nodes[j];
              if (childId === nodeId || isDescendantOf(nodeId, childId)) {
                childIndex = j;
                break;
              }
            }
            
            if (childIndex > 0) {
              // Calculate offset from all previous siblings
              for (let k = 0; k < childIndex; k++) {
                const siblingId = dropAreaNode.nodes[k];
                const siblingDuration = getNodeDuration(siblingId, parentChain.slice(0, i + 1));
                totalOffset += siblingDuration;
              }
            }
          }
        } else if (parent.type === "CSCEDate") {
          // We've reached a CSCEDate, stop here
          break;
        }
      }
      
      return totalOffset;
    }
    
    function isDescendantOf(targetNodeId, ancestorNodeId) {
      // Check if targetNodeId is a descendant of ancestorNodeId
      const visited = new Set();
      
      function checkDescendant(nodeId) {
        if (!nodeId || visited.has(nodeId)) return false;
        visited.add(nodeId);
        
        if (nodeId === targetNodeId) return true;
        
        const node = nodes[nodeId];
        if (!node) return false;
        
        // Check direct children
        if (Array.isArray(node.nodes)) {
          for (const childId of node.nodes) {
            if (checkDescendant(childId)) return true;
          }
        }
        
        // Check linked nodes
        if (node.linkedNodes) {
          for (const childId of Object.values(node.linkedNodes)) {
            if (checkDescendant(childId)) return true;
          }
        }
        
        return false;
      }
      
      return checkDescendant(ancestorNodeId);
    }
    
    function getNodeDuration(nodeId, parentChain) {
      const node = nodes[nodeId];
      if (!node) return 0;
    
      // 1. FixedTask: just its duration
      if (node.type && node.type.resolvedName === "FixedTask") {
        try {
          const duration = parseInt(node.props.duration ?? 0);
          return isNaN(duration) ? 0 : duration;
        } catch {
          return 0;
        }
      }
    
      // 2. Sequential: sum of all child durations
      if (node.type && node.type.resolvedName === "Sequential") {
        const dropAreaId = node.linkedNodes && node.linkedNodes["rect-drop-area"];
        if (dropAreaId && nodes[dropAreaId] && Array.isArray(nodes[dropAreaId].nodes)) {
          let total = 0;
          for (const childId of nodes[dropAreaId].nodes) {
            total += getNodeDuration(childId, [
              ...parentChain,
              { type: "Sequential", nodeId, dropAreaId }
            ]);
          }
          return total;
        }
        return 0;
      }
    
      // 3. ParentTask: max duration among direct children
      if (node.type && node.type.resolvedName === "ParentTask") {
        const dropAreaId = node.linkedNodes && node.linkedNodes["rect-drop-area"];
        if (dropAreaId && nodes[dropAreaId] && Array.isArray(nodes[dropAreaId].nodes)) {
          let maxDur = 0;
          for (const childId of nodes[dropAreaId].nodes) {
            const dur = getNodeDuration(childId, [
              ...parentChain,
              { type: "ParentTask", nodeId, dropAreaId }
            ]);
            if (dur > maxDur) maxDur = dur;
          }
          return maxDur;
        }
        return 0;
      }
    
      // 4. Fallback
      return 0;
    }    

    function applyTaskBusinessLogic(node, parentChain, nodeId, childrenInfo) {
      let update = {};
  
      if(["DynamicTask"].includes(node.type.resolvedName)) {
        const parentCSCEDate = parentChain.find(
          (p) => p.type === "CSCEDate"
        );
        if (!parentCSCEDate) {
          update.start_date = DateTime.now().toISO()
          update.color = "red";
        } else {
          update.start_date = parentCSCEDate.startDate
          update.end_date = parentCSCEDate.endDate
        }
      }
  
      if(["FixedTask"].includes(node.type.resolvedName)) {
        const parentCSCEDate = parentChain.find(
          (p) => p.type === "CSCEDate"
        );
        if (!parentCSCEDate) {
          update.start_date = DateTime.now().toISO()
          update.color = "red";
        } else {
          // Check if this task is inside a Sequence
          const hasSequentialParent = parentChain.some(p => p.type === "Sequential");
          let startDate;
          
          if (hasSequentialParent) {
            // Calculate offset based on position in sequence(s)
            const offsetHours = getOffset(nodeId, parentChain);
            startDate = DateTime.fromISO(parentCSCEDate.startDate, { zone: "utc" }).plus({ hours: offsetHours });
          } else {
            startDate = DateTime.fromISO(parentCSCEDate.startDate, { zone: "utc" });
          }
          
          update.start_date = startDate.toISO();
          
          let duration = 0
          try {
            if(!isNaN(parseInt(node.props.duration ?? 0)))
            duration = parseInt(node.props.duration ?? 0)
          } catch {
  
          }
          update.end_date = startDate.plus({hours: duration}).toISO()
        }

        const nearestParentTask = parentChain.slice().reverse().find(p => p.type === "ParentTask" && p.ganttId);
        if (nearestParentTask) {
          update.parent = nearestParentTask.ganttId;
          update.$rendered_parent = nearestParentTask.ganttId;
        }

        if(parentCSCEDate && update.end_date > parentCSCEDate.endDate) {
          update.color = "red"
        }
      }

      if(["ParentTask"].includes(node.type.resolvedName)) {
        const parentCSCEDate = parentChain.find(
          (p) => p.type === "CSCEDate"
        );
        if (!parentCSCEDate) {
          update.start_date = DateTime.now().toISO()
          update.color = "red";
        } else {
          // Check if this task is inside a Sequence
          const hasSequentialParent = parentChain.some(p => p.type === "Sequential");
          let startDate;
          
          if (hasSequentialParent) {
            // Calculate offset based on position in sequence(s)
            const offsetHours = getOffset(nodeId, parentChain);
            startDate = DateTime.fromISO(parentCSCEDate.startDate, { zone: "utc" }).plus({ hours: offsetHours });
          } else {
            startDate = DateTime.fromISO(parentCSCEDate.startDate, { zone: "utc" });
          }
          
          update.start_date = startDate.toISO();
          
          let duration = 1
          // try {
          //   if(!isNaN(parseInt(node.props.duration ?? 0)))
          //   duration = parseInt(node.props.duration ?? 0)
          // } catch {
  
          // }
          update.end_date = startDate.plus({hours: duration}).toISO()
        }

        const nearestParentTask = parentChain.slice().reverse().find(p => p.type === "ParentTask" && p.ganttId);
        if (nearestParentTask) {
          update.parent = nearestParentTask.ganttId;
          update.$rendered_parent = nearestParentTask.ganttId;
        }

        if(parentCSCEDate && update.end_date > parentCSCEDate.endDate) {
          update.color = "red"
        }
      }

      // if(node.type.resolvedName === "ParentTask") {
      //   // childrenInfo: [{task, node}, ...]
      //   const startDates = childrenInfo.map(c => c.task?.start_date).filter(Boolean);
      //   const endDates = childrenInfo.map(c => c.task?.end_date).filter(Boolean);
      //   const minStart = startDates.length ? startDates.reduce((a, b) => a < b ? a : b) : null;
      //   const maxEnd = endDates.length ? endDates.reduce((a, b) => a > b ? a : b) : null;
      //   update.start_date = minStart
      //   update.end_date = maxEnd
      // }
  
      update.$no_start = !update.start_date
      update.$no_end = !update.end_date
  
      // Add more business logic here as needed (for ParentTask, Sequential, etc.)
      return update;
    }

    function createEmptyTask() {
      return {
        $resourceAssignments: [],
        $rendered_type: "task",
        $calculate_duration: true,
        $effective_calendar: "global",
        $source: [],
        $target: [],
        $level: 0,
        $expanded_branch: true,
        $index: 0,
        $local_index: 0,
        open: true,
        $open: true,
      }
    }
  
    // Helper to find nearest parent property in the chain
    const findParentProp = (parentChain, prop, type = null) => {
      for (let i = parentChain.length - 1; i >= 0; --i) {
        if ((type === null || parentChain[i].type === type) && parentChain[i][prop]) {
          return parentChain[i][prop];
        }
      }
      return null;
    };
  
    function traverse(nodeId, parentChain = []) {
      if (!nodeId || visited.has(nodeId)) return;
      visited.add(nodeId);
  
      const node = nodes[nodeId];
      if (!node) return;
  
      // --- 1. CSCEDate: Pass down its start/end to children in the parent chain ---
      if (node.type && node.type.resolvedName === "CSCEDate") {
        const startDate = node.props.startDate;
        const endDate = node.props.endDate;
        const dropAreaId = node.linkedNodes && node.linkedNodes["rect-drop-area"];
        if (dropAreaId) {
          traverse(
            dropAreaId,
            [...parentChain, { type: "CSCEDate", startDate, endDate }]
          );
        }
        return;
      }
  
      // --- 2. Sequence: Pass sequence info to children in the parent chain ---
      if (node.type && node.type.resolvedName === "Sequential") {
        const dropAreaId = node.linkedNodes && node.linkedNodes["rect-drop-area"];
        if (dropAreaId) {
          traverse(
            dropAreaId,
            [...parentChain, { type: "Sequential", nodeId, dropAreaId }]
          );
        }
        return;
      }
  
      // --- 3. DynamicTask ---
      if (node.type && node.type.resolvedName === "DynamicTask") {
        let task = createEmptyTask()
        Object.assign(task, {
          id: ++taskId,
          text: node.props.name || ""
        })
        Object.assign(task, applyTaskBusinessLogic(node, parentChain, nodeId));
        tasks.push(task);
        return;
      }
  
      // --- 4. FixedTask ---
      if (node.type && node.type.resolvedName === "FixedTask") {
        let task = createEmptyTask()
        Object.assign(task, {
          id: ++taskId,
          text: node.props.name || ""
        })
        Object.assign(task, applyTaskBusinessLogic(node, parentChain, nodeId));
        tasks.push(task);
        return;
      }

      if (node.type && node.type.resolvedName === "ParentTask") {
        // 1. Generate the parent Gantt ID
        const parentGanttId = ++taskId;
        const dropAreaId = node.linkedNodes && node.linkedNodes["rect-drop-area"];
        let childTasks = [];
        let childStartDates = [];
        let childEndDates = [];
        // 2. Traverse children FIRST, passing parentGanttId
        if (dropAreaId && nodes[dropAreaId] && Array.isArray(nodes[dropAreaId].nodes)) {
          nodes[dropAreaId].nodes.forEach((childId) => {
            traverse(childId, [
              ...parentChain,
              { type: "ParentTask", ganttId: parentGanttId }
            ]);
          });
        }
        // 3. Collect all immediate children with parent = parentGanttId
        for (const t of tasks) {
          if (t.parent === parentGanttId && t.start_date && t.end_date) {
            childTasks.push(t);
            childStartDates.push(t.start_date);
            childEndDates.push(t.end_date);
          }
        }
        // 4. Calculate min/max
        const minStart = childStartDates.length ? childStartDates.reduce((a, b) => a < b ? a : b) : null;
        const maxEnd = childEndDates.length ? childEndDates.reduce((a, b) => a > b ? a : b) : null;
        // 5. Create the ParentTask Gantt task with the *same* ID
        let parentTask = createEmptyTask();
        Object.assign(parentTask, {
          id: parentGanttId,
          text: node.props.name || "",
          start_date: minStart,
          end_date: maxEnd,
          $rendered_type: "project",
          type: "project",
          parent: (parentChain.slice().reverse().find(p => p.type === "ParentTask" && p.ganttId) || {}).ganttId || 0,
          $rendered_parent: (parentChain.slice().reverse().find(p => p.type === "ParentTask" && p.ganttId) || {}).ganttId || 0,
        });
        tasks.push(parentTask);
        return;
      }

      if(node.type && node.type.resolvedName === "Async") {
        let t = craftNodeToTree(nodeId, nodes)
        console.log(t)
      }
  
      // --- 5. Fallback: generic traverse for nodes/linkedNodes ---
      if (Array.isArray(node.nodes)) {
        node.nodes.forEach((childId) => {
          traverse(childId, parentChain);
        });
      }
      if (node.linkedNodes) {
        Object.values(node.linkedNodes).forEach((childId) => {
          traverse(childId, parentChain);
        });
      }
    }
  
    if (nodes.ROOT && Array.isArray(nodes.ROOT.nodes)) {
      nodes.ROOT.nodes.forEach((nodeId) => traverse(nodeId, []));
    }
  
    return {
      tasks,
      links,
    };
  }
  
  export function craftNodeToTree(nodeId, nodes) {
    const node = nodes[nodeId];
    if (!node) return null;
  
    // Build children object for linkedNodes
    let children = undefined;
    if (node.linkedNodes && Object.keys(node.linkedNodes).length > 0) {
      children = {};
      for (const [slot, linkedNodeId] of Object.entries(node.linkedNodes)) {
        const linkedNode = nodes[linkedNodeId];
        // Each slot is always a canvas, so look for .nodes array
        if (linkedNode && Array.isArray(linkedNode.nodes)) {
          children[slot] = linkedNode.nodes
            .map(childId => craftNodeToTree(childId, nodes))
            .filter(Boolean);
          // Optionally: include the linked node itself in the children array
          // (commented out, but you can use this if you want)
          // children[slot].unshift(craftNodeToTree(linkedNodeId, nodes));
        }
      }
    }
  
    // Compose the result object
    const result = {
      id: nodeId,
      ...node,
      ...(children ? { children } : {}),
    };
  
    return result;
  }
  










  function expandNodeTree(nodeId, nodesMap) {
    const node = nodesMap[nodeId];
    if (!node) return null;
  
    // Build base
    let result = {
      id: nodeId,
      ...node,
      // We'll overwrite nodes and linkedNodes below to hold objects instead of IDs
    };
  
    // Expand `nodes` array
    if (Array.isArray(node.nodes)) {
      result.nodes = node.nodes.map(childId => expandNodeTree(childId, nodesMap));
    }
  
    // Expand `linkedNodes` values
    if (node.linkedNodes && typeof node.linkedNodes === 'object') {
      result.linkedNodes = {};
      for (const [key, linkedId] of Object.entries(node.linkedNodes)) {
        result.linkedNodes[key] = expandNodeTree(linkedId, nodesMap);
      }
    }
  
    return result;
  }


// Helper: Converts a Craft node (and its children) to tree format for POST body
// (Assumes you already have this function)
// function craftNodeToTree(nodeId, nodes) { ... }

function isCanvas(nodeType) {
  // Define which types should be canvas nodes
  const canvasTypes = new Set([
    "ParentTask",
    "Sequential",
    "CSCEDate"
  ]);
  return canvasTypes.has(nodeType);
}

export async function handleCraftTreeWithAsyncNodes(nodes) {

  // Helper: Recursively process nodes and replace Async nodes
  async function processNode(nodeId, nodesMap, parentId = null) {
    const node = nodesMap[nodeId];
    if (!node) return { nodesMap };

    let nodesMapResult = { ...nodesMap };
    if (Array.isArray(node.nodes)) {
      for (const childId of node.nodes) {
        const res = await processNode(childId, nodesMapResult, nodeId);
        nodesMapResult = res.nodesMap;
      }
    }
    if (node.linkedNodes) {
      for (const childId of Object.values(node.linkedNodes)) {
        const res = await processNode(childId, nodesMapResult, nodeId);
        nodesMapResult = res.nodesMap;
      }
    }

    // If this is an Async node, do the API call and replace it
    if (node.type?.resolvedName === "Async" && node.props?.type && node.props?.type !== "") {
      const expandedTree = expandNodeTree(nodeId, nodesMapResult);
      // POST async node as body
      const resp = await fetch(
        `http://localhost:3000/async/${node.props?.type || ""}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expandedTree),
        }
      );
      let apiData
      try {
        apiData = await resp.json();
      } catch(e) {
        console.log(e)
        return { nodesMapResult }
      }

      // Recursively flatten API response to Craft nodes
      function flattenApiNode(apiNode, parent) {
        if (!apiNode) return {};
        const nodeId = apiNode.id || Math.random().toString(36).slice(2);
        const craftNode = {
          type: { resolvedName: apiNode.type },
          isCanvas: isCanvas(apiNode.type),
          props: apiNode.props || {},
          displayName: apiNode.type,
          custom: {},
          hidden: false,
          parent,
          nodes: [],
          linkedNodes: {},
        };
        let newNodes = { [nodeId]: craftNode };
        let updatedParents = {}
        // Dropzone handling
        if (apiNode.children && typeof apiNode.children === "object") {
          for (const dropzoneKey in apiNode.children) {
            const childrenArr = apiNode.children[dropzoneKey];
            const dropzoneId = Math.random().toString(36).slice(2);
            craftNode.linkedNodes[dropzoneKey] = dropzoneId;
            newNodes[dropzoneId] = {
              type: "div",
              isCanvas: true,
              props: {
                style: {
                  width: "100%",
                  minHeight: 40,
                  border: "2px dashed #b5cffa",
                  background: "#fff",
                  borderRadius: 6,
                  padding: 14,
                  display: "flex",
                  alignItems: "center",
                  overflow: "auto",
                  transition: "border 0.18s"
                }
              },
              displayName: "div",
              custom: {},
              parent: nodeId,
              hidden: false,
              nodes: [],
              linkedNodes: {}
            };
            for (const child of childrenArr) {
              if (child.type === "reference") {
                newNodes[dropzoneId].nodes.push(child.id);
                updatedParents[child.id] = dropzoneId
              } else {
                const {nodes: childResult} = flattenApiNode(child, dropzoneId);
                const ids = Object.keys(childResult);
                const rootId = ids.find(id => childResult[id].parent === dropzoneId);
                if (rootId) newNodes[dropzoneId].nodes.push(rootId);
                Object.assign(newNodes, childResult);
              }
            }
          }
        }
        return { nodes: newNodes, rootId: nodeId, updatedParents};
      }

      // Remove Async node from nodesMap
      const updatedNodes = { ...nodesMapResult };
      for(let k of Object.keys(node.linkedNodes)) {
        delete updatedNodes[node.linkedNodes[k]]
      }
      delete updatedNodes[nodeId];

      // Flatten and add new nodes
      const { nodes: flatNewNodes, rootId: newRootId, updatedParents } = flattenApiNode(apiData, parentId);
      Object.entries(flatNewNodes).forEach(([id, n]) => {
        updatedNodes[id] = n;
      });

      Object.entries(updatedParents).forEach(([k, v]) => {
        updatedNodes[k].parent = v
      })

      if (parentId && updatedNodes[parentId]) {
        if (Array.isArray(updatedNodes[parentId].nodes)) {
          updatedNodes[parentId].nodes = updatedNodes[parentId].nodes.map(
            id => id === nodeId ? newRootId : id
          );
        }
        // Handle linkedNodes if that's where the node was
        for (let k in updatedNodes[parentId].linkedNodes) {
          if (updatedNodes[parentId].linkedNodes[k] === nodeId) {
            updatedNodes[parentId].linkedNodes[k] = newRootId;
          }
        }
      }

      // Recursively process new nodes (in case they contain Async too!)
      let finalNodesMap = {}
      for (const [id, n] of Object.entries(flatNewNodes)) {
         const res = await processNode(id, updatedNodes, n.parent);
         finalNodesMap = {...finalNodesMap, ...res.nodesMap}
      }
      return { nodesMap: finalNodesMap };
    }

    return { nodesMap: nodesMapResult };
  }

  // Start recursion from all ROOT children
  let nodesMap = { ...nodes };
  if (nodes.ROOT && Array.isArray(nodes.ROOT.nodes)) {
    for (const nodeId of nodes.ROOT.nodes) {
      const res = await processNode(nodeId, nodesMap, "ROOT");
      nodesMap = res.nodesMap;
    }
  }
  return nodesMap;
}


